import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { colors } from "@/constants/theme";
import { PASSWORD_RULES } from "@/lib/auth";

/**
 * Live checklist that ticks off each password requirement as the user types.
 */
const PasswordRules = ({ value }: PasswordRulesProps) => {
    return (
        <View className="auth-rules">
            {PASSWORD_RULES.map((rule) => {
                const met = rule.test(value)
                return (
                    <View
                        key={rule.id}
                        className="auth-rule-row"
                        accessible
                        accessibilityLabel={`${rule.label}, ${met ? 'met' : 'not met yet'}`}
                    >
                        <Ionicons
                            name={met ? "checkmark-circle" : "ellipse-outline"}
                            size={16}
                            color={met ? colors.success : colors.mutedForeground}
                        />
                        <Text className={clsx('auth-rule-text', met && 'auth-rule-text-met')}>{rule.label}</Text>
                    </View>
                )
            })}
        </View>
    )
}

export default PasswordRules
