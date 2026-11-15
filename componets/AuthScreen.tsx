import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView)

/**
 * Shared shell for auth screens: safe area, keyboard avoidance and a scrollable body.
 */
const AuthScreen = ({ children }: AuthScreenProps) => {
    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView className="auth-screen" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    className="auth-scroll"
                    contentContainerClassName="auth-content"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AuthScreen
