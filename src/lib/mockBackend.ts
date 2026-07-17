/**
 * 本地 mock 后端 —— P客APP 是纯前端原型/demo，不接入真实服务端。
 * 所有"接口"都是同步操作 + localStorage 持久化，用 Promise 包一层以
 * 保持与 @tanstack/react-query 的 queryFn/mutationFn 签名一致。
 */
import type {
  AuthCode,
  DonateOrder,
  ServiceItem,
  UpgradeCodeItem,
  UserAssets,
  UserProfile,
} from "@/types";
import { AUTH_CODE_CONFIG, DONATE_LEVELS, LEVELS, TASK_CATEGORIES } from "@/config/app.config";

const DB_KEY = "pke_mock_db_v1";
const PROFILE_KEY_PREFIX = "pke_mock_profile_";

type CodeStatus = "UNUSED" | "USED" | "TRANSFERRED";

interface ProxyOrder extends DonateOrder {
  toUserId: string;
  toUserName: string;
}

interface MockDb {
  authCodes: AuthCode[];
  upgradeCodes: UpgradeCodeItem[];
  donateOrders: DonateOrder[];
  proxyOrders: ProxyOrder[];
  services: ServiceItem[];
  nextId: number;
}

function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < AUTH_CODE_CONFIG.length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function loadDb(): MockDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // ignore malformed data
  }
  return { authCodes: [], upgradeCodes: [], donateOrders: [], proxyOrders: [], services: [], nextId: 1 };
}

function saveDb(db: MockDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nextId(db: MockDb): number {
  const id = db.nextId;
  db.nextId += 1;
  return id;
}

const defaultAssets: UserAssets = {
  uv: 0, cv: 0, pb: 0, bv: 0, dos: 0,
  greenGem: 0, yellowGem: 0, redGem: 0,
  pkeBv: 0, pkePoint: 0,
  asiaPkeBv: 0, asiaPkePoint: 0,
  globalBv: 0, globalPkePoint: 0, shotPoint: 0,
};

function profileKey(pkeId: string) {
  return PROFILE_KEY_PREFIX + pkeId;
}

function loadProfile(pkeId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(profileKey(pkeId));
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem(profileKey(profile.pkeId), JSON.stringify(profile));
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return toDateStr(dt);
}

// ═══════════════════════════════════════════════════════════
// user
// ═══════════════════════════════════════════════════════════

/** 老 localStorage 里的 profile 可能没有新字段，读出来时补齐默认值 */
function migrateProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    lastCheckInDate: profile.lastCheckInDate ?? null,
    signInStreak: profile.signInStreak ?? 0,
    pendingSignInReward: profile.pendingSignInReward ?? 0,
    pendingSignInRewardDate: profile.pendingSignInRewardDate ?? null,
    penaltyAppliedDates: profile.penaltyAppliedDates ?? [],
  };
}

// 签到奖励：第N天=N P币（贫农及以上等级），长工等级减半，每日最高10P币
export const SIGN_IN_REWARD_CAP_DAYS = 7;
// 未签到次日倒扣：断1天扣10，断2天扣20，断3天及以上封顶扣40
const SIGN_IN_PENALTY_SCHEDULE = [10, 20, 40];

export function getSignInReward(streakDay: number, isChangGong: boolean): number {
  const base = Math.min(streakDay, SIGN_IN_REWARD_CAP_DAYS);
  return isChangGong ? base / 2 : base;
}

function penaltyForMissedIndex(i: number): number {
  return SIGN_IN_PENALTY_SCHEDULE[Math.min(i, SIGN_IN_PENALTY_SCHEDULE.length - 1)];
}

/**
 * 每次读取/写入签到状态前结算：
 * 1) 昨天及更早签到赚的奖励，今天才到账（次日发放）
 * 2) 上次签到之后到昨天之间，每个尚未扣过款的日期按断签天数递增倒扣，并把连续签到重置为0
 */
