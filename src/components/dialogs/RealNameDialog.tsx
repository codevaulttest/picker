import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wallet, KeyRound, Globe, IdCard, Car, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import CountryCodeSheet from "@/components/dialogs/CountryCodeSheet";
import { DEFAULT_COUNTRY, findCountry, type CountryCode } from "@/lib/phoneCountries";
import { allowedDocumentTypes, DOCUMENT_LABELS, type DocumentType } from "@/lib/documentTypes";
import { createDemoRealNameInfo, type RealNameInfo } from "@/lib/realName";
import idCardFrontIcon from "@/assets/svg/svg/custom/id-card-front.svg?url";
import idCardBackIcon from "@/assets/svg/svg/custom/id-card-back.svg?url";
import faceScanIcon from "@/assets/svg/svg/custom/face-scan.svg?url";
import checkSuccessIcon from "@/assets/svg/svg/custom/check-success.svg?url";

export type { RealNameInfo };

interface Props {
  open: boolean;
  /** 重新提交（认证被拒绝/资料不完整）时无需再付一次开通费用，直接跳过支付/认证码步骤 */
  skipUnlockPay?: boolean;
  /** renew：仅展示"支付/认证码"这一屏，付款或验证通过后直接完成续费，不进入国家/证件/人脸后续步骤 */
  mode?: "verify" | "renew";
  onComplete: (info: RealNameInfo) => void;
  onRenewComplete?: () => void;
  onClose: () => void;
}

type Step = "code" | "region" | "doc" | "face" | "done";
type UnlockMethod = "code" | "pay";
type CodeType = "pke" | "vault";

const REAL_NAME_PAY_COST = 500;

