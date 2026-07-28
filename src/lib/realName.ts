import { DEFAULT_COUNTRY, type CountryCode } from "@/lib/phoneCountries";
import type { DocumentType } from "@/lib/documentTypes";

export interface RealNameInfo {
  region: CountryCode;
  documentType: DocumentType;
  /** 脱敏后的姓名，如"王**" */
  maskedName: string;
  /** 认证到期日期，YYYY-MM-DD */
  expireAt: string;
}

/** 对齐后端 AuthStatus：-1未完成，0等待审核，1通过，2拒绝，4资料不完整，6认证过期 */
export type VerifyStatus = -1 | 0 | 1 | 2 | 4 | 6;

/** 是否已通过认证（可享受认证权益），其余一律视为需要（重新）认证 */
export function isVerified(status: VerifyStatus | undefined | null): boolean {
  return status === 1;
}

export type VerifyStatusTone = "success" | "muted" | "action" | "warning" | "error";

export interface VerifyStatusMeta {
  label: string;
  tone: VerifyStatusTone;
  /** 点击后打开的弹窗/流程类型 */
  action: "submit" | "pending" | "detail" | "rejected" | "incomplete" | "expired";
}

export const VERIFY_STATUS_META: Record<VerifyStatus, VerifyStatusMeta> = {
  [-1]: { label: "去认证", tone: "action", action: "submit" },
  0: { label: "审核中", tone: "muted", action: "pending" },
  1: { label: "已认证", tone: "success", action: "detail" },
  2: { label: "已拒绝", tone: "error", action: "rejected" },
  4: { label: "资料不完整", tone: "warning", action: "incomplete" },
  6: { label: "已过期", tone: "warning", action: "expired" },
};

// 演示用姓名池：真实后端接入后由实名认证结果返回真实姓名
const DEMO_NAMES = ["王magic", "李思远", "张雨桐", "陈嘉豪", "刘梓萌"];
const REAL_NAME_VALID_YEARS = 3;

function maskName(name: string): string {
  if (name.length <= 1) return name;
  return `${name[0]}${"*".repeat(name.length - 1)}`;
}

function pickDemoName(seed?: string): string {
  if (!seed) return DEMO_NAMES[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return DEMO_NAMES[hash % DEMO_NAMES.length];
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** 在现有到期日基础上续费 1 年；若到期日已过期，则从今天起算，避免续费后仍显示过去的日期 */
export function extendExpireByOneYear(expireAt: string): string {
  const current = new Date(expireAt);
  const base = Number.isNaN(current.getTime()) || current < new Date() ? new Date() : current;
  base.setFullYear(base.getFullYear() + 1);
  return formatDate(base);
}

/** "认证即将到期"提示的阈值天数 */
export const EXPIRE_SOON_DAYS = 30;

/** 已认证但到期日临近（尚未过期）时判定为"即将到期"，用于提醒用户及时续费 */
export function isExpiringSoon(expireAt: string | null | undefined, days = EXPIRE_SOON_DAYS): boolean {
  if (!expireAt) return false;
  const expire = new Date(expireAt);
  if (Number.isNaN(expire.getTime())) return false;
  const diffDays = (expire.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

/** 演示用：生成距今 N 天后的日期字符串，供开发者面板演示"即将到期"等场景 */
export function demoDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/** 生成演示用实名认证信息（姓名脱敏、到期时间为认证日起 3 年；expired 为 true 时生成一个已过去的到期日，用于演示"认证过期"态） */
export function createDemoRealNameInfo(
  seed?: string,
  region: CountryCode = DEFAULT_COUNTRY,
  documentType: DocumentType = "idcard",
  expired = false
): RealNameInfo {
  const expire = new Date();
  expire.setFullYear(expire.getFullYear() + (expired ? -1 : REAL_NAME_VALID_YEARS));
  return {
    region,
    documentType,
    maskedName: maskName(pickDemoName(seed)),
    expireAt: formatDate(expire),
  };
}
