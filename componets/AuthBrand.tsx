import { Text, View } from "react-native";

/**
 * Renders the Resencly logo lockup with the screen title and supporting copy.
 */
const AuthBrand = ({ title, subtitle }: AuthBrandProps) => {
    return (
        <View className="auth-brand-block">
            <View className="auth-logo-wrap" accessible accessibilityRole="image" accessibilityLabel="Resencly, smart billing">
                <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                    <Text className="auth-wordmark">Resencly</Text>
                    <Text className="auth-wordmark-sub">Smart billing</Text>
                </View>
            </View>

            <Text className="auth-title" accessibilityRole="header">{title}</Text>
            <Text className="auth-subtitle">{subtitle}</Text>
        </View>
    )
}

export default AuthBrand
