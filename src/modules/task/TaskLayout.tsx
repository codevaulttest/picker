/**
 * 任务模块布局 - 模仿"到位APP"
 * 独立的底部4导航：首页 / 分类 / 订单 / 我的
 * 此模块可插入任何APP中使用
 */
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router";
import { Home, LayoutGrid, ClipboardList, User } from "lucide-react";
import { useStore } from "@/stores";

import TaskHomePage from "./TaskHomePage";
import TaskCategoryPage from "./TaskCategoryPage";
import TaskOrderPage from "./TaskOrderPage";
import TaskProfilePage from "./TaskProfilePage";

const TASK_TABS = [
  { key: "home", label: "首页", Icon: Home, path: "/task/home" },
  { key: "category", label: "分类", Icon: LayoutGrid, path: "/task/category" },
  { key: "orders", label: "订单", Icon: ClipboardList, path: "/task/orders" },
  { key: "profile", label: "我的", Icon: User, path: "/task/profile" },
];

export default function TaskLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = useStore((s) => s.isDark);
  const [activeTab, setActiveTab] = useState("home");

  // 根据当前路径同步activeTab
  useEffect(() => {
    const tab = TASK_TABS.find((t) => location.pathname.startsWith(t.path));
    if (tab) setActiveTab(tab.key);
  }, [location.pathname]);

  // 如果访问 /task 根路径，重定向到 /task/home
  useEffect(() => {
    if (location.pathname === "/task") {
      navigate("/task/home", { replace: true });
    }
  }, [location.pathname, navigate]);

  const bgClass = isDark ? "bg-slate-900" : "bg-gray-50";

  return (
    <div className={`flex flex-col h-screen relative overflow-hidden ${bgClass}`}>
      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto scrollbar-hide" style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="home" element={<TaskHomePage />} />
          <Route path="category" element={<TaskCategoryPage />} />
          <Route path="orders" element={<TaskOrderPage />} />
          <Route path="profile" element={<TaskProfilePage />} />
        </Routes>
      </main>

      {/* 底部4导航 - 任务模块独立导航 */}
      <nav
        className={`absolute bottom-0 left-0 right-0 h-16 flex items-center justify-around z-50 ${
          isDark ? "bg-slate-800/95 border-slate-700" : "bg-white/95 border-gray-200"
        }`}
        style={{ borderTop: `1px solid ${isDark ? "#334155" : "#E5E7EB"}`, backdropFilter: "blur(12px)" }}
      >
        {TASK_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); navigate(tab.path); }}
              className="flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95"
            >
              <div className={`relative transition-all duration-200 ${isActive ? "scale-110" : "scale-100"}`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? (isDark ? "text-orange-400" : "text-orange-500") : (isDark ? "text-slate-500" : "text-slate-400")}
                />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? (isDark ? "text-orange-400" : "text-orange-500") : (isDark ? "text-slate-500" : "text-slate-400")}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
