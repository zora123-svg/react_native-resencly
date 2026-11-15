import { Stack } from "expo-router";
import "@/global.css";

/**
 * Creates the auth flow layout with a clean stack and no extra header chrome.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{headerShown: false, animation: "slide_from_right"}}/>;
}
