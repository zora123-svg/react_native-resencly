import { Stack } from "expo-router";
import "@/global.css";

/**
 * Sets up the shared app stack so screens can render without a custom header.
 */
export default function RootLayout() {
  return <Stack screenOptions={{headerShown: false}} />;
}
