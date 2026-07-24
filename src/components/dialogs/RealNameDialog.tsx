import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wallet, KeyRound, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import CountryCodeSheet from "@/components/dialogs/CountryCodeSheet";
import { DEFAULT_COUNTRY, findCountry, type CountryCode } from "@/lib/phoneCountries";
import { allowedDocumentTypes, DOCUMENT_LABELS, type DocumentType } from "@/lib/documentTypes";
import idCardFrontIcon from "@/assets/svg/svg/custom/id-card-front.svg?url";
import idCardBackIcon from "@/assets/svg/svg/custom/id-card-back.svg?url";
import faceScanIcon from "@/assets/svg/svg/custom/face-scan.svg?url";
import checkSuccessIcon from "@/assets/svg/svg/custom/check-success.svg?url";

export interface RealNameInfo {
  region: CountryCode;
  documentType: DocumentType;
}

interface Props {
  open: boolean;
  onComplete: (info: RealNameInfo) => void;
  onClose: () => void;
}

type Step = "region" | "doc" | "face" | "code" | "done";
type UnlockMethod = "code" | "pay";
type CodeType = "pke" | "vault";

const REAL_NAME_PAY_COST = 500;

/** 实名认证全屏流程 - 支持调相册/调摄像头/可关闭 */
export default function RealNameDialog({ open, onComplete, onClose }: Props) {
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setHideBottomNav = useStore((s) => s.setHideBottomNav);
  const assets = useStore((s) => s.assets);
  const updateAsset = useStore((s) => s.updateAsset);
  const [step, setStep] = useState<Step>("region");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>(allowedDocumentTypes(DEFAULT_COUNTRY)[0]);
  const [unlockMethod, setUnlockMethod] = useState<UnlockMethod>("code");
  const [codeType, setCodeType] = useState<CodeType>("pke");
  const [authCode, setAuthCode] = useState("");
  const [paying, setPaying] = useState(false);
  const [faceAction, setFaceAction] = useState(0);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const actions = ["请眨眼", "请摇头", "请张嘴"];
  const countryOption = findCountry(country);
  const docTypes = allowedDocumentTypes(country);
  const needsBack = documentType !== "passport";

  const handleSelectCountry = (code: CountryCode) => {
    setCountry(code);
    setDocumentType(allowedDocumentTypes(code)[0]);
    setFrontImg(null);
    setBackImg(null);
  };

  const handleSelectDocType = (type: DocumentType) => {
    setDocumentType(type);
    setFrontImg(null);
    setBackImg(null);
  };

  const reset = useCallback(() => {
    setStep("region");
    setCountry(DEFAULT_COUNTRY);
    setDocumentType(allowedDocumentTypes(DEFAULT_COUNTRY)[0]);
    setUnlockMethod("code");
    setCodeType("pke");
    setAuthCode("");
    setPaying(false);
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
    if (step === "region") {
      setStep("doc");
    } else if (step === "doc") {
      if (!frontImg) {
        toast({ title: `请上传${DOCUMENT_LABELS[documentType]}${needsBack ? "正面" : ""}`, variant: "warning" });
        return;
      }
      if (needsBack && !backImg) {
        toast({ title: `请上传${DOCUMENT_LABELS[documentType]}反面`, variant: "warning" });
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
    } else if (step === "code" && unlockMethod === "code" && authCode.trim()) {
      if (authCode.length === 12) {
        setStep("done");
        setTimeout(() => {
          onComplete({ region: country, documentType });
          reset();
        }, 1500);
      } else {
        toast({ title: "认证码格式错误", description: "请输入12位字母+数字认证码", variant: "destructive" });
      }
    }
  };

  /** 仅演示环境使用：跳过当前步骤的校验/操作，直接进入下一步 */
  const handleSkip = () => {
    if (step === "region") {
      setStep("doc");
    } else if (step === "doc") {
      setStep("face");
      startCamera();
    } else if (step === "face") {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
      setStreamActive(false);
      setStep("code");
    } else if (step === "code") {
      setStep("done");
      setTimeout(() => {
        onComplete({ region: country, documentType });
        reset();
      }, 1500);
    }
  };

  const handlePay = () => {
    const balance = assets?.cv ?? 0;
    if (balance < REAL_NAME_PAY_COST) {
      toast({ title: "CV 余额不足", description: `完成实名认证需支付 ${REAL_NAME_PAY_COST} CV`, variant: "destructive" });
      return;
    }
    setPaying(true);
    setTimeout(() => {
      updateAsset("cv", balance - REAL_NAME_PAY_COST);
      setPaying(false);
      setStep("done");
      setTimeout(() => {
        onComplete({ region: country, documentType });
        reset();
      }, 1500);
    }, 600);
  };

  const progress = (["region", "doc", "face", "code", "done"] as Step[]).indexOf(step) + 1;

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
            {step === "region" && "选择国家/地区"}
            {step === "doc" && "上传证件信息"}
            {step === "face" && "人脸核验"}
            {step === "code" && "支付或填写认证码"}
            {step === "done" && "认证成功"}
          </h1>
        </div>

        {/* 进度条 */}
        {step !== "done" && (
          <div className="relative z-10 flex gap-1 mt-3">
            {[1, 2, 3, 4].map((i) => (
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
          {/* 步骤1：选择国家/地区 */}
          {step === "region" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>选择证件所属的国家/地区，用于判断可用的证件类型</p>
              <button
                type="button"
                onClick={() => setShowCountryPicker(true)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                  isDark ? "border-game-border-light-dark bg-game-bg-muted-dark" : "border-game-border-light bg-white"
                }`}
              >
                {countryOption.Flag ? (
                  <countryOption.Flag className="w-7 h-5 rounded-[2px] flex-shrink-0" />
                ) : (
                  <Globe size={18} className="flex-shrink-0" style={{ color: GAME.primary }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{countryOption.name}</p>
                </div>
                <ChevronRight size={18} className={isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"} />
              </button>

              <CountryCodeSheet
                open={showCountryPicker}
                value={country}
                showDial={false}
                onSelect={handleSelectCountry}
                onClose={() => setShowCountryPicker(false)}
              />
            </>
          )}

          {/* 步骤2：证件上传 - 证件类型随国家/地区变化，可调相册 */}
          {step === "doc" && (
            <>
              {docTypes.length > 1 && (
                <div className={`inline-flex items-center gap-1 rounded-button p-1 w-full ${isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"}`}>
                  {docTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSelectDocType(type)}
                      className={`flex-1 px-3 py-1.5 rounded-button text-body transition-colors ${
                        documentType === type
                          ? isDark ? "bg-game-bg-card-dark text-game-ink-dark shadow-warm-dark" : "bg-game-bg-card text-game-ink shadow-warm"
                          : isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"
                      }`}
                    >
                      {DOCUMENT_LABELS[type]}
                    </button>
                  ))}
                </div>
              )}

              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                请上传{DOCUMENT_LABELS[documentType]}{needsBack ? "正反面" : "信息页"}
              </p>

              {needsBack ? (
                <div className="flex gap-3">
                  <button onClick={() => frontInputRef.current?.click()}
                    className={`flex-1 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                      isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                    }`}>
                    {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                      <img src={idCardFrontIcon} alt="" width={24} height={24} />
                      <span className={`text-[10px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>{DOCUMENT_LABELS[documentType]}正面</span>
                    </>}
                    <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                  </button>
                  <button onClick={() => backInputRef.current?.click()}
                    className={`flex-1 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                      isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                    }`}>
                    {backImg ? <img src={backImg} className="w-full h-full object-cover" alt="back" /> : <>
                      <img src={idCardBackIcon} alt="" width={24} height={24} />
                      <span className={`text-[10px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>{DOCUMENT_LABELS[documentType]}反面</span>
                    </>}
                    <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                  </button>
                </div>
              ) : (
                <button onClick={() => frontInputRef.current?.click()}
                  className={`w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                    isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                  }`}>
                  {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                    <img src={idCardFrontIcon} alt="" width={24} height={24} />
                    <span className={`text-[10px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>{DOCUMENT_LABELS[documentType]}信息页</span>
                  </>}
                  <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                </button>
              )}
            </>
          )}

          {/* 步骤3：人脸 - 调摄像头 */}
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

          {/* 步骤4：支付 500 CV 或 输入认证码 */}
          {step === "code" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>选择一种方式，完成实名认证</p>

              {/* 解锁方式：支付 / 认证码 —— 两张可展开的选择卡 */}
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  unlockMethod === "pay"
                    ? isDark ? "border-game-primary" : "border-game-primary"
                    : isDark ? "border-game-border-light-dark" : "border-game-border-light"
                }`}
                style={unlockMethod === "pay" ? { background: isDark ? GAME.primarySoftDark : GAME.primarySoft } : { background: isDark ? "transparent" : "#fff" }}
              >
                <button
                  type="button"
                  onClick={() => setUnlockMethod("pay")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                    style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
                  >
                    <Wallet size={20} style={{ color: GAME.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>支付 {REAL_NAME_PAY_COST} CV</p>
                  </div>
                  <span
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={unlockMethod === "pay" ? { borderColor: GAME.primary } : { borderColor: isDark ? "#4A5160" : "#D6DBE3" }}
                  >
                    {unlockMethod === "pay" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: GAME.primary }} />}
                  </span>
                </button>

                {unlockMethod === "pay" && (
                  <div className={`px-4 pb-3.5 space-y-1.5 ${isDark ? "border-t border-game-border-light-dark" : "border-t border-game-border-light"} pt-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>认证费用</span>
                      <span className="text-sm font-semibold" style={{ color: GAME.primary }}>{REAL_NAME_PAY_COST} CV</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>当前余额</span>
                      <span className={`text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{(assets?.cv ?? 0).toLocaleString()} CV</span>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  unlockMethod === "code"
                    ? "border-game-primary"
                    : isDark ? "border-game-border-light-dark" : "border-game-border-light"
                }`}
                style={unlockMethod === "code" ? { background: isDark ? GAME.primarySoftDark : GAME.primarySoft } : { background: isDark ? "transparent" : "#fff" }}
              >
                <button
                  type="button"
                  onClick={() => setUnlockMethod("code")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                    style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
                  >
                    <KeyRound size={20} style={{ color: GAME.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>输入认证码</p>
                    <p className={`text-[12px] mt-0.5 ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>使用 P 客认证码或 CodeVAULT 认证码</p>
                  </div>
                  <span
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={unlockMethod === "code" ? { borderColor: GAME.primary } : { borderColor: isDark ? "#4A5160" : "#D6DBE3" }}
                  >
                    {unlockMethod === "code" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: GAME.primary }} />}
                  </span>
                </button>

                {unlockMethod === "code" && (
                  <div className={`px-4 pb-3.5 space-y-3 ${isDark ? "border-t border-game-border-light-dark" : "border-t border-game-border-light"} pt-3`}>
                    {/* 认证码类型：单选行 */}
                    <div className="space-y-1">
                      {([
                        { key: "pke" as CodeType, label: "P 客认证码" },
                        { key: "vault" as CodeType, label: "CodeVAULT 认证码" },
                      ]).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setCodeType(opt.key)}
                          className="w-full flex items-center gap-2 py-1.5 text-left"
                        >
                          <span
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={codeType === opt.key ? { borderColor: GAME.primary } : { borderColor: isDark ? "#4A5160" : "#D6DBE3" }}
                          >
                            {codeType === opt.key && <span className="w-2 h-2 rounded-full" style={{ background: GAME.primary }} />}
                          </span>
                          <span className={`text-sm ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>

                    <input type="text" placeholder="XXXXXXXXXXXX" value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                      maxLength={12}
                      className={`w-full h-12 px-4 rounded-xl border text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-game-primary-light ${
                        isDark ? "bg-game-bg-muted-dark border-game-border-light-dark text-game-ink-dark" : "bg-white border-game-border-light text-game-ink"
                      }`} />
                    <p className={`text-[10px] text-center ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>12位字母+数字组合</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 完成 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-game-success-soft-dark" : "bg-game-success-soft"}`}>
                <img src={checkSuccessIcon} alt="" width={40} height={40} />
              </div>
              <p className="text-lg font-semibold text-game-success">实名认证成功</p>
            </div>
          )}

          {step !== "done" && (
            <Button className="w-full h-12 rounded-xl text-white font-medium"
              style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
              onClick={step === "code" && unlockMethod === "pay" ? handlePay : handleNext}
              disabled={step === "code" && unlockMethod === "pay" && paying}>
              {step === "code"
                ? unlockMethod === "pay"
                  ? (paying ? "支付中…" : `支付 ${REAL_NAME_PAY_COST} CV 完成认证`)
                  : "完成认证"
                : "下一步"}
            </Button>
          )}

          {step !== "done" && (
            <button
              type="button"
              onClick={handleSkip}
              className={`block w-full text-center text-[12px] ${isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}
            >
              （demo）跳过
            </button>
          )}
      </div>
    </div>
  );
}
