/**
 * P客APP 全局配置文件
 * 所有页面文案、图标、颜色、路由、等级体系等配置集中管理
 * 修改此文件即可快速调整APP内容，无需修改页面代码
 */

import {
  Home, CircleDot, Gift, HandCoins, KeyRound, ArrowUpDown,
  Star, Users, Smartphone,
  Mail, Fingerprint, Lock, CreditCard, UserCheck, Beef, TreePine,
  Wine, Wallet, ShieldCheck, Coins,
  ClipboardList, Hourglass, Link2, Gem, type LucideIcon,
} from "lucide-react";

// Gamification accent palette — see DESIGN.md (Duolingo/Todoist/Strava blend,
// pixel-calibrated against the homepage reference mockup). Kept separate
// from THEME so the two token systems don't collide while the reskin rolls
// out screen by screen.
export const GAME = {
  primary: "#1671F8",
  primaryLight: "#2F80FF",
  /** 品牌蓝字色：与 primary 同值 */
  primaryText: "#1671F8",
  primaryPressed: "#0759D5",
  primarySoft: "#EAF2FF",
  primarySoftest: "#F3F8FF",
  onPrimary: "#FFFFFF",
  rewardGold: "#E8B339",
  rewardGoldSoft: "#FBF1DA",
  infoBlue: "#3A7BD5",
  /** DESIGN.md info-soft */
  infoSoft: "#EAF1FB",
  /** DESIGN.md success — 系统/生态入口（非游戏反馈） */
  success: "#1DA463",
  successSoft: "#E8F6EF",
  /** DESIGN.md error — 破坏性文案 / 告警（非 cool red-500） */
  error: "#DC5B4C",
  errorSoft: "#FCEFED",
  ink: "#171A21",
  inkSecondary: "#707681",
  inkTertiary: "#9AA0AA",
  inkDisabled: "#C4C8D0",
  /** 底部导航未选中态专用 — inkTertiary 在此尺寸下不足 3:1，见 DESIGN.md */
  inkNavInactive: "#555B65",
  bgPage: "#F7F9FC",
  /** 整页：primary-softest → bg-page（DESIGN.md Header / page canvas） */
  pageGradientTop: "#F3F8FF",
  pageGradient: "linear-gradient(180deg, #F3F8FF 0%, #F7F9FC 18%, #F7F9FC 100%)",
  /**
   * Header 叠层（DESIGN.md：softest → bg-page）：
   * 1) primarySoftest → transparent — 头区竖向浅蓝叠层，右上保持浅蓝
   * 2) primary 低透明径向 — 左上头像微光（勿用 primarySoft 铺满，否则偏深）
   */
  headerGlow:
    "linear-gradient(180deg, #F3F8FF 0%, transparent 88%), " +
    "radial-gradient(ellipse 95% 75% at 20% 22%, rgba(22,113,248,0.06) 0%, transparent 68%)",
  bgCard: "#FFFFFF",
  bgMuted: "#F2F4F8",
  borderLight: "#E7EAF0",
  divider: "#E9ECF1",
  chartLine: "#1671F8",
  surfaceSoft: "#F2F4F8",
  /** Soft card — DESIGN.md: 0 10px 35px rgba(22,113,248,0.10) */
  shadowWarmColor: "rgba(22,113,248,0.10)",
  shadowWarm: "0 10px 35px 0 rgba(22,113,248,0.10)",
  /** 底栏上沿柔影：同色族、更短更淡，避免与卡片下影在间隙叠成色带 */
  navShadow: "0 -4px 14px 0 rgba(22,113,248,0.08)",
  /** Dialog / Bottom Sheet scrim — DESIGN.md overlay */
  overlay: "rgba(23,26,33,0.45)",
  /** Field focus halo — DESIGN.md focus-ring */
  focusRing: "rgba(22,113,248,0.35)",

  // ── Dark theme (DESIGN.md cool charcoal — brand-blue hue family) ──
  bgPageDark: "#101217",
  bgCardDark: "#1A1D24",
  bgMutedDark: "#21242A",
  borderLightDark: "#2D313A",
  dividerDark: "#272B32",
  inkDark: "#EAEDF5",
  inkSecondaryDark: "#9EA3B0",
  inkTertiaryDark: "#787D8A",
  inkDisabledDark: "#4F535C",
  primarySoftDark: "#18263A",
  primarySoftestDark: "#121924",
  rewardGoldSoftDark: "#3A3220",
  infoSoftDark: "#1E2A38",
  successSoftDark: "#1A2E24",
  errorSoftDark: "#3A2220",
  shadowWarmDark: "0 10px 35px 0 rgba(6,8,12,0.45)",
  overlayDark: "rgba(6,8,12,0.64)",
  focusRingDark: "rgba(22,113,248,0.45)",
  /** 整页暗色：primary-softest-dark → bg-page-dark（禁止 cool #0F172A） */
  pageGradientDark: "linear-gradient(180deg, #121924 0%, #101217 18%, #101217 100%)",
  headerGlowDark:
    "linear-gradient(180deg, #121924 0%, transparent 88%), " +
    "radial-gradient(ellipse 95% 75% at 20% 22%, rgba(22,113,248,0.08) 0%, transparent 68%)",
} as const;

