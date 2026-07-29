import { useEffect, useState } from "react";
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
import { skipVerifyReminderToday } from "@/lib/realName";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

export default function RealNameReminderDialog({ open, onClose, onConfirm }: Props) {
  const isDark = useStore((s) => s.isDark);
  const [skipToday, setSkipToday] = useState(false);

  useEffect(() => {
    if (open) setSkipToday(false);
  }, [open]);

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";

  const handleDismiss = () => {
    if (skipToday) skipVerifyReminderToday();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined}>
        <DialogHeader>
          <DialogTitle className={ink}>完善实名认证</DialogTitle>
          <DialogDescription className={inkSec}>
            您的实名认证信息不完善，将会影响您使用P客部分功能，提交身份证信息并完成人脸识别即可完善信息。
          </DialogDescription>
        </DialogHeader>

        <label className="flex items-center justify-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={skipToday}
            onCheckedChange={(v) => setSkipToday(v === true)}
            className="data-[state=checked]:bg-game-primary data-[state=checked]:border-game-primary data-[state=checked]:text-game-on-primary"
          />
          <span className={`text-body ${inkSec}`}>今日不再提醒</span>
        </label>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className={`h-12 rounded-button text-section-title ${outlineBtn}`}
            onClick={handleDismiss}
          >
            取消
          </Button>
          <Button
            type="button"
            className="h-12 rounded-button text-section-title border-0"
            style={CTA_STYLE}
            onClick={() => {
              if (skipToday) skipVerifyReminderToday();
              onConfirm();
            }}
          >
            去完善
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
