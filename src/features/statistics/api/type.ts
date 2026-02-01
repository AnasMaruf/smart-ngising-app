import type { BabTracking } from "@/features/home/api/bab-tracking";

export interface StatsSummary {
  totalLogs: number;
  logsThisMonth: number;
  dayStreak: number;
  percentageGrowth: string;
  healthScore: number;
  healthLabel: string;
  healthColor: string;
}

export interface FrequencyPoint {
  date: string;
  count: number;
}

export interface BristolDistribution {
  "Type 1-2": number;
  "Type 3-4": number;
  "Type 5": number;
  "Type 6-7": number;
}

export interface StatsIssue {
  date: string;
  score: number;
  issues: string[];
}

export interface StatsData {
  summary: StatsSummary;
  charts: {
    frequency: FrequencyPoint[];
    bristolDistribution: BristolDistribution;
  };
  analysis: {
    recentIssues: StatsIssue[];
  };
  history: BabTracking[];
}

export interface GetStatsResponse {
  success: boolean;
  message: string;
  data: StatsData;
}
