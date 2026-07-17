import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { proxyDonate } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { THEME } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

export default function ProxyDonatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [targetId, setTargetId] = useState("");
  const [targetName, setTargetName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const proxyMut = useMutation({
    mutationFn: (vars: { fromUserId: number; toUserId: string; toUserName: string; targetLevel: number }) =>
      proxyDonate(vars.toUserId, vars.toUserName, vars.targetLevel),
    onSuccess: () => { toast({ title: "代打赏成功" }); navigate("/donor"); },
  });

  const checkId = () => {
    if (targetId.length === 11) { setTargetName("张**"); setShowForm(true); }
  };

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/donor")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">代他人打赏</h1>
      </div>
      <div className="px-4 mt-4">
        <Card className="p-4 rounded-2xl border-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: THEME.textMuted }} />
            <input type="text" placeholder="输入对方11位 ID 账号" value={targetId} onChange={(e) => setTargetId(e.target.value)} maxLength={11}
              className="flex-1 text-sm focus:outline-none" />
            <Button size="sm" className="rounded-lg text-white" style={{ background: THEME.primary }} onClick={checkId}>校验</Button>
          </div>
        </Card>
        {showForm && targetName && (
          <div className="mt-4">
            <Card className="p-4 rounded-2xl border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: THEME.primaryLighter }}>
                  <Users size={18} style={{ color: THEME.primary }} />
                </div>
                <div><p className="text-sm font-medium" style={{ color: THEME.text }}>校验成功</p><p className="text-xs" style={{ color: THEME.textMuted }}>姓名: {targetName}</p></div>
              </div>
            </Card>
            <Button className="w-full mt-4 h-12 rounded-2xl text-base font-medium text-white" style={{ background: `linear-gradient(135deg, ${THEME.primary}, #7C3AED)` }}
              onClick={() => user && proxyMut.mutate({ fromUserId: user.userId, toUserId: targetId, toUserName: targetName, targetLevel: 2 })}
              disabled={proxyMut.isPending}>{proxyMut.isPending ? "..." : "确认代打赏"}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
