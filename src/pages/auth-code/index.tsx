import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { exchangeAuthCode, listAuthCodes, transferAuthCodes } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { AUTH_CODE_CONFIG, TEXT, THEME } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

const tabs = ["UNUSED", "USED", "TRANSFERRED"] as const;
const tabLabels = { UNUSED: "未使用", USED: "已使用", TRANSFERRED: "已转出" };

export default function AuthCodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<typeof tabs[number]>("UNUSED");
  const [showMap, setShowMap] = useState<Record<number, boolean>>({});
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetId, setTargetId] = useState("");
  const [payAsset, setPayAsset] = useState<"CV" | "UV" | "BV">("CV");
  const [count, setCount] = useState(1);

  const { data: codes = [], refetch } = useQuery({
    queryKey: ["authCode", "list", user?.userId, tab],
    queryFn: () => listAuthCodes(tab),
    enabled: !!user,
  });

  const exchangeMut = useMutation({
    mutationFn: (vars: { userId: number; payAsset: string; count: number }) => exchangeAuthCode(vars.count),
    onSuccess: (d) => {
      toast({ title: "兑换成功", description: `获得${d.totalCodes}个认证码${d.bonusCount ? `(含${d.bonusCount}个赠送)` : ""}` });
      setExchangeOpen(false); refetch();
    },
  });

  const transferMut = useMutation({
    mutationFn: (vars: { userId: number; codeIds: number[]; toUserId: string }) => transferAuthCodes(vars.codeIds, vars.toUserId),
    onSuccess: () => {
      toast({ title: "转让成功" }); setTransferOpen(false);
      setSelectedIds([]); setTargetId(""); refetch();
    },
  });

  const mask = (code: string, show: boolean) => show ? code : code.slice(0, 3) + "******" + code.slice(9);
  const cost = AUTH_CODE_CONFIG.costs[payAsset] * count;
  const bonus = count >= AUTH_CODE_CONFIG.bulkThreshold ? Math.floor(count * AUTH_CODE_CONFIG.bulkBonus) : 0;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1">
          <img src={backArrowIcon} alt="" width={20} height={20} />
        </button>
        <h1 className="text-base font-semibold flex-1">{TEXT.authCode.title}</h1>
        <button onClick={() => setExchangeOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: THEME.primary }}>兑换</button>
      </div>

      <div className="mx-4 mt-3"><p className="text-xs p-3 rounded-xl" style={{ background: THEME.primaryLighter, color: THEME.primary }}>{TEXT.authCode.desc}</p></div>

      <div className="flex mx-4 mt-3 bg-white rounded-xl p-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${tab === t ? "text-white" : "text-slate-500"}`}
            style={tab === t ? { background: THEME.primary } : {}}>{tabLabels[t]}</button>
        ))}
      </div>

      <div className="mx-4 mt-3 space-y-2 pb-6">
        {codes.map((c) => (
          <Card key={c.id} className="p-4 rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm tracking-wider" style={{ color: THEME.text }}>{mask(c.code, !!showMap[c.id])}</span>
                  <button onClick={() => setShowMap((p) => ({ ...p, [c.id]: !p[c.id] }))}>
                    {showMap[c.id] ? <EyeOff size={14} className="text-slate-400" /> : <Eye size={14} className="text-slate-400" />}
                  </button>
                </div>
                {c.usedByRealName && <p className="text-xs text-slate-400 mt-1">使用者: {c.usedByRealName}</p>}
                {c.transferredTo && <p className="text-xs text-slate-400 mt-1">转给: {c.transferredTo}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: "已复制" }); }} className="p-2 rounded-lg hover:bg-slate-50"><Copy size={16} className="text-slate-400" /></button>
                {tab === "UNUSED" && <button onClick={() => { setSelectedIds([c.id]); setTransferOpen(true); }} className="p-2 rounded-lg hover:bg-slate-50"><Share2 size={16} style={{ color: THEME.primary }} /></button>}
              </div>
            </div>
          </Card>
        ))}
        {codes.length === 0 && <div className="text-center py-12 text-sm" style={{ color: THEME.textMuted }}>{TEXT.authCode.noCodes}</div>}
      </div>

      {/* 兑换弹窗 */}
      <Dialog open={exchangeOpen} onOpenChange={setExchangeOpen}>
        <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
          <DialogHeader><DialogTitle>兑换认证码</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm text-slate-500">支付方式</label>
              <div className="flex gap-2 mt-1">
                {(["CV", "UV", "BV"] as const).map((a) => (
                  <button key={a} onClick={() => setPayAsset(a)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${payAsset === a ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-600"}`}>
                    {a} {AUTH_CODE_CONFIG.costs[a]}/个
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500">兑换数量</label>
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => setCount(Math.max(1, count - 1))} className="w-10 h-10 rounded-xl bg-slate-100 text-lg font-medium">-</button>
                <span className="flex-1 text-center text-lg font-semibold">{count}</span>
                <button onClick={() => setCount(count + 1)} className="w-10 h-10 rounded-xl bg-slate-100 text-lg font-medium">+</button>
              </div>
              {bonus > 0 && <p className="text-xs text-green-600 mt-1">满10赠3，将获得{count + bonus}个</p>}
            </div>
            <Button className="w-full h-11 rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${THEME.primary}, #7C3AED)` }}
              onClick={() => user && exchangeMut.mutate({ userId: user.userId, payAsset, count })}
              disabled={exchangeMut.isPending}>
              {exchangeMut.isPending ? "兑换中..." : `支付 ${cost} ${payAsset} 兑换`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 转让弹窗 */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
          <DialogHeader><DialogTitle>转让认证码</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-500">已选择 {selectedIds.length} 个认证码</p>
            <input type="text" placeholder="请输入对方 ID 账号" value={targetId} onChange={(e) => setTargetId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <Button className="w-full h-11 rounded-xl text-white" style={{ background: THEME.primary }}
              onClick={() => user && transferMut.mutate({ userId: user.userId, codeIds: selectedIds, toUserId: targetId })}
              disabled={transferMut.isPending}>
              {transferMut.isPending ? TEXT.authCode.transferring : TEXT.authCode.transferConfirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