function settleSignIn(profile: UserProfile): UserProfile {
  const today = toDateStr(new Date());

  if (profile.pendingSignInReward > 0 && profile.pendingSignInRewardDate && profile.pendingSignInRewardDate !== today) {
    if (profile.assets) profile.assets.pb += profile.pendingSignInReward;
    profile.pendingSignInReward = 0;
    profile.pendingSignInRewardDate = null;
  }

  if (profile.lastCheckInDate) {
    const penalized = new Set(profile.penaltyAppliedDates);
    let cursor = addDays(profile.lastCheckInDate, 1);
    let missedIndex = 0;
    let brokeStreak = false;
    while (cursor < today) {
      if (!penalized.has(cursor)) {
        const penalty = penaltyForMissedIndex(missedIndex);
        if (profile.assets) profile.assets.pb = Math.max(0, profile.assets.pb - penalty);
        penalized.add(cursor);
        brokeStreak = true;
      }
      missedIndex += 1;
      cursor = addDays(cursor, 1);
    }
    if (brokeStreak) {
      profile.signInStreak = 0;
      profile.penaltyAppliedDates = Array.from(penalized).slice(-30);
    }
  }

  return profile;
}

export async function registerUser(name: string) {
  const userId = Date.now();
  const pkeId = crypto.randomUUID().replace(/-/g, "").slice(0, 11);
  const profile: UserProfile = {
    id: userId,
    userId,
    pkeId,
    realName: "",
    isRealName: false,
    level: 1,
    phone: null,
    email: null,
    inviteCode: null,
    referrerId: null,
    name,
    avatar: "",
    consecutiveClockInDays: 0,
    lastCheckInDate: null,
    signInStreak: 0,
    pendingSignInReward: 0,
    pendingSignInRewardDate: null,
    penaltyAppliedDates: [],
    assets: { ...defaultAssets },
  };
  saveProfile(profile);
  return { userId, pkeId, profile, assets: profile.assets };
}

export async function getUserProfile(pkeId: string): Promise<UserProfile | null> {
  const profile = loadProfile(pkeId);
  if (!profile) return null;
  const settled = settleSignIn(migrateProfile(profile));
  saveProfile(settled);
  return settled;
}

export async function signIn(pkeId: string) {
  const loaded = loadProfile(pkeId);
  if (!loaded) return { reward: 0, alreadySigned: false, profile: null };

  const profile = settleSignIn(migrateProfile(loaded));
  const today = toDateStr(new Date());
  if (profile.lastCheckInDate === today) {
    saveProfile(profile);
    return { reward: 0, alreadySigned: true, profile };
  }

  const newStreak = profile.signInStreak + 1;
  const isChangGong = profile.level === 1;
  const reward = getSignInReward(newStreak, isChangGong);

  profile.signInStreak = newStreak;
  profile.lastCheckInDate = today;
  profile.pendingSignInReward = reward;
  profile.pendingSignInRewardDate = today;
  saveProfile(profile);
  return { reward, alreadySigned: false, profile };
}

// ═══════════════════════════════════════════════════════════
// authCode
// ═══════════════════════════════════════════════════════════

export async function listAuthCodes(status: CodeStatus): Promise<AuthCode[]> {
  const db = loadDb();
  return db.authCodes.filter((c) => c.status === status);
}

export async function exchangeAuthCode(count: number) {
  const db = loadDb();
  const bonus = count >= AUTH_CODE_CONFIG.bulkThreshold ? Math.floor(count * AUTH_CODE_CONFIG.bulkBonus) : 0;
  const total = count + bonus;
  for (let i = 0; i < total; i++) {
    db.authCodes.push({
      id: nextId(db),
      code: randomCode(),
      status: "UNUSED",
      usedByUserId: null,
      usedByRealName: null,
      createdAt: new Date(),
      usedAt: null,
      transferredTo: null,
      source: "exchange",
    });
  }
  saveDb(db);
  return { totalCodes: total, bonusCount: bonus };
}

