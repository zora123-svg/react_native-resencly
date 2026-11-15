import { useRef, useState } from "react";
import { Pressable, Text, View, type TextInputInstance } from "react-native";
import { Link } from "expo-router";
import { useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AuthScreen from "@/componets/AuthScreen";
import AuthBrand from "@/componets/AuthBrand";
import AuthField from "@/componets/AuthField";
import AuthButton from "@/componets/AuthButton";
import AuthBanner from "@/componets/AuthBanner";
import AuthCodeStep from "@/componets/AuthCodeStep";
import PasswordRules from "@/componets/PasswordRules";
import { colors } from "@/constants/theme";
import {
  GENERIC_AUTH_ERROR,
  PENDING_TASK_ERROR,
  createAuthNavigate,
  notifyAuthError,
  resolveAuthError,
  useResendCooldown,
  validateCode,
  validateEmail,
  validateNewPassword,
} from "@/lib/auth";

/**
 * Lets a new user create an account with email and password, then confirm their email with a code.
 */
export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp()
  const cooldown = useResendCooldown()
  const passwordRef = useRef<TextInputInstance>(null)

  const [step, setStep] = useState<"details" | "code">("details")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [errors, setErrors] = useState<AuthFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const isBusy = submitting || resending || fetchStatus === "fetching"

  const showError = (error: unknown) => {
    const { field, message } = resolveAuthError(error)
    setErrors({ [field]: message })
    notifyAuthError()
  }

  const clearError = (field: AuthErrorField) => {
    if (errors[field] || errors.form) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  const handleSignUp = async () => {
    const nextErrors: AuthFormErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
    }
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors)
      notifyAuthError()
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      const { error } = await signUp.password({ emailAddress: email.trim(), password })
      if (error) return showError(error)

      const { error: sendError } = await signUp.verifications.sendEmailCode()
      if (sendError) return showError(sendError)

      setCode("")
      setStep("code")
      cooldown.start()
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async () => {
    const codeError = validateCode(code)
    if (codeError) {
      setErrors({ code: codeError })
      notifyAuthError()
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code })
      if (error) return showError(error)

      if (signUp.status !== "complete") {
        setErrors({ form: GENERIC_AUTH_ERROR })
        return
      }

      // Turns the verified sign-up into an active session, the root guard then opens the app
      const { error: finalizeError } = await signUp.finalize({
        navigate: createAuthNavigate(() => setErrors({ form: PENDING_TASK_ERROR })),
      })
      if (finalizeError) showError(finalizeError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const { error } = await signUp.verifications.sendEmailCode()
      if (error) return showError(error)
      setErrors({})
      cooldown.start()
    } finally {
      setResending(false)
    }
  }

  const handleEditEmail = async () => {
    await signUp.reset()
    setStep("details")
    setCode("")
    setErrors({})
  }

  return (
    <AuthScreen>
      <AuthBrand
        title={step === "code" ? "Verify your email" : "Create your account"}
        subtitle={step === "code"
          ? "One quick step and you're ready to track your subscriptions"
          : "Track every subscription and never miss a renewal"}
      />

      <View className="auth-card">
        {step === "code" ? (
          <View className="auth-form">
            {errors.form && <AuthBanner message={errors.form} />}
            <AuthCodeStep
              email={email.trim()}
              code={code}
              onChangeCode={(value) => {
                setCode(value)
                clearError("code")
              }}
              error={errors.code}
              onSubmit={handleVerify}
              submitting={submitting}
              onResend={handleResend}
              resending={resending}
              resendIn={cooldown.remaining}
              onBack={handleEditEmail}
              backLabel="Use a different email"
              disabled={isBusy}
            />
          </View>
        ) : (
          <View className="auth-form">
            {errors.form && <AuthBanner message={errors.form} />}

            <AuthField
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value)
                clearError("email")
              }}
              onBlur={() => email && setErrors((current) => ({ ...current, email: validateEmail(email) }))}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={errors.email}
            />

            <AuthField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value)
                clearError("password")
              }}
              placeholder="Create a password"
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
              error={errors.password}
            />

            <PasswordRules value={password} />

            <AuthButton title="Create account" onPress={handleSignUp} loading={submitting} disabled={isBusy} />

            {/* Required for sign-up flows on web when bot protection is enabled. Skipped on iOS and Android */}
            <View nativeID="clerk-captcha" />
          </View>
        )}

        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/(auth)/sign-in" replace asChild>
            <Pressable accessibilityRole="link" hitSlop={8}>
              <Text className="auth-link">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View className="auth-trust">
        <Ionicons name="lock-closed-outline" size={14} color={colors.mutedForeground} />
        <Text className="auth-trust-text">Your session is stored securely on this device</Text>
      </View>
    </AuthScreen>
  );
}
