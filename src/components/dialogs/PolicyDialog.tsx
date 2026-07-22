import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/stores";

interface Props {
  open: boolean;
  title: string;
  paragraphs: string[];
  onClose: () => void;
}

export default function PolicyDialog({ open, title, paragraphs, onClose }: Props) {
  const isDark = useStore((s) => s.isDark);
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={isDark ? "bg-game-bg-card-dark" : undefined}
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>（演示内容，仅用于原型展示）</DialogDescription>
        </DialogHeader>
        <div className={`max-h-[50vh] overflow-y-auto space-y-3 text-body leading-relaxed ${inkSec}`}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
