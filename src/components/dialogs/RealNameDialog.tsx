import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import idCardFrontIcon from "@/assets/svg/svg/custom/id-card-front.svg?url";
import idCardBackIcon from "@/assets/svg/svg/custom/id-card-back.svg?url";
import faceScanIcon from "@/assets/svg/svg/custom/face-scan.svg?url";
import checkSuccessIcon from "@/assets/svg/svg/custom/check-success.svg?url";

interface Props {
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

type Step = "idcard" | "face" | "code" | "done";

/** 实名认证全屏流程 - 支持调相册/调摄像头/可关闭 */
export default function RealNameDialog({ open, onComplete, onClose }: Props) {
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setHideBottomNav = useStore((s) => s.setHideBottomNav);
  const [step, setStep] = useState<Step>("idcard");
  const [authCode, setAuthCode] = useState("");
  const [faceAction, setFaceAction] = useState(0);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const actions = ["请眨眼", "请摇头", "请张嘴"];

  const reset = useCallback(() => {
    setStep("idcard");
    setAuthCode("");
    setFaceAction(0);
    setFrontImg(null);
    setBackImg(null);
    // 关闭摄像头
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === "front") setFrontImg(ev.target?.result as string);
      else setBackImg(ev.target?.result as string);
      toast({ title: "上传成功" });
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
    } catch {
      toast({ title: "无法访问摄像头", description: "请检查摄像头权限设置", variant: "destructive" });
    }
  };

  const handleNext = () => {
    if (step === "idcard") {
      if (!frontImg) {
        toast({ title: "请上传身份证正面" });
        return;
      }
      setStep("face");
      startCamera();
    } else if (step === "face") {
      if (faceAction < actions.length - 1) {
        setFaceAction(faceAction + 1);
      } else {
        // 关闭摄像头
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        }
        setStreamActive(false);
        setStep("code");
      }
    } else if (step === "code" && authCode.trim()) {
      if (authCode.length === 12) {
        setStep("done");
        setTimeout(() => {
          onComplete();
          reset();
        }, 1500);
      } else {
        toast({ title: "认证码格式错误", description: "请输入12位字母+数字认证码", variant: "destructive" });
      }
    }
  };

  const progress = (["idcard", "face", "code", "done"] as Step[]).indexOf(step) + 1;

  useEffect(() => {
    if (!open) return;
    setHideBottomNav(true);
    return () => setHideBottomNav(false);
  }, [open, setHideBottomNav]);

  if (!open) return null;

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const bgPage = isDark ? "bg-game-bg-page-dark" : "bg-game-bg-page";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors ${bgPage}`}>
      <header className="relative px-3.5 pt-3.5 pb-2 flex-shrink-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={handleClose}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1 className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}>
            {step === "idcard" && "上传身份信息"}
            {step === "face" && "人脸核验"}
            {step === "code" && "填写认证码"}
            {step === "done" && "认证成功"}
          </h1>
        </div>

        {/* 进度条 */}
        {step !== "done" && (
          <div className="relative z-10 flex gap-1 mt-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${progress < i ? (isDark ? "bg-game-border-light-dark" : "bg-game-border-light") : ""}`}
                style={progress >= i ? { background: `linear-gradient(90deg, ${GAME.primary}, ${GAME.primaryLight})` } : undefined}
              />
            ))}
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {/* 步骤1：身份证 - 可调相册 */}
          {step === "idcard" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>请上传身份证正反面</p>
              <div className="flex gap-3">
                <button onClick={() => frontInputRef.current?.click()}
                  className={`flex-1 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                    isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                  }`}>
                  {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                    <img src={idCardFrontIcon} alt="" width={24} height={24} />
                    <span className={`text-[10px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>身份证正面</span>
                  </>}
                  <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                </button>
                <button onClick={() => backInputRef.current?.click()}
                  className={`flex-1 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                    isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                  }`}>
                  {backImg ? <img src={backImg} className="w-full h-full object-cover" alt="back" /> : <>
                    <img src={idCardBackIcon} alt="" width={24} height={24} />
                    <span className={`text-[10px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>身份证反面</span>
                  </>}
                  <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                </button>
              </div>
            </>
          )}

          {/* 步骤2：人脸 - 调摄像头 */}
          {step === "face" && (
            <div className="text-center space-y-4">
              <div className="relative w-40 h-40 rounded-full mx-auto overflow-hidden flex items-center justify-center"
                style={{ background: streamActive ? "#000" : `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}>
                {streamActive ? (
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                ) : (
                  <img src={faceScanIcon} alt="" width={48} height={48} />
                )}
                {/* 扫描线动画 */}
                {streamActive && <div className="absolute inset-x-0 h-0.5 bg-game-success animate-scan" style={{ animation: "scan 2s linear infinite" }} />}
              </div>
              {!streamActive && (
                <Button className="rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                  onClick={startCamera}>开启摄像头</Button>
              )}
              <p className={`text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{actions[faceAction]}</p>
              <div className="flex justify-center gap-1.5">
                {actions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i > faceAction ? (isDark ? "bg-game-border-light-dark" : "bg-game-border-light") : ""}`}
                    style={i <= faceAction ? { background: GAME.primary } : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 步骤3：认证码 */}
          {step === "code" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>请输入12位认证码完成实名</p>
              <input type="text" placeholder="XXXXXXXXXXXX" value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                maxLength={12}
                className={`w-full h-12 px-4 rounded-xl border text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-game-primary-light ${
                  isDark ? "bg-game-bg-muted-dark border-game-border-light-dark text-game-ink-dark" : "bg-white border-game-border-light text-game-ink"
                }`} />
              <p className={`text-[10px] text-center ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>12位字母+数字组合</p>
            </>
          )}

          {/* 完成 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-game-success-soft-dark" : "bg-game-success-soft"}`}>
                <img src={checkSuccessIcon} alt="" width={40} height={40} />
              </div>
              <p className="text-lg font-semibold text-game-success">实名认证成功</p>
              <p className={`text-sm mt-1 ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>您现在可以正常签到了</p>
            </div>
          )}

          {step !== "done" && (
            <Button className="w-full h-12 rounded-xl text-white font-medium"
              style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
              onClick={handleNext}>
              {step === "code" ? "完成认证" : "下一步"}
            </Button>
          )}
      </div>
    </div>
  );
}
