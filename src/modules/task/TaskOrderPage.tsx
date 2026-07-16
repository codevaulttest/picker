/**
 * 任务订单页 - 模仿"到位APP"订单
 * 顶部Tab(全部/待服务/服务中/已完成) + 订单卡片列表
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, MapPin, Phone, MessageCircle, Star, X, ChevronLeft } from "lucide-react";
import { useStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TABS = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待服务" },
  { key: "ongoing", label: "服务中" },
  { key: "done", label: "已完成" },
];

const ORDERS = [
  { id: "T20250622001", service: "日常保洁2小时", status: "pending", statusLabel: "待服务", date: "2025-06-22 14:00", price: "88", address: "北京市朝阳区XX小区", tech: "王阿姨", techPhone: "138****1234" },
  { id: "T20250621002", service: "全身推拿60分钟", status: "ongoing", statusLabel: "服务中", date: "2025-06-22 10:00", price: "128", address: "北京市朝阳区YY大厦", tech: "李师傅", techPhone: "139****5678" },
  { id: "T20250620003", service: "空调清洗", status: "done", statusLabel: "已完成", date: "2025-06-20 16:00", price: "68", address: "北京市朝阳区ZZ小区", tech: "张师傅", techPhone: "137****9012" },
  { id: "T20250619004", service: "宠物洗澡", status: "done", statusLabel: "已完成", date: "2025-06-19 09:00", price: "50", address: "北京市朝阳区WW小区", tech: "小刘", techPhone: "136****3456" },
  { id: "T20250618005", service: "搬家服务", status: "done", statusLabel: "已完成", date: "2025-06-18 08:00", price: "200", address: "北京市海淀区XX小区", tech: "赵师傅", techPhone: "135****7890" },
];

export default function TaskOrderPage() {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);
  const [activeTab, setActiveTab] = useState("all");
  const [detailOrder, setDetailOrder] = useState<typeof ORDERS[0] | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);

  const bgMain = isDark ? "bg-slate-900" : "bg-gray-50";
  const bgCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100";
  const textMain = isDark ? "text-slate-200" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const textMuted = isDark ? "text-slate-500" : "text-gray-400";

  const filtered = activeTab === "all" ? ORDERS : ORDERS.filter(o => o.status === activeTab);

  const statusColor = (s: string) => {
    if (s === "pending") return "text-orange-500 bg-orange-50";
    if (s === "ongoing") return "text-blue-500 bg-blue-50";
    return "text-green-500 bg-green-50";
  };
  const statusDarkColor = (s: string) => {
    if (s === "pending") return "text-orange-400 bg-orange-900/30";
    if (s === "ongoing") return "text-blue-400 bg-blue-900/30";
    return "text-green-400 bg-green-900/30";
  };

  return (
    <div className={`min-h-full ${bgMain}`}>
      {/* 顶部：Tab + 小程序返回按钮 */}
      <div className={`sticky top-0 z-40 h-11 flex items-center ${isDark ? "bg-slate-900/95 border-slate-700" : "bg-gray-50/95 border-gray-200"} border-b`} style={{ backdropFilter: "blur(10px)" }}>
        <div className="flex-1 flex items-center justify-around h-full">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 h-full text-sm font-bold transition-all relative ${
              activeTab === tab.key
                ? (isDark ? "text-orange-400" : "text-orange-500")
                : textMuted
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-orange-500" />
            )}
          </button>
        ))}
        </div>
        {/* 小程序返回按钮 */}
        <div className={`flex items-center h-7 mr-3 rounded-full overflow-hidden border ${isDark ? "border-slate-600 bg-slate-800/80" : "border-gray-300 bg-white/80"}`}>
          <button onClick={() => navigate(-1)} className={`flex items-center justify-center w-8 h-full ${isDark ? "border-r border-slate-600" : "border-r border-gray-300"}`}>
            <ChevronLeft size={14} className={textSecondary} />
          </button>
          <button onClick={() => navigate("/")} className="flex items-center justify-center w-8 h-full">
            <X size={12} className={textSecondary} />
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="p-3 space-y-3">
        {filtered.map((order) => (
          <button
            key={order.id}
            onClick={() => setDetailOrder(order)}
            className={`w-full rounded-xl border ${bgCard} overflow-hidden active:scale-[0.98] transition-transform text-left`}
          >
            {/* 订单头部 */}
            <div className={`flex items-center justify-between px-3 py-2 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <span className={`text-xs ${textMuted}`}>订单号：{order.id}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? statusDarkColor(order.status) : statusColor(order.status)}`}>
                {order.statusLabel}
              </span>
            </div>
            {/* 订单内容 */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-bold ${textMain}`}>{order.service}</p>
                <p className="text-sm font-black text-orange-500">{order.price}BV</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${textMuted}`}>
                <Clock size={12} />
                <span>{order.date}</span>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${textMuted}`}>
                <MapPin size={12} />
                <span className="truncate">{order.address}</span>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${textSecondary}`}>
                <span>技师：{order.tech}</span>
              </div>
            </div>
            {/* 操作按钮 */}
            <div className={`flex justify-end gap-2 px-3 pb-3 ${order.status === "done" ? "" : "hidden"}`}>
              <Button variant="outline" size="sm" className="h-7 px-3 rounded-full text-xs" onClick={(e) => { e.stopPropagation(); setDetailOrder(order); setShowComment(true); }}>
                评价
              </Button>
            </div>
            <div className={`flex justify-end gap-2 px-3 pb-3 ${order.status === "pending" ? "" : "hidden"}`}>
              <Button variant="outline" size="sm" className={`h-7 px-3 rounded-full text-xs ${isDark ? "border-slate-600" : ""}`}>
                取消
              </Button>
              <Button size="sm" className="h-7 px-3 rounded-full text-xs text-white" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>
                联系技师
              </Button>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className={`text-center py-12 ${textMuted}`}>
            <p className="text-sm">暂无{activeTab === "pending" ? "待服务" : activeTab === "ongoing" ? "服务中" : "已完成"}订单</p>
          </div>
        )}
      </div>

      {/* 订单详情弹窗 */}
      <Dialog open={!!detailOrder && !showComment} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          {detailOrder && (
            <>
              <DialogHeader><DialogTitle className={textMain}>订单详情</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-gray-50"}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>服务</span>
                    <span className={`text-sm font-bold ${textMain}`}>{detailOrder.service}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>状态</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? statusDarkColor(detailOrder.status) : statusColor(detailOrder.status)}`}>
                      {detailOrder.statusLabel}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>预约时间</span>
                    <span className={`text-xs ${textMain}`}>{detailOrder.date}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>地址</span>
                    <span className={`text-xs ${textMain} text-right max-w-[60%]`}>{detailOrder.address}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>技师</span>
                    <span className={`text-xs ${textMain}`}>{detailOrder.tech}</span>
                  </div>
                  <div className="border-t border-dashed my-2" style={{ borderColor: isDark ? "#475569" : "#E5E7EB" }} />
                  <div className="flex justify-between">
                    <span className={`text-sm font-bold ${textMain}`}>实付金额</span>
                    <span className="text-lg font-black text-orange-500">{detailOrder.price} BV</span>
                  </div>
                </div>

                {detailOrder.status === "ongoing" && (
                  <div className="flex gap-3">
                    <Button className="flex-1 h-10 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>
                      <Phone size={14} className="mr-1" /> 联系技师
                    </Button>
                    <Button variant="outline" className={`flex-1 h-10 rounded-xl font-bold ${isDark ? "border-slate-600" : ""}`}>
                      <MessageCircle size={14} className="mr-1" /> 发消息
                    </Button>
                  </div>
                )}

                {detailOrder.status === "done" && (
                  <Button className="w-full h-10 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => setShowComment(true)}>
                    <Star size={14} className="mr-1" /> 评价服务
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 评价弹窗 */}
      <Dialog open={showComment} onOpenChange={(o) => { setShowComment(o); if (!o) setDetailOrder(null); }}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>评价服务</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="text-center">
              <p className={`text-sm mb-2 ${textSecondary}`}>为{detailOrder?.tech || "技师"}打分</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star size={28} className={s <= rating ? "text-amber-400 fill-amber-400" : isDark ? "text-slate-600" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="说说你的服务体验..."
              className={`w-full h-24 p-3 rounded-xl border text-sm outline-none resize-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" : "bg-gray-50 border-gray-200"}`}
            />
            <Button className="w-full h-11 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => { setShowComment(false); setDetailOrder(null); setCommentText(""); }}>
              提交评价
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
