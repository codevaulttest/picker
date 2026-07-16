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
