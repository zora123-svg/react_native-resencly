import { Stack, SplashScreen } from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font"
import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.")
}

// Open the tabs group by default instead of the alphabetically-first (auth) group
export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * Provides the auth session to the whole app. tokenCache keeps the session in SecureStore
 * so users stay signed in across restarts.
 */
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}

/**
 * Sets up the shared app stack and only lets signed-in users reach the app screens.
 */
function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth()

  // return a boolean variable on whether the fonts are loaded
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  })

  // Keep the splash up until fonts are ready and we know whether the user is signed in
  const isReady = (fontsLoaded || !!fontError) && isLoaded

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync() // dismisses the splash screen to reveal the app
    }
  }, [isReady])

  if (!isReady) return null; // prevents the app from loading

  return (
    <Stack screenOptions={{headerShown: false}}>
      {/* Flipping a guard redirects automatically and clears that group's history */}
      <Stack.Protected guard={!!isSignedIn} redirectTo="/(auth)/sign-in">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscriptions/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
