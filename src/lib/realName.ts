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

/** 生成演示用实名认证信息（姓名脱敏、到期时间为认证日起 3 年） */
export function createDemoRealNameInfo(
  seed?: string,
  region: CountryCode = DEFAULT_COUNTRY,
  documentType: DocumentType = "idcard"
): RealNameInfo {
  const expire = new Date();
  expire.setFullYear(expire.getFullYear() + REAL_NAME_VALID_YEARS);
  return {
    region,
    documentType,
    maskedName: maskName(pickDemoName(seed)),
    expireAt: formatDate(expire),
  };
}
