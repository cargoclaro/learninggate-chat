export interface StatKV {
  key: string;
  value: number;
}

export interface MaturityData {
  score: number;
  level: string;
  color: string;
  description: string;
}

export interface ROIData {
  current: number;
  potential: number;
  opportunity: number;
  employeeCount: number;
  currentHoursPerWeek: number;
  currentMinutesSavedPerDay: number;
  adoptionEffectiveness: number;
  missedHoursPerDay?: number;
}
