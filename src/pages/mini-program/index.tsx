import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useStore } from "@/stores";
import { GAME, MINI_PROGRAMS } from "@/config/app.config";

export default function MiniProgramPage() {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const mutedSurface = isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted";
  const mutedText = isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary";
  const rowPress = isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";

  return (
    <div className="min-h-full flex flex-col transition-colors">
      <header className="relative px-3.5 pt-3.5 pb-2">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1 className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}>
            小程序
          </h1>
        </div>
      </header>

      <section className="mx-3.5 mt-2.5 mb-4 flex-shrink-0 space-y-2.5">
        {MINI_PROGRAMS.map((app) => (
          <button
            key={app.key}
            type="button"
            className={`w-full flex items-center gap-3 p-3.5 rounded-card text-left transition-colors active:scale-[0.98] ${softCard} ${rowPress}`}
          >
            <div className={`w-14 h-14 rounded-tile flex items-center justify-center flex-shrink-0 ${mutedSurface}`}>
              <Image size={24} strokeWidth={1.75} className={mutedText} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-grid-label truncate ${ink}`}>{app.name}</p>
              <p className={`text-body mt-0.5 truncate ${inkSec}`}>{app.desc}</p>
            </div>
            {app.comingSoon && (
              <span className={`text-caption px-2 py-0.5 rounded-pill flex-shrink-0 ${mutedSurface} ${inkSec}`}>
                即将上线
              </span>
            )}
            <ChevronRight size={16} className={`flex-shrink-0 ${inkDis}`} />
          </button>
        ))}
      </section>
    </div>
  );
}
