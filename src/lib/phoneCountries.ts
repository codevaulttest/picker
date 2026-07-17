import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js/min";
import * as FlagIcons from "country-flag-icons/react/3x2";
import type { ComponentType, SVGProps } from "react";

export type { CountryCode };
export type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface CountryOption {
  code: CountryCode;
  dial: string;
  name: string;
  nameEn: string;
  Flag?: FlagComponent;
}

const zhRegionNames = new Intl.DisplayNames(["zh"], { type: "region" });
const enRegionNames = new Intl.DisplayNames(["en"], { type: "region" });
const flagByCode = FlagIcons as unknown as Record<string, FlagComponent>;

// 全量国家/地区区号列表（由 libphonenumber-js 元数据生成），国旗使用 country-flag-icons（矢量 SVG，非 emoji）
export const COUNTRIES: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    dial: getCountryCallingCode(code),
    name: zhRegionNames.of(code) || code,
    nameEn: enRegionNames.of(code) || code,
    Flag: flagByCode[code],
  }))
  .sort((a, b) => {
    if (a.code === "CN") return -1;
    if (b.code === "CN") return 1;
    return a.name.localeCompare(b.name, "zh");
  });

export const DEFAULT_COUNTRY: CountryCode = "CN";
// 常见共用区号的默认归属地区（如 +1 优先归属美国），用于兼容历史遗留的纯号码数据解析
const DIAL_PREFERENCE: Record<string, CountryCode> = { "1": "US", "7": "RU", "44": "GB" };

export function findCountry(code: CountryCode): CountryOption {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

export function isPhoneValid(local: string, country: CountryCode): boolean {
  if (!local) return false;
  return isValidPhoneNumber(local, country);
}

// 兼容历史遗留的纯数字（无区号）数据，默认视为中国大陆手机号
export function parsePhone(raw: string): { country: CountryCode; local: string } {
  if (!raw) return { country: DEFAULT_COUNTRY, local: "" };
  if (raw.startsWith("+")) {
    const candidates = COUNTRIES
      .filter((c) => raw.startsWith(`+${c.dial}`))
      .sort((a, b) => b.dial.length - a.dial.length);
    if (candidates.length > 0) {
      const longest = candidates[0].dial;
      const preferred = DIAL_PREFERENCE[longest];
      const match = candidates.find((c) => c.dial === longest && c.code === preferred) || candidates[0];
      return { country: match.code, local: raw.slice(1 + match.dial.length) };
    }
    return { country: DEFAULT_COUNTRY, local: raw.replace(/^\+/, "") };
  }
  return { country: DEFAULT_COUNTRY, local: raw };
}

export function maskPhone(local: string): string {
  if (local.length <= 7) return local;
  return `${local.slice(0, 3)}${"*".repeat(local.length - 7)}${local.slice(-4)}`;
}

/** 国家/地区搜索：支持中文名、英文名、拼音区号数字匹配 */
export function searchCountries(list: CountryOption[], query: string): CountryOption[] {
  const q = query.trim().toLowerCase().replace(/^\+/, "");
  if (!q) return list;
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
  );
}
