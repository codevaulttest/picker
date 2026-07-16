import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Check, ChevronLeft, ChevronRight, Moon, Sun, Languages, FileText, Shield,
} from "lucide-react";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import { APP_LANGS, LANG_LABELS, type AppLang } from "@/lib/lang";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function rowPress(isDark: boolean) {
  return isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";
}

export default function SettingsGeneralPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setIsDark = useStore((s) => s.setIsDark);
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const [langOpen, setLangOpen] = useState(false);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  const items = [
    {
      key: "theme",
      label: t.settings.theme,
      desc: isDark ? t.settings.themeDark : t.settings.themeLight,
      icon: isDark ? Moon : Sun,
      color: isDark ? GAME.inkTertiaryDark : GAME.rewardGold,
      bg: isDark ? GAME.bgMutedDark : GAME.bgMuted,
      action: () => setIsDark(!isDark),
    },
    {
      key: "lang",
      label: t.settings.language,
      desc: LANG_LABELS[lang],
      icon: Languages,
      color: GAME.infoBlue,
      bg: isDark ? GAME.infoSoftDark : GAME.infoSoft,
      action: () => setLangOpen(true),
    },
  ];

  const legalItems = [
    {
      key: "terms",
      label: t.settings.terms,
      desc: t.settings.termsDesc,
      icon: FileText,
      color: GAME.inkSecondary,
      bg: isDark ? GAME.bgMutedDark : GAME.bgMuted,
      action: () => toast({ title: t.settings.termsDemo, variant: "info" as const }),
    },
    {
      key: "privacy",
      label: t.settings.privacy,
      desc: t.settings.privacyDesc,
      icon: Shield,
      color: GAME.infoBlue,
      bg: isDark ? GAME.infoSoftDark : GAME.infoSoft,
      action: () => toast({ title: t.settings.privacyDemo, variant: "info" as const }),
    },
  ];

  const pickLang = (next: AppLang) => {
    setLang(next);
    setLangOpen(false);
  };

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
            onClick={() => navigate(-1)}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label={t.settings.back}
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1
            className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}
          >
            {t.settings.title}
          </h1>
        </div>
      </header>

      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          {items.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === items.length - 1;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${rowPress(isDark)}`}
                style={
                  !isLast
                    ? { borderBottom: `1px solid ${isDark ? GAME.dividerDark : GAME.divider}` }
                    : undefined
                }
              >
                <div
                  className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-grid-label truncate ${ink}`}>{item.label}</p>
                  <p className={`text-body truncate mt-0.5 ${inkSec}`}>{item.desc}</p>
                </div>
                <ChevronRight size={16} className={inkDis} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-3.5 mt-2.5 mb-4 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          {legalItems.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === legalItems.length - 1;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${rowPress(isDark)}`}
                style={
                  !isLast
                    ? { borderBottom: `1px solid ${isDark ? GAME.dividerDark : GAME.divider}` }
                    : undefined
                }
              >
                <div
                  className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-grid-label truncate ${ink}`}>{item.label}</p>
                  <p className={`text-body truncate mt-0.5 ${inkSec}`}>{item.desc}</p>
                </div>
                <ChevronRight size={16} className={inkDis} />
              </button>
            );
          })}
        </div>
      </section>

      <Sheet open={langOpen} onOpenChange={setLangOpen}>
        <SheetContent
          side="bottom"
          className={`rounded-t-card gap-0 border-0 p-0 ${
            isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"
          }`}
        >
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className={`text-section-title ${ink}`}>
              {t.settings.pickLanguage}
            </SheetTitle>
          </SheetHeader>
          <div className="px-2 pb-6">
            {APP_LANGS.map((code) => {
              const selected = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => pickLang(code)}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-button text-left transition-colors ${rowPress(isDark)}`}
                >
                  <span className={`flex-1 text-grid-label ${ink}`}>
                    {LANG_LABELS[code]}
                  </span>
                  {selected ? (
                    <Check size={18} style={{ color: GAME.primary }} aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
