import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Globe, ChevronDown } from "lucide-react";
import { type CountryCode } from "libphonenumber-js/min";
import { useStore } from "@/stores";
import { GAME, BRAND } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/mockBackend";
import { DEFAULT_COUNTRY, findCountry } from "@/lib/phoneCountries";
import HomeMark from "@/components/icons/HomeMark";
import CountryCodeSheet from "@/components/dialogs/CountryCodeSheet";

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

const RESEND_SECONDS = 60;
type LoginMode = "code" | "password";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const setGuestMode = useStore((s) => s.setGuestMode);
  const upsertAccount = useStore((s) => s.upsertAccount);

  const [mode, setMode] = useState<LoginMode>("code");
  const [account, setAccount] = useState("");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pending, setPending] = useState(false);
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
  const tabActive = isDark ? "bg-game-bg-card-dark text-game-ink-dark shadow-warm-dark" : "bg-game-bg-card text-game-ink shadow-warm";
  const tabInactive = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const rowPress = isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";

  const trimmedAccount = account.trim();
  // 邮箱登录不需要国际区号；含 @ 时视为邮箱，不含时视为手机号并拼上所选国家/地区区号
  const isEmailLike = trimmedAccount.includes("@");
  const countryOption = findCountry(country);
  const loginIdentifier = trimmedAccount && !isEmailLike ? `+${countryOption.dial}${trimmedAccount}` : trimmedAccount;
  const secondary = mode === "code" ? code.trim() : password.trim();
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

  const handleLogin = async () => {
    if (!canSubmit) return;
    setPending(true);
    const data = await registerUser(loginIdentifier);
    const avatar = BRAND.defaultAvatar(data.pkeId);
    const profile = { ...data.profile, avatar };
    setUser(profile);
    if (data.assets) setAssets(data.assets);
    setGuestMode(false);
    upsertAccount(profile);
    localStorage.setItem("pke_user_id", data.pkeId);
    localStorage.setItem("pke_avatar", avatar);
    localStorage.setItem("pke_nickname", loginIdentifier);
    setPending(false);
    toast({ title: t.settings.accountAdded });
    navigate(-1);
  };

  const handleGuest = () => {
    setGuestMode(true);
    navigate(-1);
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

          <div className={`mt-4 inline-flex items-center gap-1 rounded-button p-1 ${isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"}`}>
            <button
              type="button"
              onClick={() => setMode("code")}
              className={`px-3 py-1.5 rounded-button text-body transition-colors ${mode === "code" ? tabActive : tabInactive}`}
            >
              {t.settings.loginByCode}
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`px-3 py-1.5 rounded-button text-body transition-colors ${mode === "password" ? tabActive : tabInactive}`}
            >
              {t.settings.loginByPassword}
            </button>
          </div>

          {mode === "code" ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                maxLength={6}
                placeholder={t.settings.verificationCodePlaceholder}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) handleLogin();
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
            <input
              type="password"
              value={password}
              placeholder={t.settings.passwordPlaceholder}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) handleLogin();
              }}
              className={`mt-3 w-full h-12 px-3 rounded-button border text-task-title outline-none transition-shadow focus:border-game-primary focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
            />
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={!canSubmit}
            className="w-full h-12 mt-5 rounded-button text-section-title border-0 disabled:opacity-40 transition-opacity"
            style={CTA_STYLE}
          >
            {pending ? t.settings.loggingIn : t.settings.loginOrRegister}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className={`w-full h-11 mt-3 rounded-button text-body ${inkSec}`}
          >
            {t.settings.continueAsGuest}
          </button>
        </div>

        <p className={`mt-8 text-caption text-center ${inkDis}`}>
          {t.settings.loginDemoNote}
        </p>
      </div>

      <CountryCodeSheet
        open={showCountryPicker}
        value={country}
        onSelect={setCountry}
        onClose={() => setShowCountryPicker(false)}
      />
    </div>
  );
}
