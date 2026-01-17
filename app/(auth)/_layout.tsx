import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFF" },
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