// ═══════════════════════════════════════════════════════════
// 品牌配置
// ═══════════════════════════════════════════════════════════
export const BRAND = {
  name: "P客",
  slogan: "P客APP - 数字资产管理平台",
  logo: "/icons/logo.png",
  /** 默认头像（设计稿切图） */
  defaultAvatar: (_seed?: string) => "/icons/user-avatar.png",
} as const;

// ═══════════════════════════════════════════════════════════
// 主题色彩配置
// ═══════════════════════════════════════════════════════════
export const THEME = {
  primary: "#3B82F6",
  primaryLight: "#60A5FA",
  primaryLighter: "#EFF6FF",
  orange: "#F97316",
  orangeLight: "#FFF7ED",
  success: "#22C55E",
  warning: "#EAB308",
  danger: "#EF4444",
  purple: "#8B5CF6",
  purpleLight: "#F5F3FF",
  emerald: "#14B8A6",
  amber: "#F59E0B",
  rose: "#E11D48",
  teal: "#14B8A6",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
} as const;

// ═══════════════════════════════════════════════════════════
// 等级体系配置
// ═══════════════════════════════════════════════════════════
export interface LevelConfig {
  level: number;
  originalName: string;
  cnName: string;
  enName: string;
  color: string;
  /** 打赏所需BV */
  donateBv: number;
  /** 升级码兑换所需BV */
  upgradeCost: number;
  /** 等级头像图标路径 */
  avatar: string;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, originalName: "长工", cnName: "长工", enName: "Initiate", color: "#94A3B8", donateBv: 0, upgradeCost: 0, avatar: "/icons/levels/lv1.png" },
  { level: 2, originalName: "贫农", cnName: "执行者", enName: "Executor", color: "#22C55E", donateBv: 22.5, upgradeCost: 500, avatar: "/icons/levels/lv2.png" },
  { level: 3, originalName: "富农", cnName: "先锋", enName: "Vanguard", color: "#3B82F6", donateBv: 225, upgradeCost: 2500, avatar: "/icons/levels/lv3.png" },
  { level: 4, originalName: "队长", cnName: "队长", enName: "Captain", color: "#6366F1", donateBv: 2250, upgradeCost: 10000, avatar: "/icons/levels/lv4.png" },
  { level: 5, originalName: "村长", cnName: "管事", enName: "Steward", color: "#8B5CF6", donateBv: 22500, upgradeCost: 45000, avatar: "/icons/levels/lv5.png" },
  { level: 6, originalName: "乡长", cnName: "统领", enName: "Marshal", color: "#A855F7", donateBv: 45000, upgradeCost: 65000, avatar: "/icons/levels/lv6.png" },
  { level: 7, originalName: "镇长", cnName: "指挥官", enName: "Commander", color: "#D946EF", donateBv: 90000, upgradeCost: 115000, avatar: "/icons/levels/lv7.png" },
  { level: 8, originalName: "县令", cnName: "执政官", enName: "Governor", color: "#EC4899", donateBv: 180000, upgradeCost: 215000, avatar: "/icons/levels/lv8.png" },
  { level: 9, originalName: "知府", cnName: "大执政官", enName: "High Governor", color: "#F43F5E", donateBv: 360000, upgradeCost: 415000, avatar: "/icons/levels/lv9.png" },
  { level: 10, originalName: "巡抚", cnName: "巡域官", enName: "Regional Governor", color: "#E11D48", donateBv: 720000, upgradeCost: 815000, avatar: "/icons/levels/lv10.png" },
  { level: 11, originalName: "太守", cnName: "领主", enName: "Overseer", color: "#F97316", donateBv: 0, upgradeCost: 1615000, avatar: "/icons/levels/lv11.png" },
  { level: 12, originalName: "丞相", cnName: "丞相", enName: "Chancellor", color: "#F59E0B", donateBv: 0, upgradeCost: 3215000, avatar: "/icons/levels/lv12.png" },
];

