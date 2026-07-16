import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { clockInEarlyRise } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { CLOCK_IN_CONFIG, THEME } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

export default function EarlyRisePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [time, setTime] = useState(new Date());
  const [canIn, setCanIn] = useState(false);
  const cfg = CLOCK_IN_CONFIG.earlyRise;

  useEffect(() => {
    const t = setInterval(() => { const n = new Date(); setTime(n); setCanIn(n.getHours() >= 6 && n.getHours() < 9); }, 1000);
    return () => clearInterval(t);
  }, []);

  const clockMut = useMutation({
    mutationFn: (_vars: { userId: number; location: string }) => clockInEarlyRise(user?.pkeId),
    onSuccess: (d) => { toast({ title: "打卡成功", description: `获得${d.reward}PB` }); },
  });

  const tStr = time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #EFF6FF 0%, #fff 100%)" }}>
      <div className="px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">{cfg.label}</h1>
      </div>
      <div className="flex flex-col items-center pt-6 px-4">
        <Card className="w-full p-6 rounded-3xl border-0 shadow-lg text-center">
          <img src="/icons/early-rise.png" alt="" className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-3xl font-bold font-mono tracking-wider" style={{ color: THEME.text }}>{tStr}</h2>
          <p className="text-sm mt-2" style={{ color: THEME.textSecondary }}>{time.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p>
        </Card>
        <Card className="w-full p-4 rounded-2xl border-0 shadow-sm mt-4">
          <p className="text-sm text-center" style={{ color: THEME.textSecondary }}>{cfg.timeSlot.start} ~ {cfg.timeSlot.end} ({cfg.timeSlot.timezone})</p>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
            <div className="h-full rounded-full" style={{ width: canIn ? "100%" : "30%", background: canIn ? "linear-gradient(90deg, #3B82F6, #F59E0B)" : "#CBD5E1" }} />
          </div>
          <p className="text-xs text-center mt-2" style={{ color: canIn ? THEME.primary : THEME.textMuted }}>{canIn ? cfg.slogan : "不在打卡时段"}</p>
        </Card>
        <Button className="mt-8 w-40 h-40 rounded-full text-lg font-bold shadow-xl transition-all"
          style={canIn ? { background: "linear-gradient(135deg, #3B82F6, #7C3AED)", color: "#fff" } : { background: "#E2E8F0", color: "#94A3B8" }}
          onClick={() => user && clockMut.mutate({ userId: user.userId, location: "中国" })}
          disabled={!canIn || clockMut.isPending}>
          {clockMut.isPending ? "..." : canIn ? "打卡" : "未开放"}
        </Button>
        <Card className="w-full p-4 rounded-2xl border-0 shadow-sm mt-6 mb-6">
          <h3 className="text-sm font-medium mb-2" style={{ color: THEME.text }}>打卡规则</h3>
          <p className="text-xs" style={{ color: THEME.textSecondary }}>· 第1天打卡成功获得 1PB</p><p className="text-xs" style={{ color: THEME.textSecondary }}>· 连续打卡每天增加 1PB，上限 5PB</p><p className="text-xs" style={{ color: THEME.textSecondary }}>· 中断则次日扣 5P币，连续天数重置</p>
        </Card>
      </div>
    </div>
  );
}