export async function transferAuthCodes(codeIds: number[], toUserId: string) {
  const db = loadDb();
  for (const c of db.authCodes) {
    if (codeIds.includes(c.id)) {
      c.status = "TRANSFERRED";
      c.transferredTo = toUserId;
    }
  }
  saveDb(db);
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════
// upgradeCode
// ═══════════════════════════════════════════════════════════

export async function listUpgradeCodes(status: CodeStatus): Promise<UpgradeCodeItem[]> {
  const db = loadDb();
  return db.upgradeCodes.filter((c) => c.status === status);
}

export function getUpgradeCosts() {
  return LEVELS.filter((l) => l.level >= 2).map((l) => ({ level: l.level, cost: l.upgradeCost }));
}

export async function exchangeUpgradeCode(level: number) {
  const db = loadDb();
  db.upgradeCodes.push({
    id: nextId(db),
    code: randomCode(),
    level,
    status: "UNUSED",
    usedByUserId: null,
    usedByRealName: null,
    createdAt: new Date(),
    transferredTo: null,
  });
  saveDb(db);
  return { level };
}

export async function transferUpgradeCodes(codeIds: number[], toUserId: string) {
  const db = loadDb();
  for (const c of db.upgradeCodes) {
    if (codeIds.includes(c.id)) {
      c.status = "TRANSFERRED";
      c.transferredTo = toUserId;
    }
  }
  saveDb(db);
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════
// clockIn
// ═══════════════════════════════════════════════════════════

export async function clockInEarlyRise(pkeId: string | undefined) {
  const profile = pkeId ? loadProfile(pkeId) : null;
  const days = (profile?.consecutiveClockInDays ?? 0) + 1;
  const reward = Math.min(5, days);
  if (profile) {
    profile.consecutiveClockInDays = days;
    if (profile.assets) profile.assets.pb += reward;
    saveProfile(profile);
  }
  return { reward };
}

export async function clockInStepCount(_steps: number) {
  return { reward: 5 };
}

// ═══════════════════════════════════════════════════════════
// donor
// ═══════════════════════════════════════════════════════════

export function getDonateLevels() {
  return DONATE_LEVELS.map((l) => ({ level: l.level, name: l.cnName, bv: l.donateBv }));
}

export async function getDonorAssets(pkeId: string | undefined) {
  const profile = pkeId ? loadProfile(pkeId) : null;
  const totalBvIncome = profile?.assets?.pkeBv ?? 0;
  return { totalBvIncome };
}

export async function getDonateOrders(): Promise<DonateOrder[]> {
  const db = loadDb();
  return db.donateOrders;
}

export async function getProxyOrders(): Promise<ProxyOrder[]> {
  const db = loadDb();
  return db.proxyOrders;
}

export async function donate(targetLevel: number, payAsset: "BV" | "DOS") {
  const db = loadDb();
  const level = DONATE_LEVELS.find((l) => l.level === targetLevel);
  db.donateOrders.unshift({
    id: nextId(db),
    targetLevel,
    payAsset,
    payAmount: String(level?.donateBv ?? 0),
    progress: 0,
    totalAirdrop: String(level?.donateBv ?? 0),
    status: "PENDING",
    createdAt: new Date(),
  });
  saveDb(db);
  return { ok: true };
}

export async function proxyDonate(toUserId: string, toUserName: string, targetLevel: number) {
  const db = loadDb();
  const level = DONATE_LEVELS.find((l) => l.level === targetLevel);
  db.proxyOrders.unshift({
    id: nextId(db),
    targetLevel,
    payAsset: "BV",
    payAmount: String(level?.donateBv ?? 0),
    progress: 0,
    totalAirdrop: String(level?.donateBv ?? 0),
    status: "PENDING",
    createdAt: new Date(),
    toUserId,
    toUserName,
  });
  saveDb(db);
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════
// task
// ═══════════════════════════════════════════════════════════

function seedServices(): ServiceItem[] {
  return TASK_CATEGORIES.map((cat, i) => ({
    id: i + 1,
    categoryId: i + 1,
    name: `${cat.name}服务`,
    description: `专业${cat.name}服务，品质保障`,
    price: String(50 + i * 20),
    unit: "次",
    duration: null,
    sales: 100 + i * 13,
    rating: "4.9",
    image: cat.icon,
    tags: null,
  }));
}

export async function getTaskServices(keyword?: string): Promise<ServiceItem[]> {
  const services = seedServices();
  if (!keyword) return services;
  return services.filter((s) => s.name.includes(keyword) || s.description?.includes(keyword));
}