/** 根据等级获取配置 */
export const getLevel = (level: number): LevelConfig =>
  LEVELS.find((l) => l.level === level) || LEVELS[0];

/** 可打赏等级 (LV2 ~ LV10) */
export const DONATE_LEVELS = LEVELS.filter((l) => l.level >= 2 && l.level <= 10);

// ═══════════════════════════════════════════════════════════
// 东家星级配置
// ═══════════════════════════════════════════════════════════
export interface StarConfig {
  star: number;
  min: number;
  max: number;
  label: string;
}

export const STAR_LEVELS: StarConfig[] = [
  { star: 0, min: 0, max: 11250, label: "新星" },
  { star: 1, min: 11250, max: 60000, label: "铜星" },
  { star: 2, min: 60000, max: 300000, label: "银星" },
  { star: 3, min: 300000, max: 1500000, label: "金星" },
  { star: 4, min: 1500000, max: 3000000, label: "铂金" },
  { star: 5, min: 3000000, max: 6000000, label: "钻石" },
  { star: 6, min: 6000000, max: 10000000, label: "至尊" },
];

// ═══════════════════════════════════════════════════════════
// Tab 导航配置
// ═══════════════════════════════════════════════════════════
export interface TabConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
  /** 中间大按钮? */
  isCenter?: boolean;
}

export const TABS: TabConfig[] = [
  { key: "home", label: "P客", icon: Home, path: "/" },
  { key: "task", label: "任务", icon: CircleDot, path: "/task", isCenter: true },
  { key: "donor", label: "东家", icon: HandCoins, path: "/donor" },
];

// ═══════════════════════════════════════════════════════════
// 首页功能按钮配置（大图模式）
// ═══════════════════════════════════════════════════════════
export interface FeatureButtonConfig {
  key: string;
  label: string;
  subtitle: string;
  /** 3D soft 图标（已含自身配色与卡片底），直接渲染，不再叠加色块底 */
  image: string;
  path: string;
}

export const HOME_FEATURES: FeatureButtonConfig[] = [
  { key: "home-authcode", label: "认证码", subtitle: "认证得BV", image: "/icons/home-authcode.webp", path: "/auth-code" },
  { key: "home-upgrade", label: "升级码", subtitle: "兑换升级经验", image: "/icons/home-upgrade.webp", path: "/upgrade-code" },
  { key: "home-exchange", label: "BV互换", subtitle: "BV兑换好礼", image: "/icons/home-exchange.webp", path: "/code-market" },
  { key: "home-mini-program", label: "小程序", subtitle: "发现更多服务", image: "/icons/home-mini-program.webp", path: "/mini-program" },
  { key: "home-early", label: "早起打卡", subtitle: "每日打卡得分", image: "/icons/home-early.webp", path: "/clock-in/early" },
  { key: "home-step", label: "计步打卡", subtitle: "走路赚BV", image: "/icons/home-step.webp", path: "/clock-in/step" },
];

