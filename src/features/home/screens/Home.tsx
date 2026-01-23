import { AddRecordModal } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const summaryStats = [
  { id: "logs", label: "Logs", value: 3, icon: "document-text-outline" },
  { id: "streak", label: "Day Streak", value: 7, icon: "trending-up-outline" },
];

const recentLogs = [
  {
    id: "1",
    date: "Jan 12",
    time: "08:30 AM",
    food: "Coffee, oatmeal",
    type: 4,
    size: "Medium",
    color: "Brown",
  },
  {
    id: "2",
    date: "Jan 11",
    time: "09:15 AM",
    food: "Spicy noodles",
    type: 3,
    size: "Medium",
    color: "Brown",
  },
  {
    id: "3",
    date: "Jan 10",
    time: "07:45 AM",
    food: "Vegetables, rice",
    type: 4,
    size: "Large",
    color: "Brown",
  },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const firstName = user?.fullName?.split(" ")?.[0] ?? "Friend";
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-[#f1f4ff]">
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <Text className="text-sm font-semibold text-[#0c64ff]">Jan 12, 2026</Text>
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
            {recentLogs.map((log) => (
              <View
                key={log.id}
                style={styles.cardShadow}
                className="flex-row rounded-3xl bg-white p-4"
              >
                <View className="mr-4 items-center rounded-2xl bg-[#eef3ff] px-4 py-3">
                  <Text className="text-xs font-semibold text-[#6c7280]">Type</Text>
                  <Text className="text-lg font-semibold text-[#0c64ff]">{log.type}</Text>
                  <View className="mt-2 h-2 w-10 rounded-full bg-[#8c6239]" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-[#1a1f36]">
                    {log.date} at {log.time}
                  </Text>
                  <Text className="mt-1 text-base font-semibold text-[#1a1f36]">{log.food}</Text>
                  <Text className="mt-1 text-xs text-[#6c7280]">
                    {log.size} • {log.color}
                  </Text>
                </View>
              </View>
            ))}
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
