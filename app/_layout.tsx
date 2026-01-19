import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GluestackUIProvider } from "@/lib/gluestack/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import "@/global.css";

const queryClient = new QueryClient();

function AuthGate() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) router.replace("/register");
    else if (user && inAuth) router.replace("/(tabs)/home");
  }, [user, isLoading, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
