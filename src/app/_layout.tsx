import { GluestackUIProvider } from "@/lib/gluestack/providers";
import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack />
    </GluestackUIProvider>
  );
}
