import { useEffect, useState } from "react";
import { ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import PolicyDialog from "@/components/dialogs/PolicyDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const FACE_ID_POLICY = [
  "《面容 ID 服务协议》用于说明 P客如何使用您的面部特征数据完成登录身份核验，包括数据采集范围、加密存储方式、保存期限以及您可以随时关闭该功能并删除相关数据的权利。",
  "面容特征数据仅用于本机身份核验，不会用于其他用途，也不会被上传至与登录无关的第三方服务。",
];

const PRIVACY_POLICY = [
  "《隐私政策》说明 P客收集、使用、存储和保护您个人信息的方式，包括账号信息、设备信息以及您主动授权的生物识别信息等。",
  "您可以在「安全中心」随时查看、修改或撤回已授权的信息，撤回后相关功能将无法继续使用。",
];

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

export default function FaceLoginConsentDialog({ open, onClose, onAgree }: Props) {
  const isDark = useStore((s) => s.isDark);
  const [agreed, setAgreed] = useState(false);
  const [showFaceIdPolicy, setShowFaceIdPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    if (open) setAgreed(false);
  }, [open]);

  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined} showCloseButton>
          <DialogHeader>
            <div
              className="w-12 h-12 rounded-button flex items-center justify-center"
              style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
            >
              <ScanFace size={24} style={{ color: GAME.primary }} />
            </div>
            <DialogTitle>开启面容登录</DialogTitle>
            <DialogDescription>
              开启后可使用面容快速登录，无需每次输入密码
            </DialogDescription>
          </DialogHeader>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5 data-[state=checked]:bg-game-primary data-[state=checked]:border-game-primary data-[state=checked]:text-game-on-primary"
            />
            <span className={`text-body ${inkSec}`}>
              我已阅读并同意
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFaceIdPolicy(true);
                }}
                className="font-medium"
                style={{ color: GAME.primaryText }}
              >
                《面容 ID 服务协议》
              </button>
              和
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyPolicy(true);
                }}
                className="font-medium"
                style={{ color: GAME.primaryText }}
              >
                《隐私政策》
              </button>
            </span>
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className={`h-12 rounded-button text-section-title ${outlineBtn}`}
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              type="button"
              className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
              style={CTA_STYLE}
              disabled={!agreed}
              onClick={onAgree}
            >
              同意并继续
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PolicyDialog
        open={showFaceIdPolicy}
        title="面容 ID 服务协议"
        paragraphs={FACE_ID_POLICY}
        onClose={() => setShowFaceIdPolicy(false)}
      />
      <PolicyDialog
        open={showPrivacyPolicy}
        title="隐私政策"
        paragraphs={PRIVACY_POLICY}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </>
  );
}
