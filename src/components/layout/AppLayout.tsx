/**
 * ═══════════════════════════════════════════════════════════
 * 底部导航布局 - 5个Tab 铺满菜单栏
 * 中间「任务」：60px 圆钮；同色凸起弧（collar）包住圆钮；
 * 圆钮上沿相对栏顶凸出直径的 20%（-12px）
 * ═══════════════════════════════════════════════════════════
 */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import Planet from "@/components/icons/Planet";
import HomeMark from "@/components/icons/HomeMark";
import ProfileMark from "@/components/icons/ProfileMark";
import DonorMark from "@/components/icons/DonorMark";
import ClipboardCheckFilled from "@/components/icons/ClipboardCheckFilled";
import { useToast } from "@/hooks/use-toast";
import DevPanel from "@/components/dev/DevPanel";

/** 导航高度（DESIGN.md） */
const NAV_H = 80;
/** 任务圆钮直径（DESIGN.md） */
const TASK_FAB_SIZE = 60;
/** 圆钮相对导航顶边的上偏移 = 直径 × 20% → 顶边落在圆钮自上 20% 处 */
const TASK_FAB_PROTRUDE = Math.round(TASK_FAB_SIZE * 0.2); // 12
/** 凸起弧相对圆钮的外圈余量（包住图标的奶油弧） */
const TASK_ARC_COLLAR = 8;
const TASK_ARC_SIZE = TASK_FAB_SIZE + TASK_ARC_COLLAR * 2;

/** navShadow（box-shadow 语法）→ drop-shadow 语法，用于合并后的轮廓阴影 */
const NAV_SHADOW_FILTER = `drop-shadow(${GAME.navShadow.replace(" 0 rgba", " rgba")})`;

