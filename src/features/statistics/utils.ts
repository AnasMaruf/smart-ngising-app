import type { BabColor, BabTracking } from "@/features/home/api/bab-tracking";

export const COLOR_SWATCHES: Record<BabColor, string> = {
  BROWN: "#8c6239",
  DARK_BROWN: "#5a3213",
  LIGHT_BROWN: "#cfa16f",
  YELLOW: "#f4c842",
  GREEN: "#4cbc7c",
  BLACK: "#30313d",
  RED: "#f45b69",
  WHITE: "#d9d9e0",
};

export const getColorSwatch = (color: BabColor) => COLOR_SWATCHES[color] ?? "#8c6239";

export const formatEnumLabel = (value?: string | null) => {
  if (!value) return "-";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const formatRecordDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const formatRecordTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

export const formatFrequencyLabel = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const getFoodSummary = (record: BabTracking) => {
  if (record.recentMeals?.length) {
    return record.recentMeals.map((meal) => meal.foodName).join(", ");
  }
  if (record.notes) return record.notes;
  return "No notes added";
};

export type HistoryEntry = {
  id: string;
  label: string;
  summary: string;
  bristolScale: number;
  volumeLabel: string;
  colorLabel: string;
  swatch: string;
};

export const buildHistoryEntries = (history: BabTracking[], limit = 10): HistoryEntry[] =>
  history.slice(0, limit).map((log) => ({
    id: log.id,
    label: `${formatRecordDate(log.dateTime)} at ${formatRecordTime(log.dateTime)}`,
    summary: getFoodSummary(log),
    bristolScale: log.bristolScale,
    volumeLabel: formatEnumLabel(log.volume),
    colorLabel: formatEnumLabel(log.color),
    swatch: getColorSwatch(log.color),
  }));
