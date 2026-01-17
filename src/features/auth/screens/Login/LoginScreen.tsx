import { Text, View } from "react-native";

interface LoginFormData {
  email: string;
  pin: string;
}

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-foreground-950 text-xl font-semibold">Login</Text>
    </View>
  );
}