// ═══════════════════════════════════════════════════════════
// 东家功能宫格（与首页 Function Grid 同一套 token）
// ═══════════════════════════════════════════════════════════
export interface DonorActionConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  path: string;
  /** 点击后先出风险弹窗，再进打赏流 */
  needsRiskConfirm?: boolean;
}

export const DONOR_ACTIONS: DonorActionConfig[] = [
  { key: "donate", label: "我要打赏", icon: HandCoins, color: GAME.primary, bg: GAME.primarySoft, path: "/donor/donate-flow", needsRiskConfirm: true },
  { key: "proxy", label: "代他人打赏", icon: Users, color: GAME.infoBlue, bg: GAME.infoSoft, path: "/donor/proxy" },
  { key: "records", label: "打赏记录", icon: ClipboardList, color: GAME.success, bg: GAME.successSoft, path: "/donor/records" },
  { key: "pending", label: "待支付订单", icon: Hourglass, color: GAME.rewardGold, bg: GAME.rewardGoldSoft, path: "/donor/pending" },
  { key: "chain", label: "BV上链", icon: Link2, color: GAME.infoBlue, bg: GAME.infoSoft, path: "/donor/chain" },
];

// ═══════════════════════════════════════════════════════════
// 首页快捷入口卡片配置
// ═══════════════════════════════════════════════════════════
export interface QuickEntryConfig {
  key: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  path: string;
}

export const HOME_QUICK_ENTRIES: QuickEntryConfig[] = [
  {
    key: "auth-code",
    title: "认证码",
    subtitle: "兑换、转让、查看认证码",
    icon: KeyRound,
    iconColor: THEME.primary,
    iconBg: THEME.primaryLighter,
    path: "/auth-code",
  },
  {
    key: "upgrade-code",
    title: "升级码",
    subtitle: "兑换等级升级码",
    icon: ArrowUpDown,
    iconColor: THEME.orange,
    iconBg: THEME.orangeLight,
    path: "/upgrade-code",
  },
  {
    key: "donor",
    title: "东家打赏",
    subtitle: "我要打赏、打赏记录",
    icon: HandCoins,
    iconColor: THEME.purple,
    iconBg: THEME.purpleLight,
    path: "/donor",
  },
];

// ═══════════════════════════════════════════════════════════
// 资产配置（DESIGN.md list-row Soft cards — 仅用注册色 token）
// ═══════════════════════════════════════════════════════════
export type AssetGroupKey = "core" | "gem" | "donor" | "other";

export interface AssetConfig {
  key: string;
  label: string;
  /** 图标色 — GAME 注册 token */
  color: string;
  /** 图标底 — 对应 soft wash */
  soft: string;
  icon: LucideIcon;
  group: AssetGroupKey;
}

export const ASSET_GROUPS: { key: AssetGroupKey; title: string }[] = [
  { key: "core", title: "核心资产" },
  { key: "gem", title: "宝石" },
  { key: "donor", title: "东家资产" },
  { key: "other", title: "其他" },
];

