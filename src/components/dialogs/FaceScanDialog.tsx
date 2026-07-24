import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import faceScanIcon from "@/assets/svg/svg/custom/face-scan.svg?url";
import checkSuccessIcon from "@/assets/svg/svg/custom/check-success.svg?url";

interface Props {
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const ACTIONS = ["请眨眼", "请摇头", "请张嘴"];

/** 人脸验证弹窗 - 领取签到奖励前的活体校验，UI/流程复用 RealNameDialog 的人脸步骤 */
export default function FaceScanDialog({ open, onComplete, onClose }: Props) {
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setHideBottomNav = useStore((s) => s.setHideBottomNav);
  const [step, setStep] = useState<"scan" | "done">("scan");
  const [faceAction, setFaceAction] = useState(0);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  const reset = useCallback(() => {
    setStep("scan");
    setFaceAction(0);
    stopCamera();
  }, [stopCamera]);

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

  useEffect(() => {
    if (!open) return;
    setHideBottomNav(true);
    startCamera();
    return () => setHideBottomNav(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, setHideBottomNav]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = () => {
    if (faceAction < ACTIONS.length - 1) {
      setFaceAction(faceAction + 1);
      return;
    }
    stopCamera();
    setStep("done");
    setTimeout(() => {
      onComplete();
      reset();
    }, 1200);
  };

  /** 仅演示环境使用：跳过核验直接通过 */
  const handleSkip = () => {
    stopCamera();
    setStep("done");
    setTimeout(() => {
      onComplete();
      reset();
    }, 1200);
  };

  if (!open) return null;

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const bgPage = isDark ? "bg-game-bg-page-dark" : "bg-game-bg-page";

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col transition-colors ${bgPage}`}>
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
            {step === "scan" ? "人脸验证" : "核验成功"}
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {step === "scan" && (
          <div className="text-center space-y-4">
            <p className={`text-sm ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
              领取签到奖励前需完成人脸验证，确认为本人操作
            </p>
            <div
              className="relative w-40 h-40 rounded-full mx-auto overflow-hidden flex items-center justify-center"
              style={{ background: streamActive ? "#000" : `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
            >
              {streamActive ? (
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
              ) : (
                <img src={faceScanIcon} alt="" width={48} height={48} />
              )}
              {streamActive && (
                <div className="absolute inset-x-0 h-0.5 bg-game-success animate-scan" style={{ animation: "scan 2s linear infinite" }} />
              )}
            </div>
            {!streamActive && (
              <Button
                className="rounded-xl text-white"
                style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                onClick={startCamera}
              >
                开启摄像头
              </Button>
            )}
            <p className={`text-sm font-medium ${ink}`}>{ACTIONS[faceAction]}</p>
            <div className="flex justify-center gap-1.5">
              {ACTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i > faceAction ? (isDark ? "bg-game-border-light-dark" : "bg-game-border-light") : ""}`}
                  style={i <= faceAction ? { background: GAME.primary } : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-game-success-soft-dark" : "bg-game-success-soft"}`}>
              <img src={checkSuccessIcon} alt="" width={40} height={40} />
            </div>
            <p className="text-lg font-semibold text-game-success">核验成功</p>
          </div>
        )}

        {step === "scan" && (
          <Button
            className="w-full h-12 rounded-xl text-white font-medium"
            style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
            onClick={handleNext}
          >
            下一步
          </Button>
        )}

        {step === "scan" && (
          <button
            type="button"
            onClick={handleSkip}
            className={`block w-full text-center text-caption ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}
          >
            （demo）跳过
          </button>
        )}
      </div>
    </div>
  );
}
