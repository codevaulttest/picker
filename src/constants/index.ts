import type { PkeLevel } from "@/types";

export const PKE_LEVELS: PkeLevel[] = [
  { level: 1, originalName: "长工", cnName: "学徒", enName: "Initiate" },
  { level: 2, originalName: "贫农", cnName: "执行者", enName: "Executor" },
  { level: 3, originalName: "富农", cnName: "先锋", enName: "Vanguard" },
  { level: 4, originalName: "队长", cnName: "队长", enName: "Captain" },
  { level: 5, originalName: "村长", cnName: "管事", enName: "Steward" },
  { level: 6, originalName: "乡长", cnName: "统领", enName: "Marshal" },
  { level: 7, originalName: "镇长", cnName: "指挥官", enName: "Commander" },
  { level: 8, originalName: "县令", cnName: "执政官", enName: "Governor" },
  { level: 9, originalName: "知府", cnName: "大执政官", enName: "High Governor" },
  { level: 10, originalName: "巡抚", cnName: "巡域官", enName: "Regional Governor" },
  { level: 11, originalName: "太守", cnName: "领主", enName: "Overseer" },
  { level: 12, originalName: "丞相", cnName: "丞相", enName: "Chancellor" },
];

export const UPGRADE_COSTS: Record<number, number> = {
  2: 500, 3: 2500, 4: 10000, 5: 45000, 6: 65000,
  7: 115000, 8: 215000, 9: 415000, 10: 815000, 11: 1615000, 12: 3215000,
};

export const STAR_LEVELS = [
  { star: 0, min: 0, max: 11250 },
  { star: 1, min: 11250, max: 60000 },
  { star: 2, min: 60000, max: 300000 },
  { star: 3, min: 300000, max: 1500000 },
  { star: 4, min: 1500000, max: 3000000 },
  { star: 5, min: 3000000, max: 6000000 },
  { star: 6, min: 6000000, max: 10000000 },
];

export const DOS_BV_RATE = 7.5;

export const AUTH_CODE_COST = { CV: 500, UV: 500, BV: 1000 };
export const PKE_AUTH_CODE_COST = 1000; // 东家BV换认证码
export const AUTH_CODE_BULK_THRESHOLD = 10;
export const AUTH_CODE_BULK_BONUS = 0.3;

export const EARLY_RISE_REWARD = { base: 1, max: 5, penalty: 5 };
export const STEP_COUNT_REWARD = 5;
export const STEP_COUNT_MIN = 5000;

export const FOREMAN_COST = 3000;

export const COLORS = {
  primary: "#3B82F6",
  primaryLight: "#60A5FA",
  orange: "#F97316",
  orangeLight: "#FB923C",
  success: "#22C55E",
  warning: "#EAB308",
  danger: "#EF4444",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  uv: "#8B5CF6",
  cv: "#EC4899",
  bv: "#3B82F6",
  pb: "#F59E0B",
  dos: "#10B981",
};

export const LEVEL_COLORS: Record<number, string> = {
  1: "#94A3B8", 2: "#22C55E", 3: "#3B82F6", 4: "#6366F1",
  5: "#8B5CF6", 6: "#A855F7", 7: "#D946EF", 8: "#EC4899",
  9: "#F43F5E", 10: "#E11D48", 11: "#F97316", 12: "#F59E0B",
};