export const ASSETS: AssetConfig[] = [
  { key: "uv", label: "UV", color: GAME.infoBlue, soft: GAME.infoSoft, icon: CircleDot, group: "core" },
  { key: "cv", label: "CV", color: GAME.primary, soft: GAME.primarySoft, icon: CircleDot, group: "core" },
  { key: "pb", label: "P币", color: GAME.rewardGold, soft: GAME.rewardGoldSoft, icon: Coins, group: "core" },
  { key: "bv", label: "BV", color: GAME.infoBlue, soft: GAME.infoSoft, icon: Star, group: "core" },
  { key: "dos", label: "DOS", color: GAME.success, soft: GAME.successSoft, icon: Wallet, group: "core" },
  { key: "greenGem", label: "绿宝石", color: GAME.success, soft: GAME.successSoft, icon: Gem, group: "gem" },
  { key: "yellowGem", label: "黄宝石", color: GAME.rewardGold, soft: GAME.rewardGoldSoft, icon: Gem, group: "gem" },
  { key: "redGem", label: "红宝石", color: GAME.error, soft: GAME.errorSoft, icon: Gem, group: "gem" },
  { key: "pkeBv", label: "东家BV", color: GAME.primary, soft: GAME.primarySoft, icon: Star, group: "donor" },
  { key: "pkePoint", label: "东家积分", color: GAME.rewardGold, soft: GAME.rewardGoldSoft, icon: Coins, group: "donor" },
  { key: "asiaPkeBv", label: "亚太版东家BV", color: GAME.infoBlue, soft: GAME.infoSoft, icon: Star, group: "donor" },
  { key: "asiaPkePoint", label: "亚太版东家积分", color: GAME.rewardGold, soft: GAME.rewardGoldSoft, icon: Coins, group: "donor" },
  { key: "globalBv", label: "国际版BV", color: GAME.infoBlue, soft: GAME.infoSoft, icon: Star, group: "donor" },
  { key: "globalPkePoint", label: "国际版东家积分", color: GAME.rewardGold, soft: GAME.rewardGoldSoft, icon: Coins, group: "donor" },
  { key: "shotPoint", label: "拍点", color: GAME.primary, soft: GAME.primarySoft, icon: CircleDot, group: "other" },
];

// ═══════════════════════════════════════════════════════════
// 认证码配置
// ═══════════════════════════════════════════════════════════
export const AUTH_CODE_CONFIG = {
  length: 12,
  costs: { CV: 500, UV: 500, BV: 1000 } as const,
  pkeBvCost: 1000,
  bulkThreshold: 10,
  bulkBonus: 0.3,
} as const;

// ═══════════════════════════════════════════════════════════
// 打赏配置
// ═══════════════════════════════════════════════════════════
export const DONATE_CONFIG = {
  /** DOS:BV 汇率 */
  dosBvRate: 7.5,
  /** 月累计超过此值收手续费 */
  monthlyThreshold: 10000,
  /** 手续费率 */
  feeRate: 0.001,
  /** 东家积分抵扣比例 */
  pointDeduction: 0.5,
  /** 东家积分佣金比例 */
  commissionRate: 0.1,
} as const;

// ═══════════════════════════════════════════════════════════
// 打卡配置
// ═══════════════════════════════════════════════════════════
export const CLOCK_IN_CONFIG = {
  earlyRise: {
    label: "早起打卡",
    slogan: "一日之计在于晨",
    timeSlot: { start: "06:00", end: "09:00", timezone: "北京时间" },
    baseReward: 1,
    maxReward: 5,
    increment: 1,
    penalty: 5,
    penaltyAsset: "P币",
  },
  stepCount: {
    label: "计步打卡",
    slogan: "行走的力量",
    minSteps: 5000,
    reward: 5,
  },
} as const;

// ═══════════════════════════════════════════════════════════
// 小程序配置
// ═══════════════════════════════════════════════════════════
export interface MiniProgramConfig {
  key: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  comingSoon?: boolean;
}

export const MINI_PROGRAMS: MiniProgramConfig[] = [
  { key: "cow", name: "东家养牛", desc: "养牛场互动", icon: Beef, iconColor: "#8B5CF6", iconBg: "#F5F3FF" },
  { key: "rosewood", name: "海黄黄花梨", desc: "黄花梨树场", icon: TreePine, iconColor: "#22C55E", iconBg: "#F0FDF4" },
  { key: "gift", name: "助农锦盒", desc: "助农产品", icon: Gift, iconColor: "#F97316", iconBg: "#FFF7ED" },
  { key: "wine", name: "豪酒", desc: "精品美酒", icon: Wine, iconColor: "#E11D48", iconBg: "#FFF1F2" },
  { key: "committee", name: "数盟委员", desc: "委员续费", icon: Users, iconColor: "#3B82F6", iconBg: "#EFF6FF" },
  { key: "sim", name: "通讯卡", desc: "手机通讯卡", icon: Smartphone, iconColor: "#14B8A6", iconBg: "#F0FDFA" },
  { key: "family", name: "一家亲", desc: "绑定亲属关系", icon: Users, iconColor: "#EC4899", iconBg: "#FDF2F8" },
];

