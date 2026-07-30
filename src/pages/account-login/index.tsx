import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft, Globe, ChevronDown, Fingerprint } from "lucide-react";
import { type CountryCode } from "libphonenumber-js/min";
import { useStore } from "@/stores";
import { GAME, BRAND } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/mockBackend";
import { DEFAULT_COUNTRY, findCountry } from "@/lib/phoneCountries";
import HomeMark from "@/components/icons/HomeMark";
import CountryCodeSheet from "@/components/dialogs/CountryCodeSheet";
import ChangePasswordDialog from "@/components/dialogs/ChangePasswordDialog";

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

const RESEND_SECONDS = 60;
type AuthTab = "login" | "register";
type LoginMode = "code" | "password";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // 仅「添加账号」入口带着可回退的历史记录进来才展示返回按钮；
  // 其余场景（未登录强制跳转、开发者面板切换为未登录）落地即是登录页，没有可回退的上一页
  const canGoBack = (location.state as { from?: string } | null)?.from === "addAccount";
  const { t } = useI18n();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const upsertAccount = useStore((s) => s.upsertAccount);

  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [mode, setMode] = useState<LoginMode>("code");
  const [account, setAccount] = useState("");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pending, setPending] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const fieldSurface = isDark
    ? "bg-game-bg-card-dark border-game-border-light-dark text-game-ink-dark"
    : "bg-game-bg-card border-game-border-light text-game-ink";
  const rowPress = isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";

  const trimmedAccount = account.trim();
  // 邮箱登录不需要国际区号；含 @ 时视为邮箱，不含时视为手机号并拼上所选国家/地区区号
  const isEmailLike = trimmedAccount.includes("@");
  const countryOption = findCountry(country);
  const loginIdentifier = trimmedAccount && !isEmailLike ? `+${countryOption.dial}${trimmedAccount}` : trimmedAccount;
  // 注册固定走验证码方式，登录支持验证码/密码二选一
  const secondary = authTab === "register" || mode === "code" ? code.trim() : password.trim();
  const canSubmit = trimmedAccount.length > 0 && secondary.length > 0 && !pending;

  const startCooldown = () => {
    setCooldown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGetCode = () => {
    if (!trimmedAccount || cooldown > 0) return;
    startCooldown();
    toast({
      title: t.settings.demoCodeSent,
      description: `${loginIdentifier} · 123456`,
    });
  };

  const completeLogin = async (identifier: string, successTitle: string) => {
    setPending(true);
    const data = await registerUser(identifier);
    const avatar = BRAND.defaultAvatar(data.pkeId);
    const profile = { ...data.profile, avatar };
    setUser(profile);
    if (data.assets) setAssets(data.assets);
    upsertAccount(profile);
    localStorage.setItem("pke_user_id", data.pkeId);
    localStorage.setItem("pke_avatar", avatar);
    localStorage.setItem("pke_nickname", identifier);
    setPending(false);
    toast({ title: successTitle });
    // 未登录访问首页会被强制跳转到登录页（无可回退的历史记录），登录成功后统一落到首页
    navigate("/", { replace: true });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await completeLogin(loginIdentifier, authTab === "register" ? t.settings.accountCreated : t.settings.accountAdded);
  };

  const handleFingerprintLogin = async () => {
    if (pending) return;
    if (!trimmedAccount) {
      toast({ title: t.settings.fingerprintNeedAccount, variant: "info" });
      return;
    }
    setPending(true);
    toast({ title: t.settings.fingerprintScanning });
    await completeLogin(loginIdentifier, t.settings.accountAdded);
  };

  const handleForgotPassword = () => {
    if (!trimmedAccount) {
      toast({ title: t.settings.forgotPasswordNeedAccount });
      return;
    }
    setShowForgotPassword(true);
  };

  const switchAuthTab = (tab: AuthTab) => {
    if (tab === authTab) return;
    setAuthTab(tab);
    setMode("code");
    setCode("");
    setPassword("");
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
          {canGoBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
              aria-label={t.settings.back}
            >
              <ChevronLeft size={22} strokeWidth={2} className={ink} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div
          className="w-24 h-24 rounded-card shadow-warm flex items-center justify-center"
          style={{ background: isDark ? GAME.bgCardDark : GAME.bgCard }}
        >
          <HomeMark size={60} className="text-game-primary" />
        </div>
        <h1 className={`mt-4 text-section-title ${ink}`}>欢迎使用 P 客</h1>

        <div className="w-full mt-8">
          <label className={`mb-2 block text-body font-semibold ${ink}`}>
            {t.settings.phoneOrEmail}
          </label>
          <div className="flex gap-2">
            {!isEmailLike && (
              <button
                type="button"
                onClick={() => setShowCountryPicker(true)}
                className={`h-12 w-[104px] shrink-0 flex items-center gap-1.5 justify-center rounded-button border text-task-title transition-colors ${fieldSurface} ${rowPress}`}
              >
                {countryOption.Flag ? (
                  <countryOption.Flag className="w-5 h-3.5 rounded-[2px] shrink-0" />
                ) : (
                  <Globe size={14} className={`shrink-0 ${inkDis}`} />
                )}
                <span>+{countryOption.dial}</span>
                <ChevronDown size={14} className={`shrink-0 ${inkDis}`} />
              </button>
            )}
            <input
              type="text"
              value={account}
              placeholder={t.settings.phoneOrEmailPlaceholder}
              onChange={(e) => setAccount(e.target.value)}
              className={`flex-1 h-12 px-3 rounded-button border text-task-title outline-none transition-shadow focus:border-game-primary focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
            />
          </div>

          {authTab === "register" || mode === "code" ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                maxLength={6}
                placeholder={t.settings.verificationCodePlaceholder}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) handleSubmit();
                }}
                className={`flex-1 h-12 px-3 rounded-button border text-task-title outline-none transition-shadow focus:border-game-primary focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
              />
              <button
                type="button"
                onClick={handleGetCode}
                disabled={!trimmedAccount || cooldown > 0}
                className="h-12 px-3.5 rounded-button text-body font-medium flex-shrink-0 disabled:opacity-40"
                style={{ color: GAME.primaryText }}
              >
                {cooldown > 0 ? `${cooldown}s` : t.settings.getCode}
              </button>
            </div>
          ) : (
            <>
              <input
                type="password"
                value={password}
                placeholder={t.settings.passwordPlaceholder}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) handleSubmit();
                }}
                className={`mt-3 w-full h-12 px-3 rounded-button border text-task-title outline-none transition-shadow focus:border-game-primary focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
              />
            </>
          )}

          {authTab === "login" && (
            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode(mode === "code" ? "password" : "code")}
                className="py-2 -my-2 text-body font-medium"
                style={{ color: GAME.primaryText }}
              >
                {mode === "code" ? t.settings.usePasswordLogin : t.settings.useCodeLogin}
              </button>
              {mode === "password" && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="py-2 -my-2 text-body font-medium"
                  style={{ color: GAME.primaryText }}
                >
                  {t.settings.forgotPassword}
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full h-12 mt-5 rounded-button text-section-title border-0 disabled:opacity-40 transition-opacity"
            style={CTA_STYLE}
          >
            {authTab === "register"
              ? pending
                ? t.settings.registeringIn
                : t.settings.registerButton
              : pending
                ? t.settings.loggingIn
                : t.settings.authTabLogin}
          </button>

          <button
            type="button"
            onClick={() => switchAuthTab(authTab === "login" ? "register" : "login")}
            className={`w-full mt-2 py-2 text-body text-center ${inkSec}`}
          >
            {authTab === "login" ? t.settings.noAccountPrompt : t.settings.haveAccountPrompt}
            <span className="font-semibold" style={{ color: GAME.primaryText }}>
              {authTab === "login" ? t.settings.registerNow : t.settings.goToLogin}
            </span>
          </button>
        </div>

        {authTab === "login" && (
          <div className="w-full mt-6 flex flex-col items-center gap-3">
            <div className="w-full flex items-center gap-2">
              <div className={`h-px flex-1 ${isDark ? "bg-game-border-light-dark" : "bg-game-border-light"}`} />
              <span className={`text-caption ${inkDis}`}>{t.settings.orDivider}</span>
              <div className={`h-px flex-1 ${isDark ? "bg-game-border-light-dark" : "bg-game-border-light"}`} />
            </div>
            <button
              type="button"
              onClick={handleFingerprintLogin}
              disabled={pending}
              aria-label={t.settings.fingerprintLogin}
              className="w-14 h-14 rounded-button flex items-center justify-center disabled:opacity-40 transition-opacity"
              style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
            >
              <Fingerprint size={28} style={{ color: GAME.primary }} />
            </button>
            <span className={`text-caption ${inkSec}`}>{t.settings.fingerprintLogin}</span>
          </div>
        )}

        <p className={`mt-8 text-caption text-center ${inkDis}`}>
          {authTab === "register" ? t.settings.registerDemoNote : t.settings.loginDemoNote}
        </p>
      </div>

      <CountryCodeSheet
        open={showCountryPicker}
        value={country}
        onSelect={setCountry}
        onClose={() => setShowCountryPicker(false)}
      />

      <ChangePasswordDialog
        open={showForgotPassword}
        email={loginIdentifier}
        kind="login"
        onClose={() => setShowForgotPassword(false)}
        onComplete={() => setPassword("")}
      />
    </div>
  );
}
