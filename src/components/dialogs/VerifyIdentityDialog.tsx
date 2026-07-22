import { useEffect, useRef, useState } from "react";
import { KeyRound, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { GAME } from "@/config/app.config";
import { maskPhone } from "@/lib/phoneCountries";

interface Props {
  open: boolean;
  title?: string;
  email?: string | null;
  phone?: string | null;
  onClose: () => void;
  onVerified: () => void;
}

type Method = "password" | "email" | "phone";

// 演示用固定登录密码/验证码：真实后端接入后由服务端下发校验
const MOCK_PASSWORD = "123456";
const MOCK_CODE = "123456";
const RESEND_SECONDS = 60;

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(user.length - visible.length, 1))}@${domain}`;
}

export default function VerifyIdentityDialog({
  open,
  title,
  email,
  phone,
  onClose,
  onVerified,
}: Props) {
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const { toast } = useToast();
  const zh = lang !== "en";

  const defaultMethod: Method = email ? "email" : phone ? "phone" : "password";
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;
    setMethod(defaultMethod);
    setPassword("");
    setPasswordError("");
    setCode("");
    setCodeError("");
    setSending(false);
    setCodeSent(false);
    setVerifying(false);
    setCooldown(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const contact = method === "email" ? email : method === "phone" ? phone : "";
  const maskedContact = method === "email" ? maskEmail(contact || "") : maskPhone(contact || "");

  const handleSendCode = () => {
    if (!contact) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setCodeSent(true);
      setCode("");
      setCodeError("");
      startCooldown();
      toast({
        title: zh ? "验证码已发送" : "Code sent",
        description: `${zh ? "请查收" : "Sent to"} ${maskedContact}`,
      });
    }, 600);
  };

  const handleResend = () => {
    if (cooldown > 0 || sending) return;
    handleSendCode();
  };

  const handleSwitchMethod = (next: Method) => {
    setMethod(next);
    setPassword("");
    setPasswordError("");
    setCode("");
    setCodeError("");
    setCodeSent(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(0);
  };

  const handleVerifyPassword = () => {
    if (!password) {
      setPasswordError(zh ? "请输入登录密码" : "Enter your login password");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (password !== MOCK_PASSWORD) {
        setPasswordError(zh ? "密码错误，请重新输入" : "Incorrect password, try again");
        setPassword("");
        return;
      }
      onVerified();
      handleClose();
    }, 400);
  };

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      setCodeError(zh ? "请输入6位验证码" : "Enter the 6-digit code");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (code !== MOCK_CODE) {
        setCodeError(zh ? "验证码错误，请重新输入" : "Incorrect code, try again");
        setCode("");
        return;
      }
      onVerified();
      handleClose();
    }, 400);
  };

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";
  const fieldSurface = isDark
    ? "bg-game-bg-card-dark border-game-border-light-dark text-game-ink-dark"
    : "bg-game-bg-card border-game-border-light text-game-ink";
  const fieldError = "border-game-error focus:border-game-error focus:ring-game-error/20";

  const methodTabs: { key: Method; label: string; available: boolean }[] = [
    { key: "email", label: zh ? "邮箱验证码" : "Email code", available: !!email },
    { key: "phone", label: zh ? "短信验证码" : "SMS code", available: !!phone },
    { key: "password", label: zh ? "登录密码" : "Login password", available: true },
  ].filter((m) => m.available);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined} showCloseButton>
        <DialogHeader>
          <DialogTitle>{title || (zh ? "验证身份" : "Verify your identity")}</DialogTitle>
          <DialogDescription>
            {zh ? "为保障账号安全，请先完成身份验证" : "Please verify your identity to continue"}
          </DialogDescription>
        </DialogHeader>

        {methodTabs.length > 1 && (
          <div className={`flex gap-1.5 p-1 rounded-button ${isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"}`}>
            {methodTabs.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => handleSwitchMethod(m.key)}
                className="flex-1 h-9 rounded-button text-caption font-bold transition-colors"
                style={
                  method === m.key
                    ? { background: isDark ? GAME.bgCardDark : GAME.bgCard, color: GAME.primary }
                    : { color: isDark ? GAME.inkSecondaryDark : GAME.inkSecondary }
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {method === "password" ? (
          <div className="w-full">
            <label className={`mb-2 block text-body font-semibold ${ink}`}>
              {zh ? "登录密码" : "Login password"}
            </label>
            <div className="relative">
              <KeyRound
                size={16}
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${inkDis}`}
              />
              <input
                type="password"
                autoFocus
                value={password}
                placeholder={zh ? "输入登录密码" : "Enter your login password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !verifying) handleVerifyPassword();
                }}
                aria-invalid={!!passwordError}
                className={`w-full h-12 pl-9 pr-3 rounded-button border text-task-title outline-none transition-shadow focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${
                  passwordError ? fieldError : `focus:border-game-primary ${fieldSurface}`
                }`}
              />
            </div>
            {passwordError ? (
              <p className="mt-1.5 text-caption" style={{ color: GAME.error }}>
                {passwordError}
              </p>
            ) : (
              <p className={`mt-1.5 text-caption ${inkDis}`}>
                {zh ? "演示密码：123456" : "Demo password: 123456"}
              </p>
            )}
          </div>
        ) : !codeSent ? (
          <div className="w-full flex flex-col items-center gap-3 py-2">
            {method === "email" ? (
              <Mail size={28} className={inkSec} />
            ) : (
              <Smartphone size={28} className={inkSec} />
            )}
            <p className={`text-body text-center ${inkSec}`}>
              {zh ? "将发送验证码至" : "We'll send a code to"} {maskedContact}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(v) => {
                setCode(v.replace(/[^0-9]/g, ""));
                if (codeError) setCodeError("");
              }}
              containerClassName={codeError ? "has-invalid" : undefined}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={codeError ? "border-game-error" : undefined}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {codeError ? (
              <p className="text-caption" style={{ color: GAME.error }}>
                {codeError}
              </p>
            ) : (
              <p className={`text-caption ${inkDis}`}>
                {zh ? "演示验证码：123456" : "Demo code: 123456"}
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || sending}
              className="mt-1 text-body font-medium disabled:opacity-40"
              style={{ color: cooldown > 0 ? undefined : GAME.primaryText }}
            >
              {cooldown > 0
                ? `${zh ? `${cooldown}秒后可重新发送` : `Resend in ${cooldown}s`}`
                : zh
                  ? "重新发送验证码"
                  : "Resend code"}
            </button>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className={`h-12 rounded-button text-section-title ${outlineBtn}`}
            onClick={handleClose}
          >
            {zh ? "取消" : "Cancel"}
          </Button>
          {method === "password" ? (
            <Button
              type="button"
              className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
              style={CTA_STYLE}
              disabled={verifying}
              onClick={handleVerifyPassword}
            >
              {verifying ? (zh ? "验证中…" : "Verifying…") : zh ? "确认" : "Confirm"}
            </Button>
          ) : !codeSent ? (
            <Button
              type="button"
              className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
              style={CTA_STYLE}
              disabled={sending}
              onClick={handleSendCode}
            >
              {sending ? (zh ? "发送中…" : "Sending…") : zh ? "发送验证码" : "Send code"}
            </Button>
          ) : (
            <Button
              type="button"
              className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
              style={CTA_STYLE}
              disabled={code.length !== 6 || verifying}
              onClick={handleVerifyCode}
            >
              {verifying ? (zh ? "验证中…" : "Verifying…") : zh ? "确认" : "Confirm"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
