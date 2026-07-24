import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Info, Wallet, ChevronRight, Check, LineChart, CalendarCheck, ScanLine, Image, BadgeCheck, Loader2Icon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, registerUser, getSignInReward, SIGN_IN_REWARD_CAP_DAYS } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { GAME, HOME_FEATURES, BRAND, getLevel, MINI_PROGRAMS } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import SignInDialog from "@/components/dialogs/SignInDialog";
import RealNameDialog from "@/components/dialogs/RealNameDialog";
import CheckInRulesDialog from "@/components/dialogs/CheckInRulesDialog";

function formatReward(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// 下拉手势双语义：小幅/快速下拉→内容刷新，继续下拉过阈值→唤出小程序面板（展开高度按视口 80% 动态计算，见 PULL_MAX）
const PULL_RESISTANCE = 0.55;
const REFRESH_MIN = 20; // 判定为有效下拉手势（而非误触）的最小位移
const REFRESH_THRESHOLD = 40; // 松手位移 ≥ 此值即触发刷新
const PANEL_THRESHOLD = 64; // 松手位移 ≥ 此值改为唤出小程序面板，优先级高于刷新
const REFRESH_DISPLAY_HEIGHT = 56; // 刷新中，指示区固定展示的高度
const FAST_FLICK_VELOCITY = 0.5; // px/ms，松手前瞬时速度超过此值视为「快速下拉」，位移不足阈值也触发刷新

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const guestMode = useStore((s) => s.guestMode);
  const isDark = useStore((s) => s.isDark);
  const setHideBottomNav = useStore((s) => s.setHideBottomNav);
  const { t } = useI18n();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRealName, setShowRealName] = useState(false);
  const [showCheckInRules, setShowCheckInRules] = useState(false);
  const [pbIncome, setPbIncome] = useState<{ date: string; amount: number }[]>([]);
  const pkeId = localStorage.getItem("pke_user_id");
  const autoSignInShownRef = useRef(false);

  // 仿微信「下拉唤出小程序」：贴顶下拉时面板随手势展开，越过阈值松手即定住展开态
  // 展开高度为视口 80%，底部留 20% 露出首页 header，可点击/上拉收起回到首页
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullMax, setPullMax] = useState(() => (typeof window !== "undefined" ? Math.round(window.innerHeight * 0.8) : 600));
  const [pullDistance, setPullDistance] = useState(0);
  const [miniProgramOpen, setMiniProgramOpen] = useState(false);
  const [homeRefreshing, setHomeRefreshing] = useState(false);

  useEffect(() => {
    const onResize = () => setPullMax(Math.round(window.innerHeight * 0.8));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const dragRef = useRef<{ dragging: boolean; startY: number; base: number; moved: boolean; pointerId: number; lastY: number; lastT: number; velocity: number }>({
    dragging: false,
    startY: 0,
    base: 0,
    moved: false,
    pointerId: -1,
    lastY: 0,
    lastT: 0,
    velocity: 0,
  });
  // 拖拽松手后浏览器仍会在抬起位置补发一次 click；用它抑制“点击面板外关闭”误触发
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const scrollEl = containerRef.current?.closest("main");
    if (!scrollEl) return;
    const onScroll = () => {
      if (miniProgramOpen && scrollEl.scrollTop > 4) {
        setMiniProgramOpen(false);
        setPullDistance(0);
      }
    };
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [miniProgramOpen]);

  // 面板展开时隐藏底部导航；离开页面时兜底恢复，避免状态泄漏到其他页面
  useEffect(() => {
    setHideBottomNav(miniProgramOpen);
    return () => setHideBottomNav(false);
  }, [miniProgramOpen, setHideBottomNav]);

  const handlePullPointerDown = (e: React.PointerEvent) => {
    if (homeRefreshing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const scrollEl = containerRef.current?.closest("main");
    if (!scrollEl || scrollEl.scrollTop > 0) return;
    dragRef.current = { dragging: true, startY: e.clientY, base: pullDistance, moved: false, pointerId: e.pointerId, lastY: e.clientY, lastT: performance.now(), velocity: 0 };
  };
  const handlePullPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    const delta = e.clientY - d.startY;
    if (Math.abs(delta) > 8) d.moved = true;
    const next = Math.max(0, Math.min(pullMax, d.base + delta * PULL_RESISTANCE));
    if (Math.abs(next - pullDistance) > 0.5) {
      e.preventDefault();
      setPullDistance(next);
    }
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = now;
  };
  const handlePullPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    d.dragging = false;
    if (d.moved) suppressClickRef.current = true;
    const velocity = d.velocity;
    setPullDistance((cur) => {
      if (cur >= PANEL_THRESHOLD) {
        setMiniProgramOpen(true);
        return pullMax;
      }
      const fastFlick = cur >= REFRESH_MIN && velocity > FAST_FLICK_VELOCITY;
      if (cur >= REFRESH_THRESHOLD || fastFlick) triggerHomeRefresh();
      return 0;
    });
  };
  const closeMiniProgramPanel = () => {
    setMiniProgramOpen(false);
    setPullDistance(0);
  };

  const handleHomeRefresh = async () => {
    const start = Date.now();
    if (pkeId) {
      const profile = await getUserProfile(pkeId);
      if (profile) {
        setUser({ ...user, ...profile, name: profile.name || profile.realName || guestName, avatar: profile.avatar || user?.avatar } as any);
        if (profile.assets) {
          const a: Record<string, number> = {};
          for (const [k, v] of Object.entries(profile.assets)) a[k] = typeof v === "string" ? Number(v) : (v as number);
          setAssets(a as any);
        }
      }
    }
    const elapsed = Date.now() - start;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));
  };
  const triggerHomeRefresh = () => {
    if (homeRefreshing) return;
    setHomeRefreshing(true);
    Promise.resolve(handleHomeRefresh()).finally(() => setHomeRefreshing(false));
  };

  const guestName = t.home.guestName;

  const registerMut = useMutation({
    mutationFn: (vars: { name: string }) => registerUser(vars.name),
    onSuccess: (data) => {
      localStorage.setItem("pke_user_id", data.pkeId);
      const profile = data.profile as any;
      setUser({ ...profile, userId: data.userId, pkeId: data.pkeId, name: profile?.realName || guestName, avatar: BRAND.defaultAvatar(data.pkeId) } as any);
      if (data.assets) setAssets(data.assets as any);
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ["user", "profile", pkeId],
    queryFn: () => getUserProfile(pkeId || ""),
    enabled: !!pkeId && !user,
  });
  useEffect(() => { if (!guestMode && !pkeId && !user && !registerMut.isPending) registerMut.mutate({ name: "P客" + Math.floor(Math.random() * 10000) }); }, [pkeId, user, guestMode]);
  useEffect(() => {
    if (profileData) { setUser({ ...profileData, name: profileData.name || profileData.realName || guestName, avatar: profileData.avatar || BRAND.defaultAvatar(profileData.pkeId) } as any); if (profileData.assets) { const a: Record<string, number> = {}; for (const [k, v] of Object.entries(profileData.assets)) a[k] = typeof v === "string" ? Number(v) : (v as number); setAssets(a as any); } }
  }, [profileData]);
  useEffect(() => {
    // 近7日BV收益 mock 曲线（后端无真实统计接口前的占位数据）
    const deltas = [100, 120, 80, 130, 100, 170, 550];
    let cumulative = 0;
    const data: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      cumulative += deltas[6 - i];
      data.push({ date: `${date.getMonth() + 1}/${date.getDate()}`, amount: cumulative });
    }
    setPbIncome(data);
  }, []);

  const totalGain = pbIncome.length ? pbIncome[pbIncome.length - 1].amount : 0;
  const isChangGong = (user?.level ?? 1) === 1;
  const signInStreak = user?.signInStreak ?? 0;
  const hasSignedToday = !!user?.lastCheckInDate && user.lastCheckInDate === toDateStr(new Date());

  // 自动弹签到弹窗：需已登录+今日未签到+本次打开页面还没弹过+当前没有其他弹窗/面板挡着
  // 未实名用户也会弹出（展示的是"去实名"引导态），让这批用户也能感知到签到福利
  // 演示用途：弹过一次的标记只存在内存里（autoSignInShownRef），刷新页面会重新弹，不做跨刷新的持久化频控
  useEffect(() => {
    if (!user || hasSignedToday) return;
    if (showSignIn || showRealName || showCheckInRules || miniProgramOpen) return;
    if (autoSignInShownRef.current) return;
    const timer = setTimeout(() => {
      autoSignInShownRef.current = true;
      setShowSignIn(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [user, hasSignedToday, showSignIn, showRealName, showCheckInRules, miniProgramOpen]);
  const nextRewardDay = Math.min(signInStreak + 1, SIGN_IN_REWARD_CAP_DAYS);
  const nextReward = getSignInReward(nextRewardDay, isChangGong);
  const level = user?.level || 1;
  const lvConfig = getLevel(level);
  const savedAvatar = localStorage.getItem("pke_avatar");
  const isPlaceholderAvatar =
    !user?.avatar ||
    user.avatar.includes("api.dicebear.com") ||
    user.avatar.includes("avataaars");
  const displayAvatar =
    savedAvatar ||
    (!isPlaceholderAvatar ? user?.avatar : null) ||
    BRAND.defaultAvatar(user?.pkeId || "guest");
  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkTer = isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  const panelRatio = Math.min(1, pullDistance / PANEL_THRESHOLD);
  const refreshRatio = pullDistance > 4 ? Math.min(1, pullDistance / REFRESH_THRESHOLD) : 0;
  const panelMode = miniProgramOpen || pullDistance >= PANEL_THRESHOLD;
  const pullAreaHeight = homeRefreshing ? REFRESH_DISPLAY_HEIGHT : pullDistance;

  return (
    <div
      ref={containerRef}
      className="min-h-full flex flex-col transition-colors pt-3.5"
      onPointerDown={handlePullPointerDown}
      onPointerMove={handlePullPointerMove}
      onPointerUp={handlePullPointerUp}
      onPointerCancel={handlePullPointerUp}
      onClick={(e) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        if (miniProgramOpen && !(e.target as HTMLElement).closest("[data-pull-panel]")) closeMiniProgramPanel();
      }}
    >
      <SignInDialog
        open={showSignIn}
        reward={nextReward}
        onClose={() => setShowSignIn(false)}
        onGoRealName={() => { setShowSignIn(false); setShowRealName(true); }}
      />
      <RealNameDialog open={showRealName} onComplete={() => { setShowRealName(false); if (user) setUser({ ...user, isRealName: true } as any); toast({ title: "实名认证成功" }); setTimeout(() => setShowSignIn(true), 500); }} onClose={() => setShowRealName(false)} />
      <CheckInRulesDialog open={showCheckInRules} onClose={() => setShowCheckInRules(false)} />

      {/* 下拉双语义：小幅/快速下拉→内容刷新指示；继续下拉过阈值→贴顶展开至视口 80% 的小程序面板 */}
      <div
        className="mx-3.5 flex-shrink-0 overflow-hidden"
        style={{
          height: pullAreaHeight,
          transition: dragRef.current.dragging ? "none" : "height 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {panelMode ? (
          <div
            data-pull-panel
            className={`p-3.5 rounded-card transition-colors flex flex-col ${softCard}`}
            style={{ height: pullMax, opacity: pullDistance > 4 ? Math.min(1, pullDistance / 40) : 0 }}
          >
            <div className="flex items-center justify-between flex-shrink-0">
              <span
                className={
                  miniProgramOpen
                    ? `text-section-title ${ink}`
                    : `text-body ${inkSec}`
                }
              >
                {miniProgramOpen ? "小程序" : panelRatio >= 1 ? "松开进入小程序" : "下拉查看小程序"}
              </span>
              <button
                type="button"
                onClick={() => { closeMiniProgramPanel(); navigate("/mini-program"); }}
                className="text-caption text-game-primary-text active:opacity-70 transition-opacity"
              >
                更多&gt;
              </button>
            </div>
            <div className="flex flex-col mt-2.5 flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-3">
                {MINI_PROGRAMS.map((app) => (
                  <button
                    key={app.key}
                    type="button"
                    onClick={() => {
                      closeMiniProgramPanel();
                      toast({ title: `(Demo)打开「${app.name}」`, variant: "info" });
                    }}
                    className={`flex flex-col items-center py-2.5 rounded-button text-center transition-colors active:scale-[0.98] ${isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted"}`}
                  >
                    <div className={`w-11 h-11 rounded-tile flex items-center justify-center flex-shrink-0 ${isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"}`}>
                      <Image size={18} strokeWidth={1.75} className={inkTer} />
                    </div>
                    <p className={`text-grid-label mt-1.5 truncate w-full px-1 ${ink}`}>{app.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center gap-1.5">
            <Loader2Icon
              size={16}
              className={homeRefreshing ? "animate-spin" : ""}
              style={{
                color: GAME.primary,
                opacity: refreshRatio,
                transform: homeRefreshing ? undefined : `rotate(${refreshRatio * 360}deg)`,
              }}
            />
            <span className={`text-caption ${inkSec}`} style={{ opacity: refreshRatio }}>
              {homeRefreshing ? "正在刷新…" : pullDistance >= REFRESH_THRESHOLD ? "松开刷新" : "下拉刷新"}
            </span>
          </div>
        )}
      </div>

      {/* Top HUD：左「我的」/ 右「扫一扫」 */}
      <div className="mx-3.5 h-[52px] flex items-center justify-between flex-shrink-0">
        {user ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2.5 min-h-11 active:opacity-80 transition-opacity min-w-0"
              aria-label="我的"
            >
              <img
                src={displayAvatar}
                alt=""
                className="w-9 h-9 rounded-pill object-cover flex-shrink-0"
              />
              <span
                className="px-2 py-0.5 rounded-badge text-game-primary-text flex-shrink-0"
                style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
              >
                <span className="text-caption">称号：</span>
                <span className="text-hud-label">{lvConfig.cnName}</span>
              </span>
            </button>
            {user.isRealName ? (
              <BadgeCheck
                size={18}
                className="flex-shrink-0"
                style={{ color: GAME.primary }}
                fill={GAME.primary}
                stroke={GAME.onPrimary}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowRealName(true)}
                className="flex items-center justify-center min-h-11 min-w-11 -m-2.5 flex-shrink-0 active:opacity-70 transition-opacity"
                aria-label="去实名认证"
              >
                <BadgeCheck
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: isDark ? GAME.inkDisabledDark : GAME.inkDisabled }}
                  fill="transparent"
                  stroke={isDark ? GAME.inkDisabledDark : GAME.inkDisabled}
                />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2.5 min-h-11 active:opacity-80 transition-opacity"
          >
            <img
              src={BRAND.defaultAvatar("guest")}
              alt=""
              className="w-9 h-9 rounded-pill object-cover flex-shrink-0 opacity-70"
            />
            <span className={`text-grid-label ${ink}`}>{t.settings.loginOrRegister}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => toast({ title: "(Demo)扫一扫", variant: "info" })}
          className={`flex items-center gap-1 min-h-11 px-2 -mr-2 rounded-button transition-colors ${
            isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted"
          }`}
          aria-label="扫一扫"
        >
          <ScanLine size={20} className={ink} strokeWidth={2} />
        </button>
      </div>

      {/* 连续签到奖励 */}
      <section className="mx-3.5 mt-1 flex-shrink-0">
        <div className={`p-4 rounded-card transition-colors ${softCard}`}>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg width={44} height={44} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" fill={GAME.rewardGold} />
                <rect x="3" y="8" width="18" height="4" rx="1" fill={GAME.celebrateRed} />
                <rect x="11" y="8" width="2" height="13" fill={GAME.celebrateRed} />
                <path
                  d="M12 8C11 6.6 9.6 4.3 7.8 3.9C6.2 3.5 5 4.6 5 6.1C5 7.5 6.1 8 7.4 8Z"
                  fill={GAME.celebrateRed}
                />
                <path
                  d="M12 8C13 6.6 14.4 4.3 16.2 3.9C17.8 3.5 19 4.6 19 6.1C19 7.5 17.9 8 16.6 8Z"
                  fill={GAME.celebrateRed}
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <p className={`text-caption ${inkSec} whitespace-nowrap`}>
                连续签到第 <span className="font-bold tabular-nums">{nextRewardDay}</span> 天
              </p>
              <p className="flex items-center gap-1.5 whitespace-nowrap">
                <span className={`text-task-title ${ink}`}>
                  今日可领 <span className="font-bold text-game-primary tabular-nums">{formatReward(nextReward)}</span> P币
                </span>
                <button
                  type="button"
                  onClick={() => setShowCheckInRules(true)}
                  aria-label="查看签到规则"
                  className="inline-flex items-center justify-center size-6 -m-1"
                >
                  <Info size={16} className={inkDis} />
                </button>
              </p>
            </div>
            {hasSignedToday ? (
              <button
                disabled
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-caption font-bold flex-shrink-0 cursor-not-allowed"
                style={{
                  background: isDark ? GAME.primarySoftDark : GAME.primarySoft,
                  color: GAME.primary,
                }}
              >
                <Check size={14} />
                已签到
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!user) { navigate("/login"); return; }
                  if (user.isRealName) setShowSignIn(true); else setShowRealName(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-caption font-bold flex-shrink-0 text-white shadow-sm active:scale-95 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
                  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
                }}
              >
                <CalendarCheck size={14} />
                签到
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1 mt-4">
            {Array.from({ length: SIGN_IN_REWARD_CAP_DAYS }, (_, i) => {
              const day = i + 1;
              const isDone = day <= signInStreak;
              const isNext = day === nextRewardDay && !isDone;
              const reward = getSignInReward(day, isChangGong);
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-pill flex items-center justify-center text-caption font-bold"
                    style={{
                      background: isDone
                        ? GAME.primary
                        : isNext
                          ? isDark
                            ? GAME.primarySoftDark
                            : GAME.primarySoft
                          : isDark
                            ? GAME.bgMutedDark
                            : GAME.bgMuted,
                      color: isDone
                        ? "#FFFFFF"
                        : isNext
                          ? GAME.primary
                          : isDark
                            ? GAME.inkSecondaryDark
                            : GAME.inkSecondary,
                      boxShadow: isNext ? `0 0 0 2px ${GAME.primary}` : undefined,
                    }}
                  >
                    {isDone ? <Check size={16} /> : `+${formatReward(reward)}`}
                  </div>
                  <span className={`text-caption ${inkSec}`}>
                    第{day}天
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 我的资产入口 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <button
          onClick={() => navigate("/wealth")}
          className={`w-full flex items-center gap-2.5 px-4 py-5 rounded-card transition-colors active:brightness-95 ${softCard}`}
        >
          <Wallet size={18} className="flex-shrink-0" style={{ color: GAME.primary }} />
          <span className={`flex-1 text-left text-grid-label ${ink}`}>我的资产</span>
          <span className={`text-body ${inkSec}`}>查看所有资产明细</span>
          <ChevronRight size={16} style={{ color: GAME.primary }} />
        </button>
      </section>

      {/* 近7日BV收益 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`p-4 rounded-card transition-colors ${softCard}`}>
          {!user ? (
            <div className="h-[220px] flex flex-col items-center justify-center gap-2">
              <LineChart size={28} className={inkDis} />
              <span className={`text-caption ${inkSec}`}>登录后查看收益趋势</span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-1 text-body font-medium"
                style={{ color: GAME.primaryText }}
              >
                去登录
              </button>
            </div>
          ) : (
          <>
          <div className="flex items-center gap-1">
            <span className={`text-section-title ${ink}`}>近7日BV收益</span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            {/* 故意用更亮的 primary 填色橙作字色（牺牲 AA 对比度，对齐视觉稿冲感） */}
            <span className="text-hero-number tabular-nums text-game-primary">+{totalGain.toLocaleString()}</span>
            <span className={`text-body ${inkSec}`}>BV</span>
          </div>
          {pbIncome.length > 0 && (
            <div className="h-[140px] mt-2 -ml-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pbIncome} margin={{ top: 24, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pbGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GAME.chartLine} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={GAME.chartLine} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke={isDark ? GAME.dividerDark : GAME.divider}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: isDark ? GAME.inkSecondaryDark : GAME.inkSecondary }}
                  />
                  <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 1500]}
                    ticks={[0, 300, 600, 900, 1200, 1500]}
                    width={36}
                    tick={{ fontSize: 12, fill: isDark ? GAME.inkSecondaryDark : GAME.inkSecondary }}
                  />
                  <Tooltip
                    formatter={(v: number) => [v.toLocaleString(), "BV"]}
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 13,
                      border: "none",
                      background: isDark ? GAME.bgCardDark : GAME.bgCard,
                      color: isDark ? GAME.inkDark : GAME.ink,
                      boxShadow: isDark ? GAME.shadowWarmDark : GAME.shadowWarm,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke={GAME.chartLine}
                    strokeWidth={2}
                    fill="url(#pbGradient)"
                    isAnimationActive={false}
                    dot={(props: any) => {
                      const isLast = props.index === pbIncome.length - 1;
                      const dotFill = isDark ? GAME.bgCardDark : "#FFFFFF";
                      if (!isLast) {
                        return (
                          <circle
                            key={props.index}
                            cx={props.cx}
                            cy={props.cy}
                            r={3.5}
                            fill={dotFill}
                            stroke={GAME.chartLine}
                            strokeWidth={2}
                          />
                        );
                      }
                      return (
                        <g key={props.index}>
                          <rect x={props.cx - 22} y={props.cy - 30} width={44} height={20} rx={8} fill={GAME.primary} />
                          <text x={props.cx} y={props.cy - 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#FFFFFF">
                            {Number(props.payload.amount).toLocaleString()}
                          </text>
                          <circle cx={props.cx} cy={props.cy} r={3.5} fill={dotFill} stroke={GAME.chartLine} strokeWidth={2} />
                        </g>
                      );
                    }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {pbIncome.length === 0 && (
            <div className="h-[140px] mt-2 flex flex-col items-center justify-center gap-1.5">
              <LineChart size={28} className={inkDis} />
              <span className={`text-caption ${inkSec}`}>暂无收益数据</span>
            </div>
          )}
          </>
          )}
        </div>
      </section>

      {/* 功能入口 - 6个大图 + 副标题（直接铺在页面背景，无 Soft card 包裹） */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className="grid grid-cols-3">
          {HOME_FEATURES.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                if (f.key === "home-mini-program") { navigate(f.path); return; }
                toast({ title: `(Demo)跳转「${f.label}」H5`, variant: "info" });
              }}
              className="flex flex-col items-center py-3 active:scale-95 transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                <img src={f.image} alt={f.label} className="w-full h-full object-contain" />
              </div>
              <span className={`text-grid-label mt-2 ${ink}`}>{f.label}</span>
              <span className={`text-body mt-1 ${inkSec}`}>{f.subtitle}</span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
