import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, LogOut, KeyRound, MoreHorizontal,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/useI18n";
import {
  GAME,
  SECURITY_MENU,
  type SecurityStatusTone,
} from "@/config/app.config";
import EmailBindDialog from "@/components/dialogs/EmailBindDialog";
import PhoneBindDialog from "@/components/dialogs/PhoneBindDialog";
import RealNameDialog, { type RealNameInfo } from "@/components/dialogs/RealNameDialog";
import RealNameInfoDialog from "@/components/dialogs/RealNameInfoDialog";
import { createDemoRealNameInfo } from "@/lib/realName";
import VerifyIdentityDialog from "@/components/dialogs/VerifyIdentityDialog";
import FaceLoginConsentDialog from "@/components/dialogs/FaceLoginConsentDialog";
import ChangePasswordDialog from "@/components/dialogs/ChangePasswordDialog";
import { updateUserProfile } from "@/lib/mockBackend";
import { maskPhone } from "@/lib/phoneCountries";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(user.length - visible.length, 1))}@${domain}`;
}

const VAULT_PAY_KEY = "pke_vault_auth_pay";
const VAULT_ACCOUNT_KEY = "pke_vault_account";
const FACE_LOGIN_KEY = "pke_face_login";
const FACE_PAY_KEY = "pke_face_pay";

const FACE_PAY_POLICY = [
  "《面容支付服务协议》用于说明 P客如何使用您的面部特征数据完成支付身份核验，包括数据采集范围、加密存储方式、保存期限以及您可以随时关闭该功能并删除相关数据的权利。",
  "面容特征数据仅用于本机支付身份核验，不会用于其他用途，也不会被上传至与支付无关的第三方服务。",
];

/** 生成 8 位 CodeVAULT 账号（首位非 0），仅在首次开启授权时创建一次并持久化 */
function generateVaultAccount(): string {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

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
      return isDark ? GAME.inkSecondaryDark : GAME.inkSecondary;
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
  const { t } = useI18n();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const isDark = useStore((s) => s.isDark);

  const [vaultPay, setVaultPay] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(VAULT_PAY_KEY) === "1"
  );
  const [vaultAccount, setVaultAccount] = useState(
    () => (typeof localStorage !== "undefined" && localStorage.getItem(VAULT_ACCOUNT_KEY)) || ""
  );
  const [showEmailBind, setShowEmailBind] = useState(false);
  const [showPhoneBind, setShowPhoneBind] = useState(false);
  const [showRealName, setShowRealName] = useState(false);
  const [showRealNameInfo, setShowRealNameInfo] = useState(false);
  const [realNameInfo, setRealNameInfo] = useState<RealNameInfo | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [faceLogin, setFaceLogin] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(FACE_LOGIN_KEY) === "1"
  );
  const [showFaceLoginConsent, setShowFaceLoginConsent] = useState(false);
  const [showVerifyIdentity, setShowVerifyIdentity] = useState(false);
  const [facePay, setFacePay] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(FACE_PAY_KEY) === "1"
  );
  const [showFacePayConsent, setShowFacePayConsent] = useState(false);
  const [showFacePayVerify, setShowFacePayVerify] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangePayPassword, setShowChangePayPassword] = useState(false);
  const [offConfirmTarget, setOffConfirmTarget] = useState<"face-login" | "face-pay" | null>(null);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  const handleLogout = () => {
    localStorage.removeItem("pke_user_id");
    localStorage.removeItem("pke_avatar");
    localStorage.removeItem("pke_nickname");
    localStorage.removeItem(VAULT_PAY_KEY);
    localStorage.removeItem(VAULT_ACCOUNT_KEY);
    localStorage.removeItem(FACE_LOGIN_KEY);
    setUser(null);
    setShowLogoutConfirm(false);
    toast({ title: t.settings.loggedOut });
    navigate("/settings", { replace: true });
  };

  const handleFaceLoginToggle = (on: boolean) => {
    if (on) {
      if (!user?.email) {
        toast({ title: "请先绑定邮箱后再开启面容登录", variant: "info" });
        setShowEmailBind(true);
        return;
      }
      setShowFaceLoginConsent(true);
      return;
    }
    setOffConfirmTarget("face-login");
  };

  const handleFaceLoginVerified = () => {
    setFaceLogin(true);
    localStorage.setItem(FACE_LOGIN_KEY, "1");
    toast({ title: "已开启面容登录" });
  };

  const handleFacePayToggle = (on: boolean) => {
    if (on) {
      if (!user?.email) {
        toast({ title: "请先绑定邮箱后再开启面容支付", variant: "info" });
        setShowEmailBind(true);
        return;
      }
      setShowFacePayConsent(true);
      return;
    }
    setOffConfirmTarget("face-pay");
  };

  const handleConfirmDisable = () => {
    if (offConfirmTarget === "face-login") {
      setFaceLogin(false);
      localStorage.setItem(FACE_LOGIN_KEY, "0");
      toast({ title: "已关闭面容登录" });
    } else if (offConfirmTarget === "face-pay") {
      setFacePay(false);
      localStorage.setItem(FACE_PAY_KEY, "0");
      toast({ title: "已关闭面容支付" });
    }
    setOffConfirmTarget(null);
  };

  const handleFacePayVerified = () => {
    setFacePay(true);
    localStorage.setItem(FACE_PAY_KEY, "1");
    toast({ title: "已开启面容支付" });
  };

  const handleChangePasswordClick = () => {
    if (!user?.email) {
      toast({ title: "请先绑定邮箱后再修改密码", variant: "info" });
      setShowEmailBind(true);
      return;
    }
    setShowChangePassword(true);
  };

  const handleChangePayPasswordClick = () => {
    if (!user?.email) {
      toast({ title: "请先绑定邮箱后再修改支付密码", variant: "info" });
      setShowEmailBind(true);
      return;
    }
    setShowChangePayPassword(true);
  };

  const handleVaultPay = (on: boolean) => {
    setVaultPay(on);
    localStorage.setItem(VAULT_PAY_KEY, on ? "1" : "0");
    let account = vaultAccount;
    if (on && !account) {
      account = generateVaultAccount();
      setVaultAccount(account);
      localStorage.setItem(VAULT_ACCOUNT_KEY, account);
    }
    toast({
      title: on ? "已开启 CodeVAULT 授权支付" : "已关闭 CodeVAULT 授权支付",
      description: on ? `已绑定 CodeVAULT 账号 ${account}` : undefined,
    });
  };

  // 已认证但尚未在本次流程中采集过认证信息（如历史数据）时，用演示数据兜底展示
  const displayedRealNameInfo =
    realNameInfo ?? (user?.isRealName ? createDemoRealNameInfo(user.pkeId) : null);

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

      {(
        [
          { title: "账号绑定", keys: ["phone", "email", "face", "realname"] },
          { title: "登录安全", keys: ["face-login", "password"] },
          { title: "支付安全", keys: ["face-pay", "pay-password"] },
        ] as const
      ).map((group, groupIndex) => (
        <section key={group.title} className={`mx-3.5 ${groupIndex === 0 ? "mt-2.5" : "mt-4"} flex-shrink-0`}>
          <p className={`mb-1.5 px-1 text-caption font-semibold ${inkSec}`}>{group.title}</p>
          <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
            {SECURITY_MENU.filter((item) => (group.keys as readonly string[]).includes(item.key)).map(
              (item) => {
                const Icon = item.icon;
                const iconBg = isDark ? softForDark(item.bg) : item.bg;
                const isRealname = item.key === "realname";
                const isEmail = item.key === "email";
                const isPhone = item.key === "phone";
                const isPassword = item.key === "password";
                const isPayPassword = item.key === "pay-password";
                const isFaceLogin = item.key === "face-login";
                const isFacePay = item.key === "face-pay";

                if (isFaceLogin || isFacePay) {
                  return (
                    <div
                      key={item.key}
                      className="w-full flex items-center gap-3 px-4 py-3"
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
                      <Switch
                        checked={isFaceLogin ? faceLogin : facePay}
                        onCheckedChange={isFaceLogin ? handleFaceLoginToggle : handleFacePayToggle}
                        aria-label={item.label}
                      />
                    </div>
                  );
                }

                const status = isRealname
                  ? user?.isRealName
                    ? "已认证"
                    : "去认证"
                  : isEmail
                    ? user?.email
                      ? maskEmail(user.email)
                      : "未绑定"
                    : isPhone
                      ? user?.phone
                        ? maskPhone(user.phone)
                        : "未绑定"
                      : item.status;
                const tone: SecurityStatusTone | undefined = isRealname
                  ? user?.isRealName
                    ? "success"
                    : "action"
                  : isEmail
                    ? "muted"
                    : isPhone
                      ? "muted"
                      : item.statusTone;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={
                      isRealname
                        ? () => (user?.isRealName ? setShowRealNameInfo(true) : setShowRealName(true))
                        : isEmail
                          ? () => setShowEmailBind(true)
                          : isPhone
                            ? () => setShowPhoneBind(true)
                            : isPassword
                              ? handleChangePasswordClick
                              : isPayPassword
                                ? handleChangePayPasswordClick
                                : undefined
                    }
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
              }
            )}

            {group.title === "支付安全" && (
              <div className="w-full flex items-center gap-3 px-4 py-3">
                <div
                  className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isDark ? GAME.primarySoftDark : GAME.primarySoft,
                  }}
                >
                  <KeyRound size={20} style={{ color: GAME.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-grid-label truncate ${ink}`}>CodeVAULT 授权支付</p>
                  <p className={`text-body mt-0.5 ${inkSec}`}>
                    由P客与 CodeVAULT 合作提供，开通后，小额交易将直接从您绑定的 CodeVAULT 账号内扣减
                  </p>
                  {vaultPay && vaultAccount && (
                    <p className="text-body mt-0.5" style={{ color: GAME.primaryText }}>
                      已绑定账号：{vaultAccount}
                    </p>
                  )}
                </div>
                <Switch
                  checked={vaultPay}
                  onCheckedChange={handleVaultPay}
                  aria-label="CodeVAULT 授权支付"
                />
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="mx-3.5 mt-4 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
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
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 min-h-14 rounded-card transition-colors ${softCard} ${rowPress(isDark)}`}
        >
          <LogOut size={18} style={{ color: GAME.error }} />
          <span className="text-grid-label" style={{ color: GAME.error }}>
            {t.settings.logout}
          </span>
        </button>
      </section>

      <EmailBindDialog
        open={showEmailBind}
        email={user?.email}
        onClose={() => setShowEmailBind(false)}
        onComplete={(email) => {
          if (user) {
            setUser({ ...user, email } as any);
            updateUserProfile(user.pkeId, { email });
          }
        }}
      />

      <PhoneBindDialog
        open={showPhoneBind}
        phone={user?.phone}
        onClose={() => setShowPhoneBind(false)}
        onComplete={(phone) => {
          if (user) {
            setUser({ ...user, phone } as any);
            updateUserProfile(user.pkeId, { phone });
          }
        }}
      />

      <FaceLoginConsentDialog
        open={showFaceLoginConsent}
        onClose={() => setShowFaceLoginConsent(false)}
        onAgree={() => {
          setShowFaceLoginConsent(false);
          setShowVerifyIdentity(true);
        }}
      />

      <VerifyIdentityDialog
        open={showVerifyIdentity}
        title="验证身份"
        email={user?.email}
        phone={user?.phone}
        methods={["email"]}
        onClose={() => setShowVerifyIdentity(false)}
        onVerified={handleFaceLoginVerified}
      />

      <FaceLoginConsentDialog
        open={showFacePayConsent}
        title="开启面容支付"
        description="开启后可使用面容快速验证并完成支付，无需重复输入支付密码"
        policyTitle="面容支付服务协议"
        policyParagraphs={FACE_PAY_POLICY}
        onClose={() => setShowFacePayConsent(false)}
        onAgree={() => {
          setShowFacePayConsent(false);
          setShowFacePayVerify(true);
        }}
      />

      <VerifyIdentityDialog
        open={showFacePayVerify}
        title="验证身份"
        email={user?.email}
        phone={user?.phone}
        methods={["email"]}
        onClose={() => setShowFacePayVerify(false)}
        onVerified={handleFacePayVerified}
      />

      <ChangePasswordDialog
        open={showChangePassword}
        email={user?.email}
        onClose={() => setShowChangePassword(false)}
        onComplete={() => {}}
      />

      <ChangePasswordDialog
        open={showChangePayPassword}
        email={user?.email}
        kind="payment"
        onClose={() => setShowChangePayPassword(false)}
        onComplete={() => {}}
      />

      <RealNameDialog
        open={showRealName}
        onClose={() => setShowRealName(false)}
        onComplete={(info) => {
          setShowRealName(false);
          setRealNameInfo(info);
          if (user) setUser({ ...user, isRealName: true } as any);
          toast({ title: "实名认证成功" });
        }}
      />

      <RealNameInfoDialog
        open={showRealNameInfo}
        region={displayedRealNameInfo?.region}
        documentType={displayedRealNameInfo?.documentType}
        maskedName={displayedRealNameInfo?.maskedName}
        expireAt={displayedRealNameInfo?.expireAt}
        onClose={() => setShowRealNameInfo(false)}
      />

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent
          className={`rounded-card border-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={ink}>{t.settings.logout}</AlertDialogTitle>
            <AlertDialogDescription className={inkSec}>
              {t.settings.logoutDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-button border-0 sm:flex-initial">
              {t.settings.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-button border-0 sm:flex-initial"
              style={{ background: GAME.error, color: GAME.onPrimary }}
              onClick={handleLogout}
            >
              {t.settings.logout}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!offConfirmTarget} onOpenChange={(v) => !v && setOffConfirmTarget(null)}>
        <AlertDialogContent
          className={`rounded-card border-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={ink}>
              {offConfirmTarget === "face-login" ? "关闭面容登录" : "关闭面容支付"}
            </AlertDialogTitle>
            <AlertDialogDescription className={inkSec}>
              {offConfirmTarget === "face-login"
                ? "关闭后将无法使用面容快速登录，需重新开启并完成身份验证"
                : "关闭后将无法使用面容快速完成支付，需重新开启并完成身份验证"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-button border-0 sm:flex-initial">
              {t.settings.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-button border-0 sm:flex-initial"
              style={{ background: GAME.error, color: GAME.onPrimary }}
              onClick={handleConfirmDisable}
            >
              关闭
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
