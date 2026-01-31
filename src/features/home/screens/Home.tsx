import { AddRecordModal } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import {
  useBabTrackingListQuery,
  type BabColor,
  type BabTracking,
} from "@/features/home/api/bab-tracking";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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

const COLOR_SWATCHES: Record<BabColor, string> = {
  BROWN: "#8c6239",
  DARK_BROWN: "#5a3213",
  LIGHT_BROWN: "#cfa16f",
  YELLOW: "#f4c842",
  GREEN: "#4cbc7c",
  BLACK: "#30313d",
  RED: "#f45b69",
  WHITE: "#d9d9e0",
};

const getLocalDateKey = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calculateDayStreak = (records: BabTracking[]) => {
  if (!records.length) return 0;
  const dateSet = new Set(records.map((record) => getLocalDateKey(record.dateTime)));
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const formatEnumLabel = (value?: string | null) => {
  if (!value) return "-";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatRecordDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatRecordTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

const getFoodSummary = (record: BabTracking) => {
  if (record.recentMeals?.length) {
    return record.recentMeals.map((meal) => meal.foodName).join(", ");
  }
  if (record.notes) return record.notes;
  return "No notes added";
};

const getColorSwatch = (color: BabColor) => COLOR_SWATCHES[color] ?? "#8c6239";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const firstName = user?.fullName?.split(" ")?.[0] ?? "Friend";
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const { data, isLoading, isFetching, refetch, isError, error } = useBabTrackingListQuery();
  const records = data?.data ?? [];
  const recentLogs = records.slice(0, 10);
  const summaryStats = useMemo(
    () => [
      { id: "logs", label: "Logs", value: records.length, icon: "document-text-outline" },
      {
        id: "streak",
        label: "Day Streak",
        value: calculateDayStreak(records),
        icon: "trending-up-outline",
      },
    ],
    [records]
  );
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );
  const isRefreshing = isFetching && !isLoading;

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-[#f1f4ff]">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        >
          <View className="rounded-b-[32px] bg-[#0c64ff] px-6 pb-10 pt-4">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-base text-white/80">Welcome back,</Text>
              <Text className="text-4xl font-semibold text-white">{firstName}</Text>
            </View>
            <Pressable onPress={logout} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="text-sm font-semibold text-white">Logout</Text>
            </Pressable>
          </View>
          <View style={styles.cardShadow} className="mt-8 rounded-3xl bg-white p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-[#1a1f36]">Today's Summary</Text>
              <Text className="text-sm font-semibold text-[#0c64ff]">{todayLabel}</Text>
            </View>
            <View className="mt-5 flex-row gap-4">
              {summaryStats.map((stat) => (
                <View key={stat.id} className="flex-1 rounded-2xl bg-[#f5f7ff] px-4 py-5">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Ionicons name={stat.icon as any} size={20} color="#0c64ff" />
                  </View>
                  <Text className="mt-4 text-4xl font-semibold text-[#1a1f36]">{stat.value}</Text>
                  <Text className="mt-1 text-sm font-medium text-[#6c7280]">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-6 py-8">
          <Text className="text-lg font-semibold text-[#1a1f36]">
            Recent records from the past month
          </Text>
          <View className="mt-5 gap-4">
            {isLoading ? (
              <View className="items-center py-6">
                <ActivityIndicator color="#0c64ff" />
              </View>
            ) : recentLogs.length === 0 ? (
              <Text className="text-sm text-[#6c7280]">
                Belum ada catatan. Tekan tombol tambah untuk membuat log pertama Anda.
              </Text>
            ) : (
              recentLogs.map((log) => (
                <View
                  key={log.id}
                  style={styles.cardShadow}
                  className="flex-row rounded-3xl bg-white p-4"
                >
                  <View className="mr-4 items-center rounded-2xl bg-[#eef3ff] px-4 py-3">
                    <Text className="text-xs font-semibold text-[#6c7280]">Type</Text>
                    <Text className="text-lg font-semibold text-[#0c64ff]">{log.bristolScale}</Text>
                    <View
                      className="mt-2 h-2 w-10 rounded-full"
                      style={{ backgroundColor: getColorSwatch(log.color) }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#1a1f36]">
                      {formatRecordDate(log.dateTime)} at {formatRecordTime(log.dateTime)}
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-[#1a1f36]">
                      {getFoodSummary(log)}
                    </Text>
                    <Text className="mt-1 text-xs text-[#6c7280]">
                      {formatEnumLabel(log.volume)} • {formatEnumLabel(log.color)}
                    </Text>
                  </View>
                </View>
              ))
            )}
            {isError && (
              <Text className="text-sm text-red-500">
                {error instanceof Error ? error.message : "Failed to load records."}
              </Text>
            )}
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Pressable
        onPress={() => setIsAddRecordOpen(true)}
        style={{
          position: "absolute",
          bottom: 32,
          right: 24,
          height: 64,
          width: 64,
          borderRadius: 32,
          backgroundColor: "#0c64ff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0c64ff",
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      <AddRecordModal visible={isAddRecordOpen} onClose={() => setIsAddRecordOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  cardShadow: {
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
});
