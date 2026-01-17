
export enum CommissionType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
  TIERED = 'TIERED'
}

export enum FilterType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface CommissionTier {
  id: string;
  from: number;
  to: number;
  rate: number;
  type: CommissionType.FLAT | CommissionType.PERCENTAGE;
}

export interface TargetSettings {
  merchantOnboard: number;
  totalParcels: number;
  totalRevenue: number;
  commissionType: CommissionType;
  commissionValue: number; // Used for FLAT and PERCENTAGE
  tiers: CommissionTier[]; // Used for TIERED
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  individualSettings: TargetSettings | null; // null means uses global default
}

export interface SalesPerformance {
  currentMerchants: number;
  currentParcels: number;
  currentRevenue: number;
  date: string;
}
