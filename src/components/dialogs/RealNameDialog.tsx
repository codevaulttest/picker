import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { THEME } from "@/config/app.config";

interface Props {
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

type Step = "name" | "idcard" | "face" | "code" | "done";

/** 实名认证弹窗 - 支持调相册/调摄像头/可关闭 */
export default function RealNameDialog({ open, onComplete, onClose }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("name");
  const [realName, setRealName] = useState("");
  const [idNumber, setIdNumber] = useState("");
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
    setStep("name");
    setRealName("");
    setIdNumber("");
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
    if (step === "name" && realName.trim()) {
      setStep("idcard");
    } else if (step === "idcard") {
      if (!frontImg && !idNumber.trim()) {
        toast({ title: "请上传身份证或输入证件号" });
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

  const progress = (["name", "idcard", "face", "code", "done"] as Step[]).indexOf(step) + 1;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-sm border-0 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {step === "name" && "实名认证"}
            {step === "idcard" && "上传身份信息"}
            {step === "face" && "人脸核验"}
            {step === "code" && "填写认证码"}
            {step === "done" && "认证成功"}
          </DialogTitle>
        </DialogHeader>

        {/* 进度条 */}
        {step !== "done" && (
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: progress >= i ? "linear-gradient(90deg, #3B82F6, #8B5CF6)" : "#E2E8F0" }} />
            ))}
          </div>
        )}

        <div className="py-2 space-y-4">
          {/* 步骤1：姓名 */}
          {step === "name" && (
            <>
              <p className="text-sm text-slate-500 text-center">请输入您的真实姓名</p>
              <input type="text" placeholder="真实姓名" value={realName} onChange={(e) => setRealName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </>
          )}

          {/* 步骤2：身份证 - 可调相册 */}
          {step === "idcard" && (
            <>
              <p className="text-sm text-slate-500 text-center">请上传身份证正反面</p>
              <div className="flex gap-3">
                <button onClick={() => frontInputRef.current?.click()}
                  className="flex-1 h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-blue-300 transition-colors overflow-hidden relative">
                  {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                    <span className="text-[10px] text-slate-400">身份证正面</span>
                  </>}
                  <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                </button>
                <button onClick={() => backInputRef.current?.click()}
                  className="flex-1 h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-blue-300 transition-colors overflow-hidden relative">
                  {backImg ? <img src={backImg} className="w-full h-full object-cover" alt="back" /> : <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15h18" /><path d="M8 3v18" /></svg>
                    <span className="text-[10px] text-slate-400">身份证反面</span>
                  </>}
                  <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center">或手动输入证件号码</p>
              <input type="text" placeholder="身份证号码（18位）" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </>
          )}

          {/* 步骤3：人脸 - 调摄像头 */}
          {step === "face" && (
            <div className="text-center space-y-4">
              <div className="relative w-40 h-40 rounded-full mx-auto overflow-hidden flex items-center justify-center"
                style={{ background: streamActive ? "#000" : "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                {streamActive ? (
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                )}
                {/* 扫描线动画 */}
                {streamActive && <div className="absolute inset-x-0 h-0.5 bg-green-400 animate-scan" style={{ animation: "scan 2s linear infinite" }} />}
              </div>
              {!streamActive && (
                <Button className="rounded-xl text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
                  onClick={startCamera}>开启摄像头</Button>
              )}
              <p className="text-sm font-medium" style={{ color: THEME.text }}>{actions[faceAction]}</p>
              <div className="flex justify-center gap-1.5">
                {actions.map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: i <= faceAction ? "#3B82F6" : "#E2E8F0" }} />
                ))}
              </div>
            </div>
          )}

          {/* 步骤4：认证码 */}
          {step === "code" && (
            <>
              <p className="text-sm text-slate-500 text-center">请输入12位认证码完成实名</p>
              <input type="text" placeholder="XXXXXXXXXXXX" value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                maxLength={12}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <p className="text-[10px] text-slate-400 text-center">12位字母+数字组合</p>
            </>
          )}

          {/* 完成 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-lg font-semibold text-green-600">实名认证成功</p>
              <p className="text-sm text-slate-500 mt-1">您现在可以正常签到了</p>
            </div>
          )}

          {step !== "done" && (
            <Button className="w-full h-12 rounded-xl text-white font-medium"
              style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
              onClick={handleNext}>
              {step === "code" ? "完成认证" : "下一步"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
