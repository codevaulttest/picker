import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { BRAND, GAME } from "@/config/app.config";

interface Props {
  open: boolean;
  name: string;
  avatar?: string;
  pkeId?: string;
  onClose: () => void;
  onSave: (payload: { name: string; avatar: string }) => void;
}

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

const AVATAR_PREVIEW = 96;

export default function EditProfileDialog({
  open,
  name,
  avatar,
  pkeId,
  onClose,
  onSave,
}: Props) {
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draftName, setDraftName] = useState(name);
  const [draftAvatar, setDraftAvatar] = useState(avatar || "");

  useEffect(() => {
    if (!open) return;
    setDraftName(name);
    setDraftAvatar(avatar || BRAND.defaultAvatar(pkeId || "guest"));
  }, [open, name, avatar, pkeId]);

  const zh = lang !== "en";
  const trimmed = draftName.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= 20;

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: zh ? "请选择图片文件" : "Please choose an image",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (url) setDraftAvatar(url);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: trimmed, avatar: draftAvatar });
    toast({ title: zh ? "资料已更新" : "Profile updated" });
    onClose();
  };

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";
  const fieldSurface = isDark
    ? "bg-game-bg-card-dark border-game-border-light-dark text-game-ink-dark"
    : "bg-game-bg-card border-game-border-light text-game-ink";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={isDark ? "bg-game-bg-card-dark" : undefined}
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{zh ? "编辑资料" : "Edit profile"}</DialogTitle>
          <DialogDescription>
            {zh ? "更新头像与昵称，让朋友更容易认出你" : "Update your avatar and nickname"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={handlePickAvatar}
            className="relative active:scale-[0.97] transition-transform"
            aria-label={zh ? "更换头像" : "Change avatar"}
          >
            <img
              src={draftAvatar || BRAND.defaultAvatar(pkeId || "guest")}
              alt=""
              className="rounded-pill object-cover shadow-sm"
              style={{
                width: AVATAR_PREVIEW,
                height: AVATAR_PREVIEW,
                border: `3px solid ${isDark ? GAME.primarySoftDark : GAME.onPrimary}`,
              }}
            />
            <span
              className="absolute bottom-0.5 right-0.5 flex size-8 items-center justify-center rounded-pill shadow-sm"
              style={{
                background: isDark ? GAME.primarySoftDark : GAME.primarySoft,
                border: `2px solid ${isDark ? GAME.bgCardDark : GAME.bgCard}`,
              }}
            >
              <Camera size={14} style={{ color: GAME.primary }} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="w-full">
            <label className={`mb-2 block text-body font-semibold ${ink}`}>
              {zh ? "昵称" : "Nickname"}
            </label>
            <input
              type="text"
              value={draftName}
              maxLength={20}
              placeholder={zh ? "输入昵称" : "Enter nickname"}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) handleSave();
              }}
              className={`w-full h-12 px-3 rounded-button border text-task-title outline-none transition-shadow focus:border-game-primary focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
            />
            <p className={`mt-1.5 text-right text-caption tabular-nums ${inkDis}`}>
              {trimmed.length}/20
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className={`h-12 rounded-button text-section-title ${outlineBtn}`}
            onClick={onClose}
          >
            {zh ? "取消" : "Cancel"}
          </Button>
          <Button
            type="button"
            className="h-12 rounded-button text-section-title border-0 disabled:opacity-40"
            style={CTA_STYLE}
            disabled={!canSave}
            onClick={handleSave}
          >
            {zh ? "保存" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
