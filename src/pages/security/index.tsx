import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, LogOut, KeyRound, MoreHorizontal,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import {
  GAME,
  SECURITY_MENU,
  type SecurityStatusTone,
} from "@/config/app.config";
import EmailBindDialog from "@/components/dialogs/EmailBindDialog";

const VAULT_PAY_KEY = "pke_vault_auth_pay";

function softForDark(bg: string): string {
  if (bg === GAME.primarySoft) return GAME.primarySoftDark;
  if (bg === GAME.infoSoft) return GAME.infoSoftDark;
  if (bg === GAME.successSoft) return GAME.successSoftDark;
  if (bg === GAME.rewardGoldSoft) return GAME.rewardGoldSoftDark;
  return GAME.bgMutedDark;
}

function statusColor(tone: SecurityStatusTone | undefined, isDark: boolean): string {
  switch (tone) {
    case "success":
      return GAME.success;
    case "action":
      return GAME.primaryText;
    case "muted":
    default:
      return isDark ? GAME.inkTertiaryDark : GAME.inkTertiary;
  }
}

function hairline(isDark: boolean, show: boolean): CSSProperties | undefined {
  if (!show) return undefined;
  return { borderBottom: `1px solid ${isDark ? GAME.dividerDark : GAME.divider}` };
}

function rowPress(isDark: boolean) {
  return isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";
}

export default function SecurityPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const isDark = useStore((s) => s.isDark);

  const [vaultPay, setVaultPay] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(VAULT_PAY_KEY) === "1"
  );
  const [showEmailBind, setShowEmailBind] = useState(false);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  const clearSession = () => {
    localStorage.removeItem("pke_user_id");
    localStorage.removeItem("pke_avatar");
    localStorage.removeItem("pke_nickname");
    localStorage.removeItem(VAULT_PAY_KEY);
    window.location.reload();
  };

  const handleVaultPay = (on: boolean) => {
    setVaultPay(on);
    localStorage.setItem(VAULT_PAY_KEY, on ? "1" : "0");
    toast({
      title: on ? "已开启码库授权支付" : "已关闭码库授权支付",
    });
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
            onClick={() => navigate("/settings")}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1
            className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}
          >
            安全中心
          </h1>
        </div>
      </header>

      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          {SECURITY_MENU.map((item) => {
            const Icon = item.icon;
            const iconBg = isDark ? softForDark(item.bg) : item.bg;
            const isRealname = item.key === "realname";
            const isEmail = item.key === "email";
            const status = isRealname
              ? user?.isRealName
                ? "已认证"
                : "去认证"
              : isEmail
                ? user?.email
                  ? "已绑定"
                  : "未绑定"
                : item.status;
            const tone: SecurityStatusTone | undefined = isRealname
              ? user?.isRealName
                ? "success"
                : "action"
              : isEmail
                ? user?.email
                  ? "success"
                  : "muted"
                : item.statusTone;

            return (
              <button
                key={item.key}
                type="button"
                onClick={isEmail ? () => setShowEmailBind(true) : undefined}
                className={`w-full flex items-center gap-3 px-4 text-left transition-colors min-h-14 ${rowPress(isDark)}`}
                style={hairline(isDark, true)}
              >
                <div
                  className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                  style={{ background: iconBg }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <span className={`flex-1 text-grid-label truncate ${ink}`}>
                  {item.label}
                </span>
                {status && (
                  <span
                    className="text-body flex-shrink-0"
                    style={{ color: statusColor(tone, isDark) }}
                  >
                    {status}
                  </span>
                )}
                <ChevronRight size={16} className={inkDis} />
              </button>
            );
          })}

          <div
            className="w-full flex items-center gap-3 px-4 min-h-14"
            style={hairline(isDark, true)}
          >
            <div
              className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
              style={{
                background: isDark ? GAME.primarySoftDark : GAME.primarySoft,
              }}
            >
              <KeyRound size={20} style={{ color: GAME.primary }} />
            </div>
            <span className={`flex-1 text-grid-label truncate ${ink}`}>
              码库授权支付
            </span>
            <Switch
              checked={vaultPay}
              onCheckedChange={handleVaultPay}
              aria-label="码库授权支付"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/security/more")}
            className={`w-full flex items-center gap-3 px-4 text-left transition-colors min-h-14 ${rowPress(isDark)}`}
          >
            <div
              className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
              style={{
                background: isDark ? GAME.bgMutedDark : GAME.bgMuted,
              }}
            >
              <MoreHorizontal
                size={20}
                style={{ color: isDark ? GAME.inkTertiaryDark : GAME.inkSecondary }}
              />
            </div>
            <span className={`flex-1 text-grid-label truncate ${ink}`}>更多</span>
            <ChevronRight size={16} className={inkDis} />
          </button>
        </div>
      </section>

      <section className="mx-3.5 mt-2.5 mb-4 pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={clearSession}
          className={`w-full flex items-center justify-center gap-2 px-4 min-h-14 rounded-card transition-colors ${softCard} ${rowPress(isDark)}`}
        >
          <LogOut size={18} style={{ color: GAME.error }} />
          <span className="text-grid-label" style={{ color: GAME.error }}>
            切换账号 / 退出登录
          </span>
        </button>
      </section>

      <EmailBindDialog
        open={showEmailBind}
        email={user?.email}
        onClose={() => setShowEmailBind(false)}
        onComplete={(email) => {
          if (user) setUser({ ...user, email } as any);
        }}
      />
    </div>
  );
}
