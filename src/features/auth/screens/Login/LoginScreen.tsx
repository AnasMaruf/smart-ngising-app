import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#f5f6fa] px-6">
      <Text className="text-xl font-semibold text-[#2f3542]">Login</Text>
      <View className="mt-6 flex-row gap-1">
        <Text className="text-base text-[#57606f]">Don&apos;t have an account?</Text>
        <Link href="/register" asChild>
          <Text className="text-base font-medium text-[#0066ff]">Register</Text>
        </Link>
      </View>
    </View>
  );
}
