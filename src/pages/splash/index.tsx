import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import HomeMark from "@/components/icons/HomeMark";

/** 品牌动效播完后停顿的时长（ms），到点自动进入首页；点击任意处可跳过等待 */
const AUTO_ENTER_DELAY = 1800;

export default function SplashPage({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);

  const finish = () => {
    onDone();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const timer = setTimeout(finish, AUTO_ENTER_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";

  return (
    <div
      className="relative flex h-screen max-w-md mx-auto flex-col overflow-hidden"
      style={{ background: isDark ? GAME.pageGradientDark : GAME.pageGradient }}
      onClick={finish}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
        aria-hidden
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <div
          className="w-24 h-24 rounded-card shadow-warm flex items-center justify-center animate-splash-pop"
          style={{ background: isDark ? GAME.bgCardDark : GAME.bgCard }}
        >
          <HomeMark size={60} className="text-game-primary" />
        </div>

        <h1
          className={`mt-5 text-identity-name ${ink} animate-splash-fade-up`}
          style={{ animationDelay: "80ms" }}
        >
          欢迎使用 P 客
        </h1>
      </div>
    </div>
  );
}
