import { ActivityIndicator, Pressable, Text } from "react-native";
import clsx from "clsx";
import { colors } from "@/constants/theme";

/**
 * Primary or secondary auth action that shows a spinner while its request is running.
 */
const AuthButton = ({ title, onPress, loading = false, disabled = false, variant = "primary" }: AuthButtonProps) => {
    const isDisabled = disabled || loading
    const isPrimary = variant === "primary"

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            className={clsx(
                isPrimary ? 'auth-button' : 'auth-secondary-button',
                isDisabled && (isPrimary ? 'auth-button-disabled' : 'opacity-50'),
            )}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? colors.primary : colors.accent} />
            ) : (
                <Text className={isPrimary ? 'auth-button-text' : 'auth-secondary-button-text'}>{title}</Text>
            )}
        </Pressable>
    )
}

export default AuthButton
