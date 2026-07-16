import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Info, ArrowUp, Wallet, ChevronRight, Check, LineChart, CalendarCheck, ScanLine } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, registerUser } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { GAME, HOME_FEATURES, BRAND, getLevel } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import SignInDialog from "@/components/dialogs/SignInDialog";
import RealNameDialog from "@/components/dialogs/RealNameDialog";

// 连续签到奖励梯度：第N天 = N*10 BV
const CHECK_IN_REWARDS = [10, 20, 30, 40, 50, 60, 70];

/** HOME_FEATURES 亮色 soft → 暗色 soft-dark（DESIGN.md） */
function featureSoftDark(color: string): string {
  if (color === GAME.infoBlue) return GAME.infoSoftDark;
  if (color === GAME.primary) return GAME.primarySoftDark;
  if (color === GAME.rewardGold) return GAME.rewardGoldSoftDark;
  if (color === GAME.success) return GAME.successSoftDark;
  return GAME.bgMutedDark;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const guestMode = useStore((s) => s.guestMode);
  const isDark = useStore((s) => s.isDark);
  const { t } = useI18n();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRealName, setShowRealName] = useState(false);
  const [pbIncome, setPbIncome] = useState<{ date: string; amount: number }[]>([]);
  const pkeId = localStorage.getItem("pke_user_id");

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
  const consecutiveDays = user?.consecutiveClockInDays ?? 0;
  const nextRewardDay = Math.min(consecutiveDays + 1, 7);
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

  return (
    <div className="min-h-full flex flex-col transition-colors pt-3.5">
      <SignInDialog open={showSignIn} onClose={() => setShowSignIn(false)} />
      <RealNameDialog open={showRealName} onComplete={() => { setShowRealName(false); if (user) setUser({ ...user, isRealName: true } as any); toast({ title: "实名认证成功" }); setTimeout(() => setShowSignIn(true), 500); }} onClose={() => setShowRealName(false)} />

      {/* Top HUD：左「我的」/ 右「扫一扫」 */}
      <div className="mx-3.5 h-[52px] flex items-center justify-between flex-shrink-0">
        {user ? (
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2.5 min-h-11 active:opacity-80 transition-opacity"
            aria-label="我的"
          >
            <img
              src={displayAvatar}
              alt=""
              className="w-9 h-9 rounded-pill object-cover flex-shrink-0"
            />
            <span
              className="text-hud-label tabular-nums px-2 py-0.5 rounded-badge text-game-primary-text"
              style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
            >
              LV.{level} {lvConfig.cnName}
            </span>
          </button>
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
          <ScanLine size={20} className="text-game-primary" strokeWidth={2} />
        </button>
      </div>

      {/* 连续签到奖励 */}
      <section className="mx-3.5 mt-1 flex-shrink-0">
        <div className={`p-4 rounded-card transition-colors ${softCard}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src="/icons/checkin-gift.png" alt="" className="w-8 h-8 object-contain" />
            </div>
            <p className={`flex-1 text-body ${inkSec}`}>
              连续签到 <span className="font-bold text-game-primary tabular-nums">{nextRewardDay}</span> 天可得{" "}
              <span className="font-bold text-game-primary tabular-nums">
                {CHECK_IN_REWARDS[nextRewardDay - 1]}
              </span>{" "}
              BV
            </p>
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
              去签到
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-4">
            {CHECK_IN_REWARDS.map((reward, i) => {
              const day = i + 1;
              const isDone = day <= consecutiveDays;
              const isNext = day === nextRewardDay;
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
                            ? GAME.inkDisabledDark
                            : GAME.inkDisabled,
                      boxShadow: isNext ? `0 0 0 2px ${GAME.primary}` : undefined,
                    }}
                  >
                    {isDone ? <Check size={16} /> : `+${reward}`}
                  </div>
                  <span className={`text-caption ${inkTer}`}>第{day}天</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 我的资产 — 紧凑入口，面积不超过实名认证横幅 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <button
          onClick={() => navigate("/wealth")}
          className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-card transition-colors active:brightness-95 ${softCard}`}
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
          <div className="flex items-center gap-1">
            <span className={`text-section-title ${ink}`}>近7日BV收益</span>
            <Info size={13} className={inkDis} />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            {/* 故意用更亮的 primary 填色橙作字色（牺牲 AA 对比度，对齐视觉稿冲感） */}
            <span className="text-hero-number tabular-nums text-game-primary">+{totalGain.toLocaleString()}</span>
            <span className={`text-body ${inkSec}`}>BV</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-caption ${inkTer}`}>较前7日</span>
            <ArrowUp size={12} className="text-game-primary" />
            <span className="text-caption font-bold tabular-nums text-game-primary">18.6%</span>
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
                    tick={{ fontSize: 11, fill: isDark ? GAME.inkTertiaryDark : GAME.inkTertiary }}
                  />
                  <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 1500]}
                    ticks={[0, 300, 600, 900, 1200, 1500]}
                    width={36}
                    tick={{ fontSize: 11, fill: isDark ? GAME.inkTertiaryDark : GAME.inkTertiary }}
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
              <span className={`text-caption ${inkTer}`}>暂无收益数据</span>
            </div>
          )}
        </div>
      </section>

      {/* 功能入口 - 6个大图 + 副标题（直接铺在页面背景，无 Soft card 包裹） */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className="grid grid-cols-3">
          {HOME_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => navigate(f.path)}
                className="flex flex-col items-center py-3 active:scale-95 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-tile flex items-center justify-center"
                  style={{ backgroundColor: isDark ? featureSoftDark(f.color) : f.bg }}
                >
                  <Icon size={26} strokeWidth={2} color={f.color} />
                </div>
                <span className={`text-grid-label mt-2 ${ink}`}>{f.label}</span>
                <span className={`text-body mt-1 ${inkSec}`}>{f.subtitle}</span>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
