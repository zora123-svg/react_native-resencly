import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

/**
 * Inline alert for errors that don't belong to a single field.
 */
const AuthBanner = ({ message }: AuthBannerProps) => {
    return (
        <View className="auth-banner" accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Ionicons name="alert-circle-outline" size={18} color={colors.destructive} />
            <Text className="auth-banner-text">{message}</Text>
        </View>
    )
}

export default AuthBanner
