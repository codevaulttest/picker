/**
 * 任务我的页 - 模仿"到位APP"个人中心
 * 头像信息 + 功能入口 + 返回主APP
 */
import { useNavigate } from "react-router";
import { Wallet, Ticket, Heart, MapPin, MessageCircle, HelpCircle, Settings, ChevronRight, LogOut, Shield, X, ChevronLeft } from "lucide-react";
import { useStore } from "@/stores";

const MENU_ITEMS = [
  { key: "wallet", label: "我的钱包", icon: Wallet, color: "#F59E0B", desc: "余额、银行卡" },
  { key: "coupon", label: "我的优惠券", icon: Ticket, color: "#EF4444", desc: "3张可用" },
  { key: "fav", label: "我的收藏", icon: Heart, color: "#EC4899", desc: "" },
  { key: "address", label: "地址管理", icon: MapPin, color: "#3B82F6", desc: "" },
  { key: "msg", label: "消息中心", icon: MessageCircle, color: "#8B5CF6", desc: "" },
  { key: "help", label: "帮助与反馈", icon: HelpCircle, color: "#14B8A6", desc: "" },
  { key: "settings", label: "设置", icon: Settings, color: "#64748B", desc: "" },
];

export default function TaskProfilePage() {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);
  const user = useStore((s) => s.user);

  const bgMain = isDark ? "bg-slate-900" : "bg-gray-50";
  const bgCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100";
  const textMain = isDark ? "text-slate-200" : "text-gray-900";
  const textMuted = isDark ? "text-slate-500" : "text-gray-400";

  return (
    <div className={`min-h-full ${bgMain}`}>
      {/* 小程序返回按钮 */}
      <div className={`flex items-center justify-end px-4 py-2 ${isDark ? "bg-slate-900/95" : "bg-gray-50/95"}`}>
        <div className={`flex items-center h-7 rounded-full overflow-hidden border ${isDark ? "border-slate-600 bg-slate-800/80" : "border-gray-300 bg-white/80"}`}>
          <button onClick={() => navigate(-1)} className={`flex items-center justify-center w-10 h-full ${isDark ? "border-r border-slate-600" : "border-r border-gray-300"}`}>
            <ChevronLeft size={16} className={isDark ? "text-slate-400" : "text-gray-500"} />
          </button>
          <button onClick={() => navigate("/")} className="flex items-center justify-center w-10 h-full">
            <X size={14} className={isDark ? "text-slate-400" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* 头部卡片 */}
      <div className="relative mx-4 mt-1 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-3">
            {/* 头像 */}
            <img
              src={user?.avatar || "/icons/avatar-default.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base truncate">{user?.name || "用户"}</p>
              <p className="text-white/70 text-xs mt-0.5">P客账号: {user?.pkeId || "19900****"}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield size={10} className="text-white/70" />
                <span className="text-white/70 text-[10px]">{user?.isRealName ? "已实名" : "未实名"}</span>
              </div>
            </div>
          </div>

          {/* 快捷统计 */}
          <div className="flex items-center justify-around mt-4 pt-3 border-t border-white/20">
            {[
              { label: "余额", value: "1,280 BV" },
              { label: "优惠券", value: "3张" },
              { label: "积分", value: "560" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-white font-bold text-sm">{item.value}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className={`mx-4 mt-3 p-3 rounded-xl border ${bgCard}`}>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "全部订单", value: "12" },
            { label: "待服务", value: "2" },
            { label: "服务中", value: "1" },
            { label: "已完成", value: "9" },
          ].map((item) => (
            <button key={item.label} className="py-2 active:scale-95 transition-transform">
              <p className={`text-base font-black ${textMain}`}>{item.value}</p>
              <p className={`text-[10px] mt-0.5 ${textMuted}`}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 功能菜单 */}
      <div className={`mx-4 mt-3 rounded-xl border overflow-hidden ${bgCard}`}>
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-slate-700 transition-colors ${
                i < MENU_ITEMS.length - 1 ? (isDark ? "border-b border-slate-700" : "border-b border-gray-100") : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + "15" }}>
                <Icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${textMain}`}>{item.label}</p>
                {item.desc && <p className={`text-[10px] ${textMuted}`}>{item.desc}</p>}
              </div>
              <ChevronRight size={16} className={textMuted} />
            </button>
          );
        })}
      </div>

      {/* TDS任务入口 */}
      <div className={`mx-4 mt-3 rounded-xl border overflow-hidden ${bgCard}`}>
        <button
          onClick={() => navigate("/task/home")}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-slate-700 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#22C55E15" }}>
            <MessageCircle size={18} style={{ color: "#22C55E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${textMain}`}>TDS 任务入口</p>
            <p className={`text-[10px] ${textMuted}`}>发起任务或完成任务赚取BV</p>
          </div>
          <ChevronRight size={16} className={textMuted} />
        </button>
      </div>

      {/* 返回主APP */}
      <div className="mx-4 mt-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border ${bgCard} active:scale-[0.98] transition-transform`}
        >
          <LogOut size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-orange-500">返回P客首页</span>
        </button>
      </div>
    </div>
  );
}
