import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
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

interface Props {
  open: boolean;
  email?: string | null;
  onClose: () => void;
  onComplete: (email: string) => void;
}

type Step = "email" | "code";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 演示用固定验证码：真实后端接入后由服务端下发校验
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

export default function EmailBindDialog({ open, email, onClose, onComplete }: Props) {
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [draftEmail, setDraftEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const zh = lang !== "en";

  useEffect(() => {
    if (!open) return;
    setStep("email");
    setDraftEmail(email || "");
    setEmailTouched(false);
    setCode("");
    setCodeError("");
    setSending(false);
    setVerifying(false);
    setCooldown(0);
  }, [open, email]);

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

  const trimmedEmail = draftEmail.trim();
  const emailValid = EMAIL_RE.test(trimmedEmail);
  const showEmailError = emailTouched && trimmedEmail.length > 0 && !emailValid;

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const handleSendCode = () => {
    setEmailTouched(true);
    if (!emailValid) return;
    setSending(true);
    // 占位：后端暂无发信接口，本地模拟发送延迟
    setTimeout(() => {
      setSending(false);
      setStep("code");
      setCode("");
      setCodeError("");
      startCooldown();
      toast({
        title: zh ? "验证码已发送" : "Code sent",
        description: `${zh ? "请查收" : "Sent to"} ${maskEmail(trimmedEmail)}`,
      });
    }, 600);
  };

  const handleResend = () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setCode("");
      setCodeError("");
      startCooldown();
      toast({ title: zh ? "验证码已重新发送" : "Code resent" });
    }, 600);
  };

  const handleVerify = () => {
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
      toast({ title: zh ? "邮箱绑定成功" : "Email linked" });
      onComplete(trimmedEmail);
      handleClose();
    }, 500);
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined} showCloseButton>
        {step === "email" ? (
          <>
            <DialogHeader>
              <DialogTitle>{zh ? "绑定邮箱" : "Bind email"}</DialogTitle>
              <DialogDescription>
                {zh ? "用于找回密码和安全通知" : "Used for password recovery and security alerts"}
              </DialogDescription>
            </DialogHeader>

            <div className="w-full">
              <label className={`mb-2 block text-body font-semibold ${ink}`}>
                {zh ? "邮箱地址" : "Email address"}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${inkDis}`}
                />
                <input
                  type="email"
                  inputMode="email"
                  autoFocus
                  value={draftEmail}
                  placeholder={zh ? "输入邮箱地址" : "Enter your email"}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && emailValid && !sending) handleSendCode();
                  }}
                  aria-invalid={showEmailError}
                  className={`w-full h-12 pl-9 pr-3 rounded-button border text-task-title outline-none transition-shadow focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${
                    showEmailError ? fieldError : `focus:border-game-primary ${fieldSurface}`
                  }`}
                />
              </div>
              {showEmailError && (
                <p className="mt-1.5 text-caption" style={{ color: GAME.error }}>
                  {zh ? "邮箱格式不正确" : "Invalid email format"}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className={`h-12 rounded-button text-section-title ${outlineBtn}`}
                onClick={handleClose}
              >
                {zh ? "取消" : "Cancel"}
              </Button>
              <Button
                type="button"
                className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
                style={CTA_STYLE}
                disabled={!emailValid || sending}
                onClick={handleSendCode}
              >
                {sending ? (zh ? "发送中…" : "Sending…") : zh ? "发送验证码" : "Send code"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{zh ? "填写验证码" : "Enter verification code"}</DialogTitle>
              <DialogDescription>
                {zh ? "验证码已发送至" : "Code sent to"} {maskEmail(trimmedEmail)}
              </DialogDescription>
            </DialogHeader>

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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className={`h-12 rounded-button text-section-title ${outlineBtn}`}
                onClick={() => setStep("email")}
              >
                {zh ? "更换邮箱" : "Change email"}
              </Button>
              <Button
                type="button"
                className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
                style={CTA_STYLE}
                disabled={code.length !== 6 || verifying}
                onClick={handleVerify}
              >
                {verifying ? (zh ? "验证中…" : "Verifying…") : zh ? "完成绑定" : "Verify"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