// ═══════════════════════════════════════════════════════════
// 安全中心菜单配置
// ═══════════════════════════════════════════════════════════
export type SecurityStatusTone = "success" | "muted" | "action";

export interface SecurityMenuConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  status?: string;
  /** 状态文案色阶：success=已完成 / muted=未开启 / action=引导操作 */
  statusTone?: SecurityStatusTone;
}

export const SECURITY_MENU: SecurityMenuConfig[] = [
  {
    key: "phone",
    label: "绑定手机号",
    icon: Smartphone,
    color: GAME.infoBlue,
    bg: GAME.infoSoft,
    status: "已绑定",
    statusTone: "success",
  },
  {
    key: "email",
    label: "绑定邮箱",
    icon: Mail,
    color: GAME.infoBlue,
    bg: GAME.infoSoft,
    status: "未绑定",
    statusTone: "muted",
  },
  {
    key: "fp-login",
    label: "指纹登录",
    icon: Fingerprint,
    color: GAME.primary,
    bg: GAME.primarySoft,
    status: "未开启",
    statusTone: "muted",
  },
  {
    key: "password",
    label: "修改登录密码",
    icon: Lock,
    color: GAME.inkSecondary,
    bg: GAME.bgMuted,
  },
  {
    key: "fp-pay",
    label: "指纹支付",
    icon: CreditCard,
    color: GAME.rewardGold,
    bg: GAME.rewardGoldSoft,
    status: "未开启",
    statusTone: "muted",
  },
  {
    key: "pay-password",
    label: "修改支付密码",
    icon: UserCheck,
    color: GAME.inkSecondary,
    bg: GAME.bgMuted,
  },
  {
    key: "face",
    label: "人脸登记",
    icon: Fingerprint,
    color: GAME.primary,
    bg: GAME.primarySoft,
    status: "未登记",
    statusTone: "muted",
  },
  {
    key: "realname",
    label: "实名认证",
    icon: ShieldCheck,
    color: GAME.success,
    bg: GAME.successSoft,
    status: "去认证",
    statusTone: "action",
  },
];

// ═══════════════════════════════════════════════════════════
// 任务页服务分类配置
// ═══════════════════════════════════════════════════════════
export interface ServiceCategoryConfig {
  key: string;
  name: string;
  icon: string;
}

export const TASK_CATEGORIES: ServiceCategoryConfig[] = [
  { key: "clean", name: "家政保洁", icon: "/icons/image1.png" },
  { key: "massage", name: "上门按摩", icon: "/icons/image4.png" },
  { key: "repair", name: "家电维修", icon: "/icons/image10.png" },
  { key: "move", name: "搬家拉货", icon: "/icons/image2.png" },
  { key: "ac", name: "空调清洗", icon: "/icons/image7.png" },
  { key: "nanny", name: "月嫂保姆", icon: "/icons/image5.png" },
  { key: "laundry", name: "衣物洗护", icon: "/icons/image8.png" },
  { key: "pet", name: "宠物护理", icon: "/icons/image6.png" },
  { key: "delivery", name: "跑腿配送", icon: "/icons/image9.png" },
  { key: "car", name: "汽车服务", icon: "/icons/image3.png" },
];

