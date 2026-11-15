import { Pressable, Text, View } from "react-native";
import AuthButton from "@/componets/AuthButton";
import AuthField from "@/componets/AuthField";
import { sanitizeCode } from "@/lib/auth";

/**
 * Shared "check your inbox" step: 6-digit code entry, verify, resend with cooldown and a way back.
 */
const AuthCodeStep = ({
    email,
    code,
    onChangeCode,
    error,
    onSubmit,
    submitting,
    onResend,
    resending,
    resendIn,
    onBack,
    backLabel,
    disabled = false,
}: AuthCodeStepProps) => {
    return (
        <View className="auth-form">
            <Text className="auth-helper">
                We sent a 6-digit code to <Text className="auth-helper-strong">{email}</Text>. Enter it below to continue.
            </Text>

            <AuthField
                label="Verification code"
                value={code}
                onChangeText={(value) => onChangeCode(sanitizeCode(value))}
                placeholder="000000"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                className="auth-code-input"
                error={error}
            />

            <AuthButton title="Verify and continue" onPress={onSubmit} loading={submitting} disabled={disabled} />

            <AuthButton
                variant="secondary"
                title={resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                onPress={onResend}
                loading={resending}
                disabled={disabled || resendIn > 0}
            />

            <Pressable onPress={onBack} disabled={disabled} accessibilityRole="button" className="auth-text-button" hitSlop={8}>
                <Text className="auth-link">{backLabel}</Text>
            </Pressable>
        </View>
    )
}

export default AuthCodeStep
