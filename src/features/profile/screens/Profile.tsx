import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);
  const displayName = user?.fullName ?? "John Doe";
  const email = user?.email ?? "john@example.com";

  return (
    <SafeAreaView className="flex-1 bg-[#f1f4ff]">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <Text className="text-3xl font-semibold text-[#1a1f36]">Profile</Text>
          <Text className="mt-1 text-base text-[#8d95af]">
            Manage your account settings
          </Text>

          <View
            style={styles.cardShadow}
            className="mt-6 rounded-[30px] bg-white p-5"
          >
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#e1ebff]">
                <Ionicons name="person-outline" size={30} color="#0c64ff" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-[#1a1f36]">
                  {displayName}
                </Text>
                <Text className="mt-1 text-sm text-[#8d95af]">{email}</Text>
                <Text className="mt-1 text-xs font-semibold text-[#0c64ff]">
                  Member since Jan 2026
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#c0c6de" />
            </View>
          </View>

          <View
            style={styles.cardShadow}
            className="mt-4 rounded-[30px] bg-white p-5"
          >
            <View className="flex-row items-start gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff]">
                <Ionicons name="document-text-outline" size={24} color="#0c64ff" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#1a1f36]">
                  Health Report
                </Text>
                <Text className="mt-1 text-sm text-[#6c7280]">
                  Export your health data for doctor consultation
                </Text>
              </View>
            </View>
            <Pressable className="mt-4 w-full items-center rounded-[18px] bg-[#0c64ff] py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="download-outline" size={18} color="#ffffff" />
                <Text className="text-sm font-semibold text-white">
                  Export Report (PDF)
                </Text>
              </View>
            </Pressable>
          </View>

          <View
            style={styles.cardShadow}
            className="mt-4 rounded-[30px] bg-white"
          >
            <View className="border-b border-[#eef2ff] px-5 py-4">
              <Text className="text-base font-semibold text-[#1a1f36]">
                Settings
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-start gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff]">
                  <Ionicons name="notifications-outline" size={20} color="#0c64ff" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-[#1a1f36]">
                    Daily Reminders
                  </Text>
                  <Text className="mt-1 text-sm text-[#6c7280]">
                    Get notified to log your health data
                  </Text>
                </View>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: "#d5d9eb", true: "#0c64ff" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <Pressable
            onPress={logout}
            className="mt-6 items-center rounded-[22px] border border-[#ff4d72] py-3"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={18} color="#ff4d72" />
              <Text className="text-base font-semibold text-[#ff4d72]">Log Out</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  cardShadow: {
    shadowColor: "#b0c4ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 3,
  },
});
