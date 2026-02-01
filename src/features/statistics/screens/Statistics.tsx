import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useStatsQuery } from "@/features/statistics/api";
import {
  buildHistoryEntries,
  formatFrequencyLabel,
  formatRecordDate,
  formatRecordTime,
} from "@/features/statistics/utils";

const DISTRIBUTION_COLORS = {
  "Type 1-2": "#f97316",
  "Type 3-4": "#22c55e",
  "Type 5": "#3b82f6",
  "Type 6-7": "#ef4444",
} as const;

const ranges = [
  { id: "7", label: "Last 7 Days" },
  { id: "30", label: "Last 30 Days" },
];

const HISTORY_LIMIT = 10;

const getMonthlyLabel = () =>
  new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" });

export default function StatisticsScreen() {
  const [selectedRange, setSelectedRange] = useState("7");
  const { data, isLoading, isFetching, refetch, isError, error } = useStatsQuery(selectedRange);
  const stats = data?.data;
  const summary = stats?.summary;
  const frequency = stats?.charts.frequency ?? [];
  const bristolDistribution = stats?.charts.bristolDistribution;
  const recentIssues = stats?.analysis.recentIssues ?? [];
  const historyEntries = useMemo(
    () => buildHistoryEntries(stats?.history ?? [], HISTORY_LIMIT),
    [stats?.history]
  );
  const monthLabel = useMemo(getMonthlyLabel, []);
  const quickStats = useMemo(
    () => [
      {
        id: "streak",
        value: summary?.dayStreak ?? 0,
        label: "Day Streak",
        helper: (summary?.dayStreak ?? 0) > 0 ? "🔥 Keep it up!" : "Log today to start streak",
        icon: "ribbon-outline",
      },
      {
        id: "month",
        value: summary?.logsThisMonth ?? 0,
        label: "Logs This Month",
        helper: monthLabel,
        icon: "calendar-outline",
      },
    ],
    [summary?.dayStreak, summary?.logsThisMonth, monthLabel]
  );
  const distributionData = useMemo(() => {
    if (!bristolDistribution) return [];
    const entries = Object.entries(bristolDistribution);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    if (!total) return [];
    return entries.map(([label, count]) => ({
      id: label,
      label,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: DISTRIBUTION_COLORS[label as keyof typeof DISTRIBUTION_COLORS] ?? "#0c64ff",
    }));
  }, [bristolDistribution]);
  const highlightDistribution =
    distributionData.length > 0
      ? distributionData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev))
      : null;
  const maxBowelValue = useMemo(
    () => Math.max(...frequency.map((item) => item.count), 1),
    [frequency]
  );
  const isRefreshing = isFetching && !isLoading;

  if (!stats && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f1f4ff]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#0c64ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f1f4ff]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
      >
        <View className="px-6">
          <Text className="text-3xl font-semibold text-[#1a1f36]">Statistics</Text>
          <Text className="mt-1 text-base text-[#8d95af]">Track your health journey</Text>

          <View style={styles.primaryCardShadow} className="mt-6 rounded-[32px] bg-[#0c64ff] p-6">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="pulse-outline" size={24} color="#ffffff" />
            </View>
            <Text className="mt-4 text-5xl font-semibold text-white">
              {summary?.totalLogs ?? 0}
            </Text>
            <Text className="mt-2 text-base text-white/80">Total Logs</Text>
            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="trending-up" size={18} color="#5ce1e6" />
                <Text className="text-sm font-semibold text-white">
                  {summary?.percentageGrowth ?? "0%"} vs last month
                </Text>
              </View>
              {summary?.healthLabel && (
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: `${summary.healthColor ?? "#5ce1e6"}33` }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: summary.healthColor ?? "#5ce1e6" }}
                  >
                    {summary.healthLabel} ({summary.healthScore})
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="mt-4 flex-row gap-4">
            {quickStats.map((stat) => (
              <View
                key={stat.id}
                style={styles.cardShadow}
                className="flex-1 rounded-[28px] bg-white px-5 py-6"
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff]">
                  <Ionicons name={stat.icon as any} size={22} color="#0c64ff" />
                </View>
                <Text className="mt-4 text-4xl font-semibold text-[#1a1f36]">{stat.value}</Text>
                <Text className="mt-1 text-sm font-medium text-[#6c7280]">{stat.label}</Text>
                <Text
                  className={`mt-2 text-xs font-semibold ${
                    stat.id === "streak" ? "text-[#22c55e]" : "text-[#8d95af]"
                  }`}
                >
                  {stat.helper}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-6 flex-row gap-3">
            {ranges.map((range) => {
              const isActive = selectedRange === range.id;
              return (
                <Pressable
                  key={range.id}
                  onPress={() => setSelectedRange(range.id)}
                  className={`flex-1 rounded-[22px] px-5 py-3 ${
                    isActive ? "bg-[#0c64ff]" : "bg-white border border-[#e0e5fb]"
                  }`}
                  style={!isActive ? styles.cardShadow : undefined}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      isActive ? "text-white" : "text-[#1a1f36]"
                    }`}
                  >
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.cardShadow} className="mt-6 rounded-[32px] bg-white p-5">
            <Text className="text-lg font-semibold text-[#1a1f36]">Bowel Frequency</Text>
            {frequency.length === 0 ? (
              <View className="py-8">
                <Text className="text-center text-sm text-[#8d95af]">
                  No bowel movement data for this range yet.
                </Text>
              </View>
            ) : (
              <View className="mt-4 h-48 justify-end">
                <View className="absolute inset-0 justify-between py-3">
                  {[0, 1, 2, 3].map((line) => (
                    <View key={line} className="h-px w-full bg-[#eef2ff]" />
                  ))}
                </View>
                <View className="flex-row items-end justify-between">
                  {frequency.map((point) => {
                    const height = (point.count / maxBowelValue) * 140;
                    return (
                      <View key={point.date} className="items-center">
                        <View className="w-6 justify-end rounded-full bg-[#dbe6ff]">
                          <View style={{ height }} className="w-full rounded-full bg-[#0c64ff]" />
                        </View>
                        <Text className="mt-3 text-xs font-medium text-[#8d95af]">
                          {formatFrequencyLabel(point.date)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {recentIssues.length > 0 && (
            <View style={styles.cardShadow} className="mt-6 rounded-[28px] bg-white p-5">
              <Text className="text-lg font-semibold text-[#1a1f36]">Recent Alerts</Text>
              <View className="mt-4 gap-3">
                {recentIssues.map((issue, index) => (
                  <View
                    key={`${issue.date}-${index}`}
                    className="rounded-2xl border border-[#ffe4e7] bg-[#fff9fb] px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-[#d946ef]">
                      {formatRecordDate(issue.date)} at {formatRecordTime(issue.date)}
                    </Text>
                    <Text className="mt-1 text-xs font-semibold text-[#fb7185]">
                      Score {issue.score}
                    </Text>
                    <Text className="mt-1 text-xs text-[#6c7280]">
                      {issue.issues?.length ? issue.issues.join(", ") : "No issues detected"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.cardShadow} className="mt-6 rounded-[32px] bg-white p-5">
            <Text className="text-lg font-semibold text-[#1a1f36]">
              Bristol Stool Type Distribution
            </Text>
            {distributionData.length === 0 ? (
              <View className="py-8">
                <Text className="text-center text-sm text-[#8d95af]">
                  Not enough data to calculate distribution.
                </Text>
              </View>
            ) : (
              <View className="mt-4 flex-row gap-6">
                <View className="items-center justify-center">
                  <DonutChart data={distributionData} highlight={highlightDistribution ?? undefined} />
                </View>
                <View className="flex-1 justify-center gap-3">
                  {distributionData.map((item) => (
                    <View key={item.id} className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <View
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <Text className="text-sm font-semibold text-[#1a1f36]">{item.label}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-[#1a1f36]">
                        {item.percentage}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View className="mt-6 pb-8">
            <Text className="text-lg font-semibold text-[#1a1f36]">History</Text>
            {historyEntries.length === 0 ? (
              <View className="mt-4 rounded-3xl bg-white p-5" style={styles.cardShadow}>
                <Text className="text-sm text-[#6c7280]">
                  There are no logs for this timeframe yet. Add a record to see it here.
                </Text>
              </View>
            ) : (
              <View className="mt-4 gap-4">
                {historyEntries.map((entry) => (
                  <View
                    key={entry.id}
                    style={styles.cardShadow}
                    className="flex-row items-center rounded-[26px] bg-white px-4 py-4"
                  >
                    <View className="mr-4 items-center rounded-2xl bg-[#eef3ff] px-4 py-3">
                      <Text className="text-xs font-semibold text-[#6c7280]">Type</Text>
                      <Text className="mt-1 text-lg font-semibold text-[#0c64ff]">
                        {entry.bristolScale}
                      </Text>
                      <View
                        className="mt-2 h-1.5 w-12 rounded-full"
                        style={{ backgroundColor: entry.swatch }}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-[#1a1f36]">
                          {entry.label}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color="#c0c6de" />
                      </View>
                      <Text className="mt-1 text-base font-semibold text-[#1a1f36]">
                        {entry.summary}
                      </Text>
                      <Text className="mt-1 text-xs text-[#6c7280]">
                        {entry.volumeLabel} • {entry.colorLabel}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {isError && (
            <Text className="pb-4 text-center text-sm text-red-500">
              {error instanceof Error ? error.message : "Failed to load statistics"}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type DonutSlice = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
};

type DonutChartProps = {
  data: DonutSlice[];
  highlight?: DonutSlice;
};

function DonutChart({ data, highlight }: DonutChartProps) {
  const radius = 48;
  const strokeWidth = 16;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e6ebff"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {data.map((slice) => {
          const sliceLength =
            totalValue === 0 ? 0 : (slice.value / totalValue) * circumference;
          const circle = (
            <Circle
              key={slice.id}
              cx={center}
              cy={center}
              r={radius}
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${sliceLength} ${circumference}`}
              strokeDashoffset={circumference - cumulative - sliceLength}
              strokeLinecap="round"
              fill="transparent"
              rotation="-90"
              originX={center}
              originY={center}
            />
          );
          cumulative += sliceLength;
          return circle;
        })}
        <Circle cx={center} cy={center} r={radius - strokeWidth + 6} fill="white" />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-2xl font-semibold text-[#1a1f36]">
          {highlight?.percentage ?? 0}%
        </Text>
        <Text className="text-xs text-[#8d95af]">{highlight?.label ?? "No data"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  cardShadow: {
    shadowColor: "#b0c4ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 3,
  },
  primaryCardShadow: {
    shadowColor: "#245eff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
});
