import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStore } from "@/stores";
import { TEXT, GAME } from "@/config/app.config";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CheckInRulesDialog({ open, onClose }: Props) {
  const isDark = useStore((s) => s.isDark);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
        <div className="py-2">
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>
            {TEXT.home.signInRulesTitle}
          </h3>
          <div className="flex flex-col gap-2 mb-4">
            {TEXT.home.signInRules.map((rule) => (
              <p key={rule} className={`text-sm leading-relaxed ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                {rule}
              </p>
            ))}
          </div>
          <Button
            className="w-full rounded-xl h-11 text-white"
            style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
            onClick={onClose}
          >
            我知道了
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
