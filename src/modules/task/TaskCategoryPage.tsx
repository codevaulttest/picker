/**
 * 任务分类页 - 模仿"到位APP"分类
 * 左侧分类导航 + 右侧服务列表
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, ChevronRight, X, ChevronLeft } from "lucide-react";
import { useStore } from "@/stores";
import { TASK_CATEGORIES } from "@/config/app.config";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CATEGORY_SERVICES: Record<string, { name: string; price: string; sales: string; rating: string }[]> = {
  clean: [
    { name: "日常保洁2小时", price: "88", sales: "2341", rating: "4.9" },
    { name: "深度保洁3小时", price: "168", sales: "1892", rating: "4.8" },
    { name: "开荒保洁", price: "300", sales: "876", rating: "4.9" },
    { name: "擦玻璃服务", price: "50", sales: "3421", rating: "4.7" },
    { name: "厨房深度清洁", price: "120", sales: "1567", rating: "4.8" },
  ],
  massage: [
    { name: "全身推拿60分钟", price: "128", sales: "5678", rating: "4.9" },
    { name: "精油 SPA90分钟", price: "298", sales: "2345", rating: "4.9" },
    { name: "足疗按摩60分钟", price: "88", sales: "8901", rating: "4.8" },
    { name: "肩颈按摩30分钟", price: "68", sales: "4567", rating: "4.7" },
    { name: "泰式按摩120分钟", price: "398", sales: "1234", rating: "4.9" },
  ],
  repair: [
    { name: "空调维修加氟", price: "150", sales: "3456", rating: "4.8" },
    { name: "冰箱维修", price: "120", sales: "2345", rating: "4.7" },
    { name: "洗衣机维修", price: "100", sales: "4567", rating: "4.8" },
    { name: "水管维修", price: "80", sales: "6789", rating: "4.6" },
    { name: "电路维修", price: "100", sales: "5432", rating: "4.7" },
  ],
  move: [
    { name: "小型搬家", price: "200", sales: "1234", rating: "4.8" },
    { name: "长途搬家", price: "500", sales: "567", rating: "4.9" },
    { name: "公司搬迁", price: "1000", sales: "234", rating: "4.7" },
    { name: "家具拆装", price: "150", sales: "3456", rating: "4.6" },
    { name: " piano 搬运", price: "300", sales: "890", rating: "4.8" },
  ],
  ac: [
    { name: "挂机清洗", price: "68", sales: "9876", rating: "4.9" },
    { name: "柜机清洗", price: "98", sales: "5432", rating: "4.8" },
    { name: "中央空调清洗", price: "200", sales: "1234", rating: "4.9" },
    { name: "空调加氟", price: "120", sales: "6789", rating: "4.7" },
    { name: "空调安装", price: "150", sales: "4567", rating: "4.8" },
  ],
  nanny: [
    { name: "月嫂26天", price: "12800", sales: "567", rating: "4.9" },
    { name: "育儿嫂", price: "8000", sales: "890", rating: "4.8" },
    { name: "住家保姆", price: "6000", sales: "1234", rating: "4.7" },
    { name: "钟点工", price: "50", sales: "9876", rating: "4.8" },
    { name: "老人陪护", price: "5000", sales: "678", rating: "4.9" },
  ],
  laundry: [
    { name: "干洗西装", price: "50", sales: "4567", rating: "4.8" },
    { name: "洗鞋服务", price: "30", sales: "7890", rating: "4.7" },
    { name: "奢侈品护理", price: "200", sales: "1234", rating: "4.9" },
    { name: "窗帘清洗", price: "80", sales: "3456", rating: "4.6" },
    { name: "地毯清洗", price: "150", sales: "2345", rating: "4.7" },
  ],
  pet: [
    { name: "宠物洗澡", price: "50", sales: "6789", rating: "4.8" },
    { name: "宠物美容", price: "120", sales: "3456", rating: "4.9" },
    { name: "宠物寄养", price: "80", sales: "2345", rating: "4.7" },
    { name: "上门喂宠", price: "40", sales: "5678", rating: "4.8" },
    { name: "宠物训练", price: "200", sales: "1234", rating: "4.6" },
  ],
  delivery: [
    { name: "同城急送", price: "20", sales: "12345", rating: "4.8" },
    { name: "代买代办", price: "30", sales: "8765", rating: "4.7" },
    { name: "文件速递", price: "15", sales: "15678", rating: "4.9" },
    { name: "排队代办", price: "50", sales: "4567", rating: "4.6" },
    { name: "夜间配送", price: "40", sales: "3456", rating: "4.7" },
  ],
  car: [
    { name: "上门洗车", price: "50", sales: "9876", rating: "4.8" },
    { name: "汽车保养", price: "300", sales: "2345", rating: "4.9" },
    { name: "代驾服务", price: "80", sales: "5678", rating: "4.7" },
    { name: "年检代办", price: "200", sales: "3456", rating: "4.8" },
    { name: "救援搭电", price: "100", sales: "7890", rating: "4.6" },
  ],
};

export default function TaskCategoryPage() {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);
  const [activeCategory, setActiveCategory] = useState("clean");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const bgMain = isDark ? "bg-slate-900" : "bg-gray-50";
  const bgLeft = isDark ? "bg-slate-800" : "bg-gray-100";
  const bgCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100";
  const textMain = isDark ? "text-slate-200" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const textMuted = isDark ? "text-slate-500" : "text-gray-400";

  const services = CATEGORY_SERVICES[activeCategory] || [];
  const catIcon = TASK_CATEGORIES.find(c => c.key === activeCategory)?.icon || "";

  return (
    <div className={`flex flex-col h-full ${bgMain}`}>
      {/* 顶部：小程序返回按钮 */}
      <div className={`flex items-center justify-end px-4 py-2 ${isDark ? "bg-slate-900/95 border-slate-700" : "bg-gray-50/95 border-gray-200"} border-b`} style={{ backdropFilter: "blur(10px)" }}>
        <div className={`flex items-center h-7 rounded-full overflow-hidden border ${isDark ? "border-slate-600 bg-slate-800/80" : "border-gray-300 bg-white/80"}`}>
          <button onClick={() => navigate(-1)} className={`flex items-center justify-center w-10 h-full ${isDark ? "border-r border-slate-600" : "border-r border-gray-300"}`}>
            <ChevronLeft size={16} className={textSecondary} />
          </button>
          <button onClick={() => navigate("/")} className="flex items-center justify-center w-10 h-full">
            <X size={14} className={textSecondary} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧分类导航 */}
      <div className={`w-20 flex-shrink-0 overflow-y-auto scrollbar-hide ${bgLeft}`}>
        {TASK_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`w-full flex flex-col items-center gap-1 py-3 px-1 transition-all ${
              activeCategory === cat.key
                ? (isDark ? "bg-slate-700 text-orange-400 border-l-2 border-orange-400" : "bg-white text-orange-500 border-l-2 border-orange-500")
                : (isDark ? "text-slate-400" : "text-gray-500")
            }`}
          >
            <div className={`w-8 h-8 rounded-lg overflow-hidden ${activeCategory === cat.key ? "ring-2 ring-orange-500" : ""}`}>
              <img src={cat.icon} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 右侧服务列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        {/* 当前分类标题 */}
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
          <div className="w-6 h-6 rounded overflow-hidden">
            <img src={catIcon} alt="" className="w-full h-full object-cover" />
          </div>
          <span className={`text-sm font-bold ${textMain}`}>
            {TASK_CATEGORIES.find(c => c.key === activeCategory)?.name}服务
          </span>
        </div>

        {/* 服务列表 */}
        <div className="space-y-2">
          {services.map((svc, i) => (
            <button
              key={i}
              onClick={() => setSelectedService(svc.name)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border ${bgCard} active:scale-[0.98] transition-transform text-left`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img src={catIcon} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${textMain}`}>{svc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className={`text-xs ${textSecondary}`}>{svc.rating}</span>
                  </div>
                  <span className={`text-xs ${textMuted}`}>月销{svc.sales}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-orange-500">{svc.price}BV</p>
                <ChevronRight size={14} className={textMuted} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 服务预约弹窗 */}
      <Dialog open={!!selectedService} onOpenChange={(o) => !o && setSelectedService(null)}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>{selectedService}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="h-28 rounded-xl overflow-hidden">
              <img src={catIcon} alt="" className="w-full h-full object-cover" />
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-gray-50"}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>价格</span>
                <span className="text-lg font-black text-orange-500">
                  {services.find(s => s.name === selectedService)?.price || "100"} BV
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${textSecondary}`}>评分</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">{services.find(s => s.name === selectedService)?.rating || "4.9"}</span>
                </div>
              </div>
            </div>
            <p className={`text-xs ${textMuted}`}>结算时仅收到90%，10%为平台运营及销毁</p>
            <Button className="w-full h-11 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => setSelectedService(null)}>
              立即预约
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
