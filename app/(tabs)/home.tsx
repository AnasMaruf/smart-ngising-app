import { View, Text, Pressable } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-[#f5f6fa] px-6 gap-6">
      <Text className="text-2xl font-bold text-[#2f3542]">Welcome, {user?.fullName}!</Text>
      <Text className="text-base text-[#57606f]">{user?.email}</Text>
      <Pressable
        onPress={logout}
        className="h-12 w-full max-w-[200px] items-center justify-center rounded-xl bg-red-500"
      >
        <Text className="text-base font-medium text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
