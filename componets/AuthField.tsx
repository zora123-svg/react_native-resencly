import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { colors } from "@/constants/theme";

/**
 * Labelled text input with inline error or helper text and an optional show/hide password toggle.
 */
const AuthField = ({ label, error, helper, secureToggle, secureTextEntry, className, ref, ...inputProps }: AuthFieldProps) => {
    const [hidden, setHidden] = useState(true)

    return (
        <View className="auth-field">
            <Text className="auth-label">{label}</Text>

            <View className="auth-input-wrap">
                <TextInput
                    ref={ref}
                    className={clsx('auth-input', secureToggle && 'pr-14', error && 'auth-input-error', className)}
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={secureToggle ? hidden : secureTextEntry}
                    accessibilityLabel={label}
                    accessibilityHint={error ?? helper}
                    {...inputProps}
                />
                {secureToggle && (
                    <Pressable
                        className="auth-input-toggle"
                        onPress={() => setHidden((current) => !current)}
                        accessibilityRole="button"
                        accessibilityLabel={hidden ? "Show password" : "Hide password"}
                        hitSlop={8}
                    >
                        <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={20} color={colors.mutedForeground} />
                    </Pressable>
                )}
            </View>

            {error ? (
                <Text className="auth-error" accessibilityLiveRegion="polite">{error}</Text>
            ) : helper ? (
                <Text className="auth-helper">{helper}</Text>
            ) : null}
        </View>
    )
}

export default AuthField
