import { Stack, SplashScreen } from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font"
import { useEffect } from "react";

/**
 * Sets up the shared app stack so screens can render without a custom header.
 */
export default function RootLayout() {
  // return a boolean variable on whether the fonts are loaded
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync() // dismisses the splash screen to reveal the app
    }
   }, [fontsLoaded])

   if(!fontsLoaded) return null; // prevents the app from loading

  return <Stack screenOptions={{headerShown: false}} />;
}
