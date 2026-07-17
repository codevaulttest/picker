export interface PkeLevel {
  level: number;
  originalName: string;
  cnName: string;
  enName: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  pkeId: string;
  realName: string;
  isRealName: boolean;
  level: number;
  phone: string | null;
  email: string | null;
  inviteCode: string | null;
  referrerId: string | null;
  name: string;
  avatar: string;
  consecutiveClockInDays: number;
  /** 每日签到最近一次成功签到日期，用于判断当天是否已签、以及断签检测 */
  lastCheckInDate: string | null;
  /** 每日签到连续天数，中途未签到则恢复从第1天开始（与 consecutiveClockInDays 互相独立，后者归早起打卡使用） */
  signInStreak: number;
  /** 已签到但奖励尚未到账的 P 币（规则：当日签到成功，次日发放） */
  pendingSignInReward: number;
  /** 待发放奖励对应的签到日期，到了下一天才会结算入账 */
  pendingSignInRewardDate: string | null;
  /** 已扣过款的未签到日期，避免同一天被重复倒扣 */
  penaltyAppliedDates: string[];
  assets?: UserAssets;
}

export interface UserAssets {
  uv: number;
  cv: number;
  pb: number;
  bv: number;
  dos: number;
  greenGem: number;
  yellowGem: number;
  redGem: number;
  pkeBv: number;
  pkePoint: number;
  asiaPkeBv: number;
  asiaPkePoint: number;
  globalBv: number;
  globalPkePoint: number;
  shotPoint: number;
}

export interface AuthCode {
  id: number;
  code: string;
  status: "UNUSED" | "USED" | "TRANSFERRED";
  usedByUserId: string | null;
  usedByRealName: string | null;
  createdAt: Date;
  usedAt: Date | null;
  transferredTo: string | null;
  source: string;
}

export interface UpgradeCodeItem {
  id: number;
  code: string;
  level: number;
  status: "UNUSED" | "USED" | "TRANSFERRED";
  usedByUserId: string | null;
  usedByRealName: string | null;
  createdAt: Date;
  transferredTo: string | null;
}

export interface DonateOrder {
  id: number;
  targetLevel: number;
  payAsset: string;
  payAmount: string;
  progress: number;
  totalAirdrop: string;
  status: string;
  createdAt: Date;
}

export interface DonateLevel {
  level: number;
  name: string;
  bv: number;
  dosAmount: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  icon: string | null;
  sortOrder: number;
  parentId: number | null;
}

export interface ServiceItem {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: string;
  unit: string;
  duration: string | null;
  sales: number;
  rating: string;
  image: string | null;
  tags: string[] | null;
}

export interface TaskMaster {
  id: number;
  name: string;
  avatar: string | null;
  rating: string;
  serviceCount: number;
  skills: string[] | null;
  price: string | null;
  status: string;
}

export interface ServiceOrder {
  id: number;
  serviceName: string;
  price: string;
  quantity: number;
  totalAmount: string;
  status: string;
  createdAt: Date;
}

export interface ClockInRecord {
  id: number;
  type: "EARLY_RISE" | "STEP_COUNT";
  recordDate: Date;
  status: string;
  reward: number;
  consecutiveDays: number;
}