// ═══════════════════════════════════════════════════════════
// 页面文案配置
// ═══════════════════════════════════════════════════════════
export const TEXT = {
  home: {
    chartTitle: "近7天BV收益",
    wealthButton: "我的财富",
    signInButton: "签到",
    guestName: "小P同学",
    welcomeTitle: "欢迎加入P客",
    welcomeDesc: "请输入您的昵称开始P客之旅",
    startButton: "开始体验",
    creating: "创建中...",
    dailySignIn: "每日签到",
    signInReward: "点击签到领取今日奖励",
    signInLater: "暂不签到",
    signInNow: "立即签到",
    toRealName: "去实名认证",
    noData: "暂无收益数据",
    idCopied: "已复制ID",
    signInRulesTitle: "签到规则",
    signInRules: [
      "· 贫农及以上等级：签到第N天可得N P币，每日最高10P币",
      "· 长工等级奖励减半",
      "· 中途未签到将恢复从第1天开始",
      "· 当日签到成功，奖励将于次日发放",
      "· 未签到次日起倒扣P币：断1天扣10，断2天扣20，断3天及以上扣40，直到余额为0",
    ],
  },
  donor: {
    title: "东家打赏",
    availableBv: "可用BV",
    pkeToken: "东家P币",
    donorPoints: "东家积分",
    pointsTip: "东家积分来自被推荐东家的打赏数额10%，每月1号清零",
    totalIncome: "总BV收益",
    todayIncome: "今日收益",
    dosRate: "1:7.5",
    starTitle: "东家星级",
    donateButton: "我要打赏",
    proxyButton: "代他人打赏",
    exchangeZone: "BV兑换专区",
    records: "打赏记录",
    proxyRecords: "代打赏记录",
    donateRecords: "打赏记录",
    versionSwitch: "版本切换",
    versionTip: "温馨提示：亚太版和国际版所有数据均不通用",
    asia: "亚太版",
    global: "国际版",
    cancel: "取消",
    confirm: "确认切换",
    riskTitle: "风险提示",
    riskContent: [
      "1. 打赏是一种自愿行为，请根据自身经济能力合理参与。",
      "2. 打赏后资金将按照每日约0.2%的比例逐步释放。",
      "3. 当月累计打赏超过1万BV时，需额外支付0.1%的DOS手续费。",
      "4. 请仔细阅读并理解以上规则后再进行操作。",
    ],
    checkLater: "我再看看",
    known: "我已知晓",
    selectLevel: "选择打赏等级",
    payBv: "BV支付",
    payDos: "DOS支付",
    inviteCode: "推荐人邀请码（选填）",
    confirmDonate: "确认打赏",
    noOrders: "还没有打赏记录",
    noOrdersHint: "去打赏一下，记录会出现在这里",
    goDonate: "去打赏",
  },
  authCode: {
    title: "认证码",
    desc: "认证码是12位字母+数字组成，用于实名认证。兑换10个赠送3个。",
    tabs: { unused: "未使用", used: "已使用", transferred: "已转出" },
    exchangeTitle: "兑换认证码",
    exchangeConfirm: "兑换",
    transferring: "转让中...",
    transferConfirm: "确认转让",
    noCodes: "暂无认证码",
    bulkBonus: (count: number) => `批发优惠: 赠送${count}个`,
  },
  clockIn: {
    early: {
      title: "早起打卡",
      timeSlot: "打卡时段: 06:00 ~ 09:00 (北京时间)",
      inWindow: "当前在打卡时段内",
      outWindow: "不在打卡时段",
      rules: [
        "· 第1天打卡成功获得 1PB",
        "· 连续打卡每天增加 1PB，上限 5PB",
        "· 中断则次日扣 5P币，连续天数重置",
      ],
    },
    step: {
      title: "计步打卡",
      slogan: "每日5000步，健康又赚PB",
      todaySteps: "今日步数",
      target: "目标: 5,000",
      reward: "完成打卡 · 获得5PB",
      insufficient: "步数未达标",
      rules: ["· 设备记录行走5000步即可打卡", "· 打卡成功奖励 5PB"],
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════
// 路由配置
// ═══════════════════════════════════════════════════════════
export const ROUTES = {
  home: "/",
  authCode: "/auth-code",
  upgradeCode: "/upgrade-code",
  donor: "/donor",
  donorProxy: "/donor/proxy",
  donorExchange: "/donor/exchange",
  donorRecords: "/donor/records",
  task: "/task",
  clockInEarly: "/clock-in/early",
  clockInStep: "/clock-in/step",
  wealth: "/wealth",
  security: "/security",
  miniProgram: "/mini-program",
  codeMarket: "/code-market",
} as const;
