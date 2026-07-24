import { useEffect, useRef, useState } from "react";
import { KeyRound } from "lucide-react";
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
  /** 修改的密码类型；影响弹窗文案。默认登录密码 */
  kind?: "login" | "payment";
  onClose: () => void;
  onComplete: () => void;
}

type Step = "verify" | "reset";

// 演示用固定验证码：真实后端接入后由服务端下发校验
const MOCK_CODE = "123456";
const RESEND_SECONDS = 60;
const MIN_PASSWORD_LENGTH = 6;

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

export default function ChangePasswordDialog({ open, email, kind = "login", onClose, onComplete }: Props) {
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const { toast } = useToast();
  const zh = lang !== "en";
  const passwordLabel = kind === "payment" ? (zh ? "支付密码" : "payment password") : (zh ? "登录密码" : "login password");

  const [step, setStep] = useState<Step>("verify");
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const maskedEmail = maskEmail(email || "");

  useEffect(() => {
    if (!open) return;
    setStep("verify");
    setSending(false);
    setCode("");
    setCodeError("");
    setVerifying(false);
    setCooldown(0);
    setNewPassword("");
    setConfirmPassword("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setSubmitting(false);
    startCooldown();
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
      setStep("reset");
    }, 400);
  };

  const handleSubmitPassword = () => {
    let hasError = false;
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setNewPasswordError(
        zh ? `密码至少 ${MIN_PASSWORD_LENGTH} 位` : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
      hasError = true;
    }
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError(zh ? "两次输入的密码不一致" : "Passwords do not match");
      hasError = true;
    }
    if (hasError) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: zh ? `${passwordLabel}修改成功` : "Password changed" });
      onComplete();
      handleClose();
    }, 500);
  };

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
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
        {step === "verify" ? (
          <>
            <DialogHeader>
              <DialogTitle>{zh ? "验证身份" : "Verify your identity"}</DialogTitle>
              <DialogDescription>
                {zh ? "验证码已发送至" : "Code sent to"} {maskedEmail}
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
                onClick={handleClose}
              >
                {zh ? "取消" : "Cancel"}
              </Button>
              <Button
                type="button"
                className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
                style={CTA_STYLE}
                disabled={code.length !== 6 || verifying}
                onClick={handleVerifyCode}
              >
                {verifying ? (zh ? "验证中…" : "Verifying…") : zh ? "确认" : "Confirm"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{zh ? "设置新密码" : "Set new password"}</DialogTitle>
              <DialogDescription>
                {zh ? `请设置一个新的${passwordLabel}` : `Choose a new ${passwordLabel}`}
              </DialogDescription>
            </DialogHeader>

            <div className="w-full">
              <label className={`mb-2 block text-body font-semibold ${ink}`}>
                {zh ? "新密码" : "New password"}
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${inkDis}`}
                />
                <input
                  type="password"
                  autoFocus
                  value={newPassword}
                  placeholder={zh ? `至少 ${MIN_PASSWORD_LENGTH} 位` : `At least ${MIN_PASSWORD_LENGTH} characters`}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError("");
                  }}
                  aria-invalid={!!newPasswordError}
                  className={`w-full h-12 pl-9 pr-3 rounded-button border text-task-title outline-none transition-shadow focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${
                    newPasswordError ? fieldError : `focus:border-game-primary ${fieldSurface}`
                  }`}
                />
              </div>
              {newPasswordError && (
                <p className="mt-1.5 text-caption" style={{ color: GAME.error }}>
                  {newPasswordError}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className={`mb-2 block text-body font-semibold ${ink}`}>
                {zh ? "确认新密码" : "Confirm new password"}
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${inkDis}`}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder={zh ? "再次输入新密码" : "Re-enter new password"}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submitting) handleSubmitPassword();
                  }}
                  aria-invalid={!!confirmPasswordError}
                  className={`w-full h-12 pl-9 pr-3 rounded-button border text-task-title outline-none transition-shadow focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${
                    confirmPasswordError ? fieldError : `focus:border-game-primary ${fieldSurface}`
                  }`}
                />
              </div>
              {confirmPasswordError && (
                <p className="mt-1.5 text-caption" style={{ color: GAME.error }}>
                  {confirmPasswordError}
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
                disabled={submitting}
                onClick={handleSubmitPassword}
              >
                {submitting ? (zh ? "提交中…" : "Submitting…") : zh ? "确认修改" : "Confirm"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
