import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { signIn } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { TEXT } from "@/config/app.config";

const CHECKIN_REMINDER_KEY = "pke_checkin_reminder";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SignInDialog({ open, onClose }: Props) {
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const isDark = useStore((s) => s.isDark);

  const [reminder, setReminder] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(CHECKIN_REMINDER_KEY) === "1"
  );

  const handleReminderChange = (on: boolean) => {
    setReminder(on);
    localStorage.setItem(CHECKIN_REMINDER_KEY, on ? "1" : "0");
    toast({ title: on ? "已开启签到提醒" : "已关闭签到提醒" });
  };

  const signInMutation = useMutation({
    mutationFn: (vars: { pkeId: string }) => signIn(vars.pkeId),
    onSuccess: () => {
      toast({ title: TEXT.home.signInNow + "成功", description: "获得1PB奖励" });
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EFF6FF" }}>
            <img src="/icons/early-rise.png" alt="signin" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{TEXT.home.dailySignIn}</h3>
          <p className="text-sm text-slate-500 mb-4">
            {user?.isRealName ? TEXT.home.signInReward : TEXT.clockIn.early.rules[0]}
          </p>
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 mb-4 ${
              isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"
            }`}
          >
            <span className={`text-body ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>
              每日提醒我签到
            </span>
            <Switch
              checked={reminder}
              onCheckedChange={handleReminderChange}
              aria-label="每日提醒我签到"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={onClose}>
              {TEXT.home.signInLater}
            </Button>
            {user?.isRealName ? (
              <Button
                className="flex-1 rounded-xl h-11 text-white"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                onClick={() => user?.pkeId && signInMutation.mutate({ pkeId: user.pkeId })}
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? "..." : TEXT.home.signInNow}
              </Button>
            ) : (
              <Button className="flex-1 rounded-xl h-11 bg-orange-500 hover:bg-orange-600" onClick={onClose}>
                {TEXT.home.toRealName}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