/** 实名认证全屏流程 - 支持调相册/调摄像头/可关闭 */
export default function RealNameDialog({ open, skipUnlockPay = false, mode = "verify", onComplete, onRenewComplete, onClose }: Props) {
  const renewMode = mode === "renew";
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const setHideBottomNav = useStore((s) => s.setHideBottomNav);
  const assets = useStore((s) => s.assets);
  const updateAsset = useStore((s) => s.updateAsset);
  const pkeId = useStore((s) => s.user?.pkeId);
  const getInitialStep = (): Step => (renewMode ? "code" : skipUnlockPay ? "region" : "code");

  const [step, setStep] = useState<Step>(getInitialStep());
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  /** 有多种证件类型可选时，不预选任何一项，强制用户主动选择 */
  const [documentType, setDocumentType] = useState<DocumentType | null>(allowedDocumentTypes(DEFAULT_COUNTRY)[0]);
  const [unlockMethod, setUnlockMethod] = useState<UnlockMethod>("code");
  const [codeType, setCodeType] = useState<CodeType>("pke");
  const [authCode, setAuthCode] = useState("");
  const [paying, setPaying] = useState(false);
  const [faceAction, setFaceAction] = useState(0);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  /** 支付/认证码页返回时的二次确认——退出后需要重新开始 */
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  /** 未选证件类型就点下一步时，在证件类型控件旁就地提示，而不是弹全局 toast */
  const [docTypeError, setDocTypeError] = useState(false);
  /** 认证码格式错误——就地显示在输入框下方 */
  const [authCodeError, setAuthCodeError] = useState(false);
  /** 证件正/反面缺失——就地高亮对应的上传框 */
  const [docImgError, setDocImgError] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });
  /** CV 余额不足——就地显示在"支付"选择卡内 */
  const [payBalanceError, setPayBalanceError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const actions = ["请眨眼", "请摇头", "请张嘴"];
  const countryOption = findCountry(country);
  const docTypes = allowedDocumentTypes(country);
  /** 证件上传/人脸等后续步骤只会在证件类型确定后才会进入，这里兜底取第一个仅用于类型收窄 */
  const effectiveDocType = documentType ?? docTypes[0];
  const needsBack = effectiveDocType !== "passport";
  /** 仅本地身份证件（大陆/港澳台）在 demo 内走完整流程；其余国家/地区的证件类型仅供预览，下一步时提示走第三方认证 */
  const isDemoLimited = !docTypes.includes("idcard");

  const handleSelectCountry = (code: CountryCode) => {
    setCountry(code);
    const types = allowedDocumentTypes(code);
    // 只有一种证件类型时无需选择，直接确定；多种可选时清空，强制用户重新选择
    setDocumentType(types.length === 1 ? types[0] : null);
    setDocTypeError(false);
    setFrontImg(null);
    setBackImg(null);
  };

  const handleSelectDocType = (type: DocumentType) => {
    setDocumentType(type);
    setDocTypeError(false);
    setFrontImg(null);
    setBackImg(null);
  };

  const reset = useCallback(() => {
    setStep(getInitialStep());
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
    setShowExitConfirm(false);
    setDocTypeError(false);
    setAuthCodeError(false);
    setDocImgError({ front: false, back: false });
    setPayBalanceError(false);
  }, [skipUnlockPay, renewMode]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setStreamActive(false);
  };

  /** 返回按钮：逐级退回上一屏（人脸→证件→选国家→支付/认证码），只有从最开始的支付/认证码屏再退才是真正退出——反正中途退出不会扣费或消耗认证码，但退出后要重新开始，先二次确认避免误触 */
  const handleBack = () => {
    if (step === "doc") {
      setStep("region");
    } else if (step === "face") {
      stopCamera();
      setStep("doc");
    } else if (step === "region" && !skipUnlockPay) {
      setStep("code");
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === "front") setFrontImg(ev.target?.result as string);
      else setBackImg(ev.target?.result as string);
      setDocImgError((prev) => ({ ...prev, [type]: false }));
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

  /** 只有真正完成认证/续费才扣款，中途退出不收费 */
  const chargeIfPaying = () => {
    if (unlockMethod === "pay") {
      updateAsset("cv", (assets?.cv ?? 0) - REAL_NAME_PAY_COST);
    }
  };

  const finishVerification = () => {
    chargeIfPaying();
    setStep("done");
    setTimeout(() => {
      onComplete(createDemoRealNameInfo(pkeId, country, effectiveDocType));
      reset();
    }, 1500);
  };

  const finishRenew = () => {
    chargeIfPaying();
    setStep("done");
    setTimeout(() => {
      onRenewComplete?.();
      reset();
    }, 1500);
  };

  const handleNext = () => {
    if (step === "code" && unlockMethod === "code" && authCode.trim()) {
      if (authCode.length === 12) {
        setAuthCodeError(false);
        if (renewMode) {
          finishRenew();
        } else {
          setStep("region");
        }
      } else {
        setAuthCodeError(true);
      }
    } else if (step === "region") {
      if (docTypes.length > 1 && documentType === null) {
        setDocTypeError(true);
        return;
      }
      if (isDemoLimited) {
        toast({ title: "（demo）进入第三方认证流程" });
        return;
      }
      setStep("doc");
    } else if (step === "doc") {
      if (!frontImg || (needsBack && !backImg)) {
        setDocImgError({ front: !frontImg, back: needsBack && !backImg });
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
        finishVerification();
      }
    }
  };

  /** 仅演示环境使用：跳过当前步骤的校验/操作，直接进入下一步 */
  const handleSkip = () => {
    if (step === "code") {
      if (renewMode) {
        finishRenew();
      } else {
        setStep("region");
      }
    } else if (step === "region") {
      if (documentType === null) setDocumentType(docTypes[0]);
      // 境外/无本地证件的国家在 demo 里没有真正的第三方认证可接，跳过时直接视为认证完成，不进证件上传/人脸步骤
      if (isDemoLimited) {
        finishVerification();
      } else {
        setStep("doc");
      }
    } else if (step === "doc") {
      setStep("face");
      startCamera();
    } else if (step === "face") {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
      setStreamActive(false);
      finishVerification();
    }
  };

  const handlePay = () => {
    const balance = assets?.cv ?? 0;
    if (balance < REAL_NAME_PAY_COST) {
      setPayBalanceError(true);
      return;
    }
    setPayBalanceError(false);
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      if (renewMode) {
        finishRenew();
      } else {
        setStep("region");
      }
    }, 600);
  };

  const progress = (["code", "region", "doc", "face", "done"] as Step[]).indexOf(step) + 1;

  useEffect(() => {
    if (!open) return;
    setStep(getInitialStep());
    setHideBottomNav(true);
    return () => setHideBottomNav(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, skipUnlockPay, renewMode, setHideBottomNav]);

  if (!open) return null;

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const bgPage = isDark ? "bg-game-bg-page-dark" : "bg-game-bg-page";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col max-w-md mx-auto transition-colors ${bgPage}`}>
      <header className="relative px-3.5 pt-3.5 pb-2 flex-shrink-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={handleBack}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1 className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}>
            {step === "code" && (renewMode ? "续费实名认证" : "支付或填写认证码")}
            {step === "region" && "选择国家/地区"}
            {step === "doc" && "上传证件信息"}
            {step === "face" && "人脸核验"}
            {step === "done" && (renewMode ? "续费成功" : "认证成功")}
          </h1>
        </div>

        {/* 进度条：续费只有一屏，不展示分步进度 */}
        {step !== "done" && !renewMode && (
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
          {/* 步骤1：支付 500 CV 或 输入认证码，开通后续认证流程 */}
          {step === "code" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>{renewMode ? "选择一种方式，开始续费实名认证" : "选择一种方式，开始实名认证"}</p>
              <div
                className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${isDark ? "bg-game-info-soft-dark" : "bg-game-info-soft"}`}
              >
                <Info size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-game-info" aria-hidden />
                <p className={`text-[12px] leading-relaxed ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                  {renewMode ? "续费成功后才会扣款或核销认证码，中途退出不受影响" : "认证通过后才会扣款或核销认证码，中途退出不受影响"}
                </p>
              </div>

              {/* 开通方式：支付 / 认证码 —— 两张可展开的选择卡 */}
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  payBalanceError
                    ? "border-game-error"
                    : unlockMethod === "pay"
                      ? isDark ? "border-game-primary" : "border-game-primary"
                      : isDark ? "border-game-border-light-dark" : "border-game-border-light"
                }`}
                style={unlockMethod === "pay" ? { background: isDark ? GAME.primarySoftDark : GAME.primarySoft } : { background: isDark ? "transparent" : "#fff" }}
              >
                <button
                  type="button"
                  onClick={() => { setUnlockMethod("pay"); setPayBalanceError(false); }}
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
                      <span className={`text-sm font-medium ${payBalanceError ? "text-game-error" : isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{(assets?.cv ?? 0).toLocaleString()} CV</span>
                    </div>
                    {payBalanceError && (
                      <p className="text-[12px] text-game-error">CV 余额不足，完成实名认证需支付 {REAL_NAME_PAY_COST} CV</p>
                    )}
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
                  onClick={() => { setUnlockMethod("code"); setPayBalanceError(false); }}
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
                      onChange={(e) => { setAuthCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()); setAuthCodeError(false); }}
                      maxLength={12}
                      className={`w-full h-12 px-4 rounded-xl border text-sm font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-game-primary-light ${
                        isDark ? "bg-game-bg-muted-dark text-game-ink-dark" : "bg-white text-game-ink"
                      } ${authCodeError ? "border-game-error" : isDark ? "border-game-border-light-dark" : "border-game-border-light"}`} />
                    <p className={`text-caption text-center ${authCodeError ? "text-game-error" : isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                      {authCodeError ? "认证码格式错误，请输入12位字母+数字组合" : "12位字母+数字组合"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 步骤2：选择国家/地区 + 证件类型——两个独立的选择项，各自有标题，互不弹窗打断 */}
          {step === "region" && (
            <>
              <div className="space-y-1.5">
                <p className={`text-caption font-medium ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>选择国家/地区</p>
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
              </div>

              <CountryCodeSheet
                open={showCountryPicker}
                value={country}
                showDial={false}
                onSelect={handleSelectCountry}
                onClose={() => setShowCountryPicker(false)}
              />

              <div className="space-y-1.5">
                <p className={`text-caption font-medium ${docTypeError ? "text-game-error" : isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>选择证件类型</p>
                {docTypes.length > 1 ? (
                  <div className="space-y-2">
                    {docTypes.map((type) => {
                      const selected = documentType === type;
                      const TypeIcon = type === "license" ? Car : IdCard;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectDocType(type)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                            selected ? "border-game-primary" : docTypeError ? "border-game-error" : isDark ? "border-game-border-light-dark" : "border-game-border-light"
                          }`}
                          style={selected ? { background: isDark ? GAME.primarySoftDark : GAME.primarySoft } : { background: isDark ? "transparent" : "#fff" }}
                        >
                          <TypeIcon size={18} className="flex-shrink-0" style={{ color: GAME.primary }} />
                          <p className={`flex-1 text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{DOCUMENT_LABELS[type]}</p>
                          <span
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={selected ? { borderColor: GAME.primary } : { borderColor: docTypeError ? GAME.error : isDark ? "#4A5160" : "#D6DBE3" }}
                          >
                            {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: GAME.primary }} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border ${
                      isDark ? "border-game-border-light-dark bg-game-bg-muted-dark" : "border-game-border-light bg-white"
                    }`}
                  >
                    <IdCard size={18} className="flex-shrink-0" style={{ color: GAME.primary }} />
                    <p className={`flex-1 text-sm font-medium ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>{DOCUMENT_LABELS[docTypes[0]]}</p>
                  </div>
                )}
                {(docTypeError || docTypes.length === 1) && (
                  <p className={`text-caption ${docTypeError ? "text-game-error" : isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}`}>
                    {docTypeError ? "请选择证件类型后再继续" : `${countryOption.name}仅支持${DOCUMENT_LABELS[docTypes[0]]}认证`}
                  </p>
                )}
              </div>
            </>
          )}

          {/* 步骤3：证件上传——证件类型已在上一步选定，这里只负责拍照/相册上传 */}
          {step === "doc" && (
            <>
              <p className={`text-sm text-center ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                请上传{DOCUMENT_LABELS[effectiveDocType]}{needsBack ? "正反面" : "信息页"}
              </p>

              {needsBack ? (
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <button onClick={() => frontInputRef.current?.click()}
                      className={`w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                        docImgError.front
                          ? "border-game-error"
                          : isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                      }`}>
                      {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                        <img src={idCardFrontIcon} alt="" width={24} height={24} />
                        <span className={`text-caption ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>{DOCUMENT_LABELS[effectiveDocType]}正面</span>
                      </>}
                      <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                    </button>
                    {docImgError.front && <p className="text-caption text-center text-game-error">请上传正面</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <button onClick={() => backInputRef.current?.click()}
                      className={`w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                        docImgError.back
                          ? "border-game-error"
                          : isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                      }`}>
                      {backImg ? <img src={backImg} className="w-full h-full object-cover" alt="back" /> : <>
                        <img src={idCardBackIcon} alt="" width={24} height={24} />
                        <span className={`text-caption ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>{DOCUMENT_LABELS[effectiveDocType]}反面</span>
                      </>}
                      <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                    </button>
                    {docImgError.back && <p className="text-caption text-center text-game-error">请上传反面</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <button onClick={() => frontInputRef.current?.click()}
                    className={`w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative ${
                      docImgError.front
                        ? "border-game-error"
                        : isDark ? "border-game-border-light-dark hover:border-game-primary-light" : "border-game-border-light hover:border-game-primary-light"
                    }`}>
                    {frontImg ? <img src={frontImg} className="w-full h-full object-cover" alt="front" /> : <>
                      <img src={idCardFrontIcon} alt="" width={24} height={24} />
                      <span className={`text-caption ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>{DOCUMENT_LABELS[effectiveDocType]}信息页</span>
                    </>}
                    <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                  </button>
                  {docImgError.front && <p className="text-caption text-center text-game-error">请上传{DOCUMENT_LABELS[effectiveDocType]}信息页</p>}
                </div>
              )}
            </>
          )}

          {/* 步骤4：人脸 - 调摄像头 */}
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

          {/* 完成 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-game-success-soft-dark" : "bg-game-success-soft"}`}>
                <img src={checkSuccessIcon} alt="" width={40} height={40} />
              </div>
              <p className="text-lg font-semibold text-game-success">{renewMode ? "续费成功" : "实名认证成功"}</p>
            </div>
          )}

          {step !== "done" && (
            <Button className="w-full h-12 rounded-xl text-white font-medium"
              style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
              onClick={step === "code" && unlockMethod === "pay" ? handlePay : handleNext}
              disabled={step === "code" && unlockMethod === "pay" && paying}>
              {step === "code" && unlockMethod === "pay"
                ? (paying ? "支付中…" : `支付 ${REAL_NAME_PAY_COST} CV ${renewMode ? "续费" : "开通认证"}`)
                : renewMode
                  ? "确认续费"
                  : step === "face"
                    ? "完成认证"
                    : "下一步"}
            </Button>
          )}

          {step !== "done" && (
            <button
              type="button"
              onClick={handleSkip}
              className={`block w-full text-center text-caption ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}
            >
              （demo）跳过
            </button>
          )}
      </div>

      <AlertDialog open={showExitConfirm} onOpenChange={(v) => !v && setShowExitConfirm(false)}>
        <AlertDialogContent
          className={`rounded-card border-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={ink}>退出认证？</AlertDialogTitle>
            <AlertDialogDescription className={isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}>
              退出后需要重新开始，已填写的信息不会保留。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-button border-0 sm:flex-initial">
              继续认证
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-button border-0 sm:flex-initial"
              style={{ background: GAME.error, color: GAME.onPrimary }}
              onClick={() => {
                setShowExitConfirm(false);
                handleClose();
              }}
            >
              确认退出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