const TABS_IMG = [
  { key: "home", label: "P客", icon: HomeMark, path: "/" },
  { key: "knowledge", label: "知识宇宙", icon: Planet, path: null as string | null, demoToast: "(Demo)跳转「知识宇宙」" },
  { key: "task", label: "任务", icon: ClipboardCheckFilled, path: null as string | null, demoToast: "(Demo)跳转「TDS」（任务系统 CAS）" },
  { key: "donor", label: "东家", icon: DonorMark, path: null as string | null, demoToast: "(Demo)跳转「东家打赏」" },
  { key: "profile", label: "我的", icon: ProfileMark, path: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const isDark = useStore((s) => s.isDark);

  // Tailwind `dark:`（Dialog 等）依赖 html.dark，与 zustand isDark 同步
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 路由同步底栏激活态（含首页顶栏 →「我的」等非 Tab 点击跳转）
  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/") {
      setActiveTab("home");
      return;
    }
    if (pathname.startsWith("/settings") || pathname.startsWith("/security") || pathname.startsWith("/support")) {
      setActiveTab("profile");
      return;
    }
    if (pathname.startsWith("/donor")) {
      setActiveTab("donor");
    }
  }, [location.pathname, setActiveTab]);

  const isTaskRoute = location.pathname.startsWith("/task");
  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/settings" || location.pathname.startsWith("/settings/");
  const isSecurity = location.pathname.startsWith("/security");
  const isDonor = location.pathname.startsWith("/donor");
  const useWarmGradient = isHome || isProfile || isSecurity || isDonor;

  // DESIGN.md: light card @ 95%；dark → bg-card-dark（暖炭，禁止 cool slate）
  const navBg = isDark ? "rgba(36, 31, 26, 0.95)" : "rgba(255, 255, 255, 0.95)";

  return (
    <div
      className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden ${
        isDark ? "bg-game-bg-page-dark" : useWarmGradient ? "" : "bg-game-bg-page"
      }`}
      style={
        isDark
          ? { background: GAME.pageGradientDark }
          : useWarmGradient
            ? { background: GAME.pageGradient }
            : undefined
      }
    >
      <main className="flex-1 overflow-y-auto scrollbar-hide" style={{ paddingBottom: isTaskRoute ? 0 : NAV_H }}>
        {children}
      </main>

      {/* 任务模块有自己的导航，这里隐藏主导航 */}
      {!isTaskRoute && (
        <nav
          className="absolute bottom-0 left-0 right-0 z-50 overflow-visible"
          style={{ height: NAV_H }}
        >
          {/* goo 滤镜：让凸起弧与栏体在交界处融合成一个圆润轮廓，而不是两个相交的硬边形状 */}
          <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
            <defs>
              <filter id="nav-goo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="nav-goo-blur" />
                <feColorMatrix
                  in="nav-goo-blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
                />
              </filter>
            </defs>
          </svg>

          {/* 凸起弧 + 栏体作为同一合并轮廓渲染：阴影只施加在合并后的外形上，交界处天然圆润 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ filter: isDark ? "url(#nav-goo)" : `url(#nav-goo) ${NAV_SHADOW_FILTER}` }}
          >
            {/* 顶边中段凸起弧：与栏同色的圆盘，包在任务钮外圈 */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-pill"
              style={{
                width: TASK_ARC_SIZE,
                height: TASK_ARC_SIZE,
                top: -(TASK_FAB_PROTRUDE + TASK_ARC_COLLAR),
                background: navBg,
                backdropFilter: "blur(12px)",
              }}
            />

            {/* 主栏体 */}
            <div
              className={`absolute inset-0 rounded-t-large ${
                isDark ? "bg-game-bg-card-dark/95" : "bg-game-bg-card/95"
              }`}
              style={{
                borderTop: isDark ? `1px solid ${GAME.borderLightDark}` : "none",
                backdropFilter: "blur(12px)",
              }}
            />
          </div>

          {/* 5个Tab：侧栏均分，中间列=任务圆钮宽，邻格到圆钮边≈37px */}
          <div
            className="relative z-10 grid h-full items-start px-1"
            style={{
              gridTemplateColumns: `1fr 1fr ${TASK_FAB_SIZE}px 1fr 1fr`,
              gap: "2px",
            }}
          >
            {TABS_IMG.map((tab, i) => {
              const isActive = activeTab === tab.key;
              const isCenter = i === 2;

              const Icon = tab.icon;

              if (isCenter) {
                // 中间任务 FAB：图标+文案均在圆内；top: -12 → 导航顶边穿过圆钮 20% 处
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if ("demoToast" in tab && tab.demoToast) {
                        toast({ title: tab.demoToast, variant: "info" });
                        return;
                      }
                      setActiveTab(tab.key);
                      if (tab.path) navigate(tab.path);
                    }}
                    className="relative flex h-full items-center justify-center active:scale-95 transition-all"
                    aria-label={tab.label}
                  >
                    <div
                      className="absolute left-1/2 rounded-pill flex flex-col items-center justify-center gap-0.5"
                      style={{
                        width: TASK_FAB_SIZE,
                        height: TASK_FAB_SIZE,
                        top: -TASK_FAB_PROTRUDE,
                        transform: "translateX(-50%)",
                        background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
                        boxShadow: "0 4px 14px rgba(22,113,248,0.35)",
                      }}
                    >
                      <Icon size={22} strokeWidth={2.25} className="text-white" />
                      <span className="text-tab-label leading-none text-white">
                        {tab.label}
                      </span>
                    </div>
                  </button>
                );
              }

              // 普通Tab：图标距导航顶 12px，文案在下
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if ("demoToast" in tab && tab.demoToast) {
                      toast({ title: tab.demoToast, variant: "info" });
                      return;
                    }
                    setActiveTab(tab.key);
                    if (tab.path) navigate(tab.path);
                  }}
                  className="flex flex-col items-center gap-1 pt-3 active:scale-95 transition-all"
                  style={
                    i === 1
                      ? { marginRight: 3 }
                      : i === 3
                        ? { marginLeft: 3 }
                        : undefined
                  }
                >
                  <div className="h-6 w-6 flex items-center justify-center">
                    {tab.key === "home" ? (
                      <HomeMark
                        size={24}
                        strokeWidth={2}
                        filled={isActive}
                        className={
                          isActive
                            ? "text-game-primary"
                            : isDark
                              ? "text-game-ink-tertiary-dark"
                              : "text-game-ink-nav-inactive"
                        }
                      />
                    ) : tab.key === "profile" ? (
                      <ProfileMark
                        size={24}
                        filled={isActive}
                        className={
                          isActive
                            ? "text-game-primary"
                            : isDark
                              ? "text-game-ink-tertiary-dark"
                              : "text-game-ink-nav-inactive"
                        }
                      />
                    ) : (
                      <Icon
                        size={24}
                        // Lucide 描边图标不宜 fill（填色后抗锯齿发糊）
                        // 激活用加粗描边，未激活正常描边
                        strokeWidth={isActive ? 2.5 : 2}
                        fill="none"
                        className={
                          isActive
                            ? "text-game-primary"
                            : isDark
                              ? "text-game-ink-tertiary-dark"
                              : "text-game-ink-nav-inactive"
                        }
                        aria-hidden
                      />
                    )}
                  </div>
                  <span
                    className={`text-tab-label whitespace-nowrap leading-none ${
                      isActive
                        ? "text-game-primary-text"
                        : isDark
                          ? "text-game-ink-tertiary-dark"
                          : "text-game-ink-nav-inactive"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <DevPanel />
    </div>
  );
}
