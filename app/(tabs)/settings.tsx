import { useState } from 'react'
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import { useClerk, useUser } from '@clerk/expo'
import clsx from 'clsx'
import { colors } from '@/constants/theme'

const SafeAreaView = styled(RNSafeAreaView)

/**
 * Shows the signed-in account and lets the user sign out.
 */
export default function Settings() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [signingOut, setSigningOut] = useState(false)

  const email = user?.primaryEmailAddress?.emailAddress

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      // The root guard sends the user back to sign in once the session ends
      await signOut()
    } catch {
      setSigningOut(false)
      Alert.alert("Couldn't sign out", "Please check your connection and try again.")
    }
  }

  const confirmSignOut = () => {
    // Alert buttons aren't supported on web, so sign out straight away there
    if (Platform.OS === 'web') return handleSignOut()

    Alert.alert("Sign out?", "You'll need to sign in again to see your subscriptions.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: handleSignOut },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="settings-title" accessibilityRole="header">Settings</Text>

      <View className="settings-card">
        <Text className="settings-label">Signed in as</Text>
        <Text className="settings-value" numberOfLines={1}>{email ?? 'Your account'}</Text>
      </View>

      <Pressable
        onPress={confirmSignOut}
        disabled={signingOut}
        accessibilityRole="button"
        accessibilityState={{ disabled: signingOut, busy: signingOut }}
        className={clsx('settings-signout', signingOut && 'settings-signout-disabled')}
      >
        {signingOut
          ? <ActivityIndicator color={colors.background} />
          : <Text className="settings-signout-text">Sign out</Text>}
      </Pressable>
    </SafeAreaView>
  )
}
