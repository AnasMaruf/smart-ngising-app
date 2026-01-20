import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const totalLogs = {
  value: 289,
  change: 12,
};

const quickStats = [
  {
    id: "streak",
    value: 7,
    label: "Day Streak",
    helper: "🔥 Keep it up!",
    icon: "ribbon-outline",
  },
  {
    id: "month",
    value: 58,
    label: "Logs This Month",
    helper: "Jan 2026",
    icon: "calendar-outline",
  },
] as const;

const bowelFrequency = [
  { id: "jan6", label: "Jan 6", value: 1 },
  { id: "jan7", label: "Jan 7", value: 3 },
  { id: "jan8", label: "Jan 8", value: 3 },
  { id: "jan9", label: "Jan 9", value: 1 },
  { id: "jan10", label: "Jan 10", value: 1 },
  { id: "jan11", label: "Jan 11", value: 1 },
  { id: "jan12", label: "Jan 12", value: 3 },
];

const stoolTypeDistribution = [
  { id: "type1", label: "Type 1-2", percentage: 15, color: "#f97316" },
  { id: "type2", label: "Type 3-4", percentage: 50, color: "#22c55e" },
  { id: "type3", label: "Type 5", percentage: 25, color: "#3b82f6" },
  { id: "type4", label: "Type 6-7", percentage: 10, color: "#ef4444" },
];

const historyEntries = [
  {
    id: "today",
    label: "Today, 08:30 AM",
    food: "Coffee, oatmeal",
    type: 4,
    size: "Medium",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
  {
    id: "yesterday",
    label: "Yesterday, 09:15 AM",
    food: "Spicy noodles",
    type: 3,
    size: "Medium",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
  {
    id: "jan10",
    label: "Jan 10, 07:45 AM",
    food: "Vegetables, rice",
    type: 4,
    size: "Large",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
  {
    id: "jan9",
    label: "Jan 9, 08:00 AM",
    food: "Fried food",
    type: 2,
    size: "Small",
    colorLabel: "Yellow",
    swatch: "#dfa000",
  },
  {
    id: "jan8",
    label: "Jan 8, 10:20 AM",
    food: "Salad, chicken",
    type: 4,
    size: "Medium",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
  {
    id: "jan7",
    label: "Jan 7, 09:30 AM",
    food: "Bread, eggs",
    type: 3,
    size: "Small",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
  {
    id: "jan6",
    label: "Jan 6, 08:45 AM",
    food: "Pasta, cheese",
    type: 4,
    size: "Medium",
    colorLabel: "Brown",
    swatch: "#8b5e3c",
  },
];

const ranges = [
  { id: "7", label: "Last 7 Days" },
  { id: "30", label: "Last 30 Days" },
];

export default function StatisticsScreen() {
  const [selectedRange, setSelectedRange] = React.useState("7");
  const maxBowelValue = Math.max(...bowelFrequency.map((item) => item.value), 1);

  return (
    <SafeAreaView className="flex-1 bg-[#f1f4ff]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View className="px-6">
          <Text className="text-3xl font-semibold text-[#1a1f36]">Statistics</Text>
          <Text className="mt-1 text-base text-[#8d95af]">Track your health journey</Text>

          <View style={styles.primaryCardShadow} className="mt-6 rounded-[32px] bg-[#0c64ff] p-6">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="pulse-outline" size={24} color="#ffffff" />
            </View>
            <Text className="mt-4 text-5xl font-semibold text-white">{totalLogs.value}</Text>
            <Text className="mt-2 text-base text-white/80">Total Logs</Text>
            <View className="mt-4 flex-row items-center gap-2">
              <Ionicons name="trending-up" size={18} color="#5ce1e6" />
              <Text className="text-sm font-semibold text-white">
                +{totalLogs.change}% this month
              </Text>
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
            <View className="mt-4 h-48 justify-end">
              <View className="absolute inset-0 justify-between py-3">
                {[0, 1, 2, 3].map((line) => (
                  <View key={line} className="h-px w-full bg-[#eef2ff]" />
                ))}
              </View>
              <View className="flex-row items-end justify-between">
                {bowelFrequency.map((item) => {
                  const height = (item.value / maxBowelValue) * 140;
                  return (
                    <View key={item.id} className="items-center">
                      <View className="w-6 justify-end rounded-full bg-[#dbe6ff]">
                        <View
                          style={{ height }}
                          className="w-full rounded-full bg-[#0c64ff]"
                        />
                      </View>
                      <Text className="mt-3 text-xs font-medium text-[#8d95af]">{item.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.cardShadow} className="mt-6 rounded-[32px] bg-white p-5">
            <Text className="text-lg font-semibold text-[#1a1f36]">
              Bristol Stool Type Distribution
            </Text>
            <View className="mt-4 flex-row gap-6">
              <View className="items-center justify-center">
                <DonutChart data={stoolTypeDistribution} />
              </View>
              <View className="flex-1 justify-center gap-3">
                {stoolTypeDistribution.map((item) => (
                  <View key={item.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="text-sm font-semibold text-[#1a1f36]">
                        {item.label}
                      </Text>
                    </View>
                    <Text className="text-sm font-semibold text-[#1a1f36]">
                      {item.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="mt-6 pb-8">
            <Text className="text-lg font-semibold text-[#1a1f36]">History</Text>
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
                      {entry.type}
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
                      {entry.food}
                    </Text>
                    <Text className="mt-1 text-xs text-[#6c7280]">
                      {entry.size} • {entry.colorLabel}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type DonutChartProps = {
  data: typeof stoolTypeDistribution;
};

function DonutChart({ data }: DonutChartProps) {
  const radius = 48;
  const strokeWidth = 16;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.percentage, 0);
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
          const sliceLength = (slice.percentage / total) * circumference;
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
          {data[1]?.percentage ?? 0}
        </Text>
        <Text className="text-xs text-[#8d95af]">Type 3-4</Text>
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
