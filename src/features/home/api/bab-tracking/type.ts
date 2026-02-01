export type BabConsistency =
  | "VERY_HARD"
  | "HARD"
  | "NORMAL"
  | "SOFT"
  | "VERY_SOFT"
  | "LIQUID";

export type BabColor =
  | "BROWN"
  | "DARK_BROWN"
  | "LIGHT_BROWN"
  | "YELLOW"
  | "GREEN"
  | "BLACK"
  | "RED"
  | "WHITE";

export type BabVolume = "SMALL" | "MEDIUM" | "LARGE";
export type BabDifficulty = "EASY" | "NORMAL" | "DIFFICULT" | "VERY_DIFFICULT";
export type BabTrackingStatus = "NORMAL" | "CONCERNING" | "REVIEWED";

export interface BabRecentMeal {
  id: string;
  foodName: string;
  hoursAgo: number;
  createdAt: string;
}

export interface BabTracking {
  id: string;
  userId: string;
  dateTime: string;
  bristolScale: number;
  consistency: BabConsistency;
  color: BabColor;
  volume?: BabVolume;
  duration?: number;
  hasBlood: boolean;
  hasMucus: boolean;
  painLevel: number;
  painDescription?: string | null;
  difficulty: BabDifficulty;
  feltRelieved: boolean;
  notes?: string | null;
  photoUrl?: string | null;
  status: BabTrackingStatus;
  createdAt: string;
  updatedAt: string;
  recentMeals: BabRecentMeal[];
}

export interface CreateBabTrackingRequest {
  dateTime?: string;
  bristolScale: number;
  consistency: BabConsistency;
  color: BabColor;
  volume?: BabVolume;
  duration?: number;
  hasBlood?: boolean;
  hasMucus?: boolean;
  painLevel?: number;
  painDescription?: string;
  difficulty?: BabDifficulty;
  feltRelieved?: boolean;
  notes?: string;
  photoUrl?: string;
  status?: BabTrackingStatus;
  recentMeals?: Array<{ foodName: string; hoursAgo: number }>;
}

export interface CreateBabTrackingResponse {
  success: boolean;
  message: string;
  data: BabTracking;
}

export interface GetBabTrackingListResponse {
  success: boolean;
  message: string;
  data: BabTracking[];
}
