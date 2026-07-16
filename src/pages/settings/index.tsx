import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight, Shield, IdCard, Headset, ArrowLeftRight,
  Settings as SettingsIcon,
} from "lucide-react";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import PageHeader from "@/components/layout/PageHeader";
import SwitchAccountSheet from "@/components/dialogs/SwitchAccountSheet";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  const isDark = useStore((s) => s.isDark);
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const guestName = t.home.guestName;
  const pkeId = localStorage.getItem("pke_user_id");

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  const menuItems = [
    {
      key: "security",
      label: t.settings.security,
      desc: t.settings.securityDesc,
      icon: Shield,
      color: GAME.infoBlue,
      bg: isDark ? GAME.infoSoftDark : GAME.infoSoft,
      action: () => navigate("/security"),
    },
    {
      key: "support",
      label: t.settings.support,
      desc: t.settings.supportDesc,
      icon: Headset,
      color: GAME.primary,
      bg: isDark ? GAME.primarySoftDark : GAME.primarySoft,
      action: () => navigate("/support"),
    },
    {
      key: "settings",
      label: t.settings.generalEntry,
      desc: t.settings.generalDesc,
      icon: SettingsIcon,
      color: GAME.inkSecondary,
      bg: isDark ? GAME.bgMutedDark : GAME.bgMuted,
      action: () => navigate("/settings/general"),
    },
  ];

  return (
    <div className="min-h-full flex flex-col transition-colors">
      <PageHeader
        avatar={user?.avatar}
        name={!user?.name || user.name === "游客" || user.name === "Guest" ? guestName : user.name}
        pkeId={user?.pkeId || pkeId || undefined}
        isRealName={user?.isRealName}
        level={user?.level || 1}
        loggedIn={!!user}
        onAvatarClick={() => navigate("/login")}
        onAvatarChange={(url) => setUser({ ...user, avatar: url } as any)}
        onNameChange={(name) => setUser({ ...user, name } as any)}
      />

      {user && !user.isRealName && (
        <section className="mx-3.5 mt-1 flex-shrink-0">
          <button
            onClick={() => navigate("/security")}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-card transition-colors active:brightness-95"
            style={{ background: isDark ? GAME.rewardGoldSoftDark : GAME.rewardGoldSoft }}
          >
            <IdCard size={18} className="flex-shrink-0" style={{ color: GAME.rewardGold }} />
            <span className={`flex-1 text-left text-grid-label ${ink}`}>
              {t.settings.verifyBanner}
            </span>
            <ChevronRight size={16} style={{ color: GAME.rewardGold }} />
          </button>
        </section>
      )}

      {/* Menu list — single card, hairline dividers */}
      <section className="mx-3.5 mt-2.5 mb-4 pb-2 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === menuItems.length - 1;
            return (
              <button
                key={item.key}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                  isDark
                    ? "active:bg-game-bg-muted-dark"
                    : "active:bg-game-bg-muted/80"
                }`}
                style={
                  !isLast
                    ? {
                        borderBottom: `1px solid ${
                          isDark ? GAME.dividerDark : GAME.divider
                        }`,
                      }
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
                  <p className={`text-grid-label truncate ${ink}`}>
                    {item.label}
                  </p>
                  <p className={`text-body truncate mt-0.5 ${inkSec}`}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight size={16} className={inkDis} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-3.5 mb-4 pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowSwitchAccount(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 min-h-14 rounded-card transition-colors ${softCard} ${
            isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80"
          }`}
        >
          <ArrowLeftRight size={18} className={inkSec} />
          <span className={`text-grid-label ${inkSec}`}>
            {t.settings.switchAccount}
          </span>
        </button>
      </section>

      <SwitchAccountSheet open={showSwitchAccount} onOpenChange={setShowSwitchAccount} />
    </div>
  );
}
