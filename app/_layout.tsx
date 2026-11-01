import { Stack, SplashScreen } from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font"
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync()

// Open the tabs group by default instead of the alphabetically-first (auth) group
export const unstable_settings = {
  anchor: "(tabs)",
};
/**
 * Sets up the shared app stack so screens can render without a custom header.
 */
export default function RootLayout() {
  // return a boolean variable on whether the fonts are loaded
  
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  })


  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync() // dismisses the splash screen to reveal the app
    }
   }, [fontsLoaded, fontError])

   if(!fontsLoaded && !fontError) return null; // prevents the app from loading

  return <Stack screenOptions={{headerShown: false}} />;
}
