export interface UserInput {
  totalStorage: number;
  freeStorage: number;
  heavyFolders: string;
  taskManagerDesc: string;
  batteryPercent: number;
}

export interface StorageSummary {
  total: number;
  free: number;
  percentUsed: number;
  message: string;
}

export interface HeavyFolderItem {
  name: string;
  size: string;
  action: string;
}

export interface CompressionSuggestion {
  shouldCompress: boolean;
  estimatedRecovery: string;
  details: string;
}

export interface BatteryInfo {
  wearEstimate: string;
  chargingAdvice: string;
}

export interface SafetyScore {
  score: number;
  advice: string;
}

export interface HealthReport {
  storageSummary: StorageSummary;
  safeToDelete: string[];
  heavyFolders: HeavyFolderItem[];
  compression: CompressionSuggestion;
  ramCpuOptimizations: string[];
  overheatFixes: string[];
  batteryTips: BatteryInfo;
  powershellCommand: string;
  safetyScore: SafetyScore;
}