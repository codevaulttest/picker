import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { exchangeUpgradeCode, getUpgradeCosts, listUpgradeCodes, transferUpgradeCodes } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { THEME, getLevel } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

const tabs = ["UNUSED", "USED", "TRANSFERRED"] as const;
const tabLabels = { UNUSED: "未使用", USED: "已使用", TRANSFERRED: "已转出" };

export default function UpgradeCodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<typeof tabs[number]>("UNUSED");
  const [showMap, setShowMap] = useState<Record<number, boolean>>({});
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selId, setSelId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState("");
  const [selLevel, setSelLevel] = useState(2);

  const { data: codes = [], refetch } = useQuery({
    queryKey: ["upgradeCode", "list", user?.userId, tab],
    queryFn: () => listUpgradeCodes(tab),
    enabled: !!user,
  });
  const { data: costs = [] } = useQuery({ queryKey: ["upgradeCode", "costs"], queryFn: async () => getUpgradeCosts() });

  const exMut = useMutation({
    mutationFn: (vars: { userId: number; level: number }) => exchangeUpgradeCode(vars.level),
    onSuccess: (d) => { toast({ title: "兑换成功", description: `获得${getLevel(d.level).cnName}升级码` }); setExchangeOpen(false); refetch(); },
  });
  const trMut = useMutation({
    mutationFn: (vars: { userId: number; codeIds: number[]; toUserId: string }) => transferUpgradeCodes(vars.codeIds, vars.toUserId),
    onSuccess: () => { toast({ title: "转让成功" }); setTransferOpen(false); refetch(); },
  });

  const mask = (code: string, show: boolean) => show ? code : code.slice(0, 3) + "******" + code.slice(9);
  const curCost = costs.find((c) => c.level === selLevel);

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">升级码</h1>
        <button onClick={() => setExchangeOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: THEME.orange }}>兑换</button>
      </div>
      <div className="mx-4 mt-3"><p className="text-xs p-3 rounded-xl" style={{ background: THEME.orangeLight, color: THEME.orange }}>升级码用于提升P客等级，每个等级对应不同的升级码。</p></div>
      <div className="flex mx-4 mt-3 bg-white rounded-xl p-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${tab === t ? "text-white" : "text-slate-500"}`} style={tab === t ? { background: THEME.orange } : {}}>{tabLabels[t]}</button>
        ))}
      </div>
      <div className="mx-4 mt-3 space-y-2 pb-6">
        {codes.map((c) => (
          <Card key={c.id} className="p-4 rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: THEME.orangeLight, color: THEME.orange }}>Lv.{c.level}</span>
                  <span className="font-mono text-sm tracking-wider" style={{ color: THEME.text }}>{mask(c.code, !!showMap[c.id])}</span>
                  <button onClick={() => setShowMap((p) => ({ ...p, [c.id]: !p[c.id] }))}>{showMap[c.id] ? <EyeOff size={14} className="text-slate-400" /> : <Eye size={14} className="text-slate-400" />}</button>
                </div>
                {c.usedByRealName && <p className="text-xs text-slate-400 mt-1">使用者: {c.usedByRealName}</p>}
                {c.transferredTo && <p className="text-xs text-slate-400 mt-1">转给: {c.transferredTo}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: "已复制" }); }} className="p-2 rounded-lg hover:bg-slate-50"><Copy size={16} className="text-slate-400" /></button>
                {tab === "UNUSED" && <button onClick={() => { setSelId(c.id); setTransferOpen(true); }} className="p-2 rounded-lg hover:bg-slate-50"><Share2 size={16} style={{ color: THEME.orange }} /></button>}
              </div>
            </div>
          </Card>
        ))}
        {codes.length === 0 && <div className="text-center py-12 text-sm" style={{ color: THEME.textMuted }}>暂无升级码</div>}
      </div>
      <Dialog open={exchangeOpen} onOpenChange={setExchangeOpen}>
        <DialogContent className="sm:max-w-sm border-0 rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>兑换升级码</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-2 py-2">
            {costs.map((c) => (
              <button key={c.level} onClick={() => setSelLevel(c.level)}
                className={`p-2 rounded-xl text-xs border transition-colors ${selLevel === c.level ? "border-orange-500 bg-orange-50" : "border-slate-200"}`}>
                <div className="font-medium" style={{ color: THEME.text }}>Lv.{c.level}</div>
                <div className="text-[10px]" style={{ color: THEME.textMuted }}>{getLevel(c.level).cnName}</div>
                <div className="text-[10px]" style={{ color: THEME.orange }}>{c.cost} BV</div>
              </button>
            ))}
          </div>
          <Button className="w-full h-11 rounded-xl text-white" style={{ background: THEME.orange }}
            onClick={() => user && exMut.mutate({ userId: user.userId, level: selLevel })}
            disabled={exMut.isPending}>
            {exMut.isPending ? "..." : `支付 ${curCost?.cost?.toLocaleString() || 0} BV 兑换`}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
          <DialogHeader><DialogTitle>转让升级码</DialogTitle></DialogHeader>
          <input type="text" placeholder="请输入对方 ID 账号" value={targetId} onChange={(e) => setTargetId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <Button className="w-full h-11 rounded-xl text-white" style={{ background: THEME.orange }}
            onClick={() => selId && user && trMut.mutate({ userId: user.userId, codeIds: [selId], toUserId: targetId })}
            disabled={trMut.isPending}>{trMut.isPending ? "..." : "确认转让"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
