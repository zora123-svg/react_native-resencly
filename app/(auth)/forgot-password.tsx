import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useSignIn } from "@clerk/expo";
import AuthScreen from "@/componets/AuthScreen";
import AuthBrand from "@/componets/AuthBrand";
import AuthField from "@/componets/AuthField";
import AuthButton from "@/componets/AuthButton";
import AuthBanner from "@/componets/AuthBanner";
import AuthCodeStep from "@/componets/AuthCodeStep";
import PasswordRules from "@/componets/PasswordRules";
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

type ResetStep = "email" | "code" | "password" | "mfa"

const STEP_COPY: Record<ResetStep, { title: string; subtitle: string }> = {
  email: { title: "Reset your password", subtitle: "Enter your account email and we'll send you a reset code" },
  code: { title: "Check your inbox", subtitle: "Enter the code we sent to confirm it's you" },
  password: { title: "Choose a new password", subtitle: "You'll use it the next time you sign in" },
  mfa: { title: "One more step", subtitle: "Confirm it's you to finish signing in" },
}

/**
 * Walks a user through resetting their password with an emailed code, then signs them in.
 */
export default function ForgotPassword() {
  const { signIn, fetchStatus } = useSignIn()
  const params = useLocalSearchParams<{ email?: string }>()
  const cooldown = useResendCooldown()

  const [step, setStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState(params.email ?? "")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
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

  const showValidation = (nextErrors: AuthFormErrors) => {
    setErrors(nextErrors)
    notifyAuthError()
  }

  // Wraps each request so the loading state always resets, even when we bail out early
  const submit = async (action: () => Promise<void>) => {
    setErrors({})
    setSubmitting(true)
    try {
      await action()
    } finally {
      setSubmitting(false)
    }
  }

  const finalize = async () => {
    const { error } = await signIn.finalize({
      navigate: createAuthNavigate(() => setErrors({ form: PENDING_TASK_ERROR })),
    })
    if (error) showError(error)
  }

  const handleSendCode = () => {
    const emailError = validateEmail(email)
    if (emailError) return showValidation({ email: emailError })

    submit(async () => {
      const { error } = await signIn.create({ identifier: email.trim() })
      if (error) return showError(error)

      const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode()
      if (sendError) return showError(sendError)

      setCode("")
      setStep("code")
      cooldown.start()
    })
  }

  const handleVerifyCode = () => {
    const codeError = validateCode(code)
    if (codeError) return showValidation({ code: codeError })

    submit(async () => {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code })
      if (error) return showError(error)

      if (signIn.status === "needs_new_password") return setStep("password")
      setErrors({ form: GENERIC_AUTH_ERROR })
    })
  }

  const handleResetPassword = () => {
    const passwordError = validateNewPassword(password)
    if (passwordError) return showValidation({ password: passwordError })

    submit(async () => {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password, signOutOfOtherSessions: true })
      if (error) return showError(error)

      if (signIn.status === "complete") return await finalize()

      // Accounts with 2FA still need to confirm a second factor after the reset
      const supportsEmailCode = signIn.supportedSecondFactors.some((factor) => factor.strategy === "email_code")
      if (signIn.status === "needs_second_factor" && supportsEmailCode) {
        const { error: sendError } = await signIn.mfa.sendEmailCode()
        if (sendError) return showError(sendError)

        setCode("")
        setStep("mfa")
        cooldown.start()
        return
      }
      setErrors({ form: "Your password was updated. Please sign in with your new password." })
    })
  }

  const handleVerifyMfa = () => {
    const codeError = validateCode(code)
    if (codeError) return showValidation({ code: codeError })

    submit(async () => {
      const { error } = await signIn.mfa.verifyEmailCode({ code })
      if (error) return showError(error)

      if (signIn.status === "complete") return await finalize()
      setErrors({ form: GENERIC_AUTH_ERROR })
    })
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const { error } = step === "mfa"
        ? await signIn.mfa.sendEmailCode()
        : await signIn.resetPasswordEmailCode.sendCode()
      if (error) return showError(error)
      setErrors({})
      cooldown.start()
    } finally {
      setResending(false)
    }
  }

  const handleStartOver = async () => {
    await signIn.reset()
    setStep("email")
    setCode("")
    setPassword("")
    setErrors({})
  }

  const isCodeStep = step === "code" || step === "mfa"

  return (
    <AuthScreen>
      <AuthBrand title={STEP_COPY[step].title} subtitle={STEP_COPY[step].subtitle} />

      <View className="auth-card">
        <View className="auth-form">
          {errors.form && <AuthBanner message={errors.form} />}

          {step === "email" && (
            <>
              <AuthField
                label="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value)
                  clearError("email")
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={handleSendCode}
                error={errors.email}
              />
              <AuthButton title="Send reset code" onPress={handleSendCode} loading={submitting} disabled={isBusy} />
            </>
          )}

          {isCodeStep && (
            <AuthCodeStep
              email={email.trim()}
              code={code}
              onChangeCode={(value) => {
                setCode(value)
                clearError("code")
              }}
              error={errors.code}
              onSubmit={step === "mfa" ? handleVerifyMfa : handleVerifyCode}
              submitting={submitting}
              onResend={handleResend}
              resending={resending}
              resendIn={cooldown.remaining}
              onBack={handleStartOver}
              backLabel="Use a different email"
              disabled={isBusy}
            />
          )}

          {step === "password" && (
            <>
              <AuthField
                label="New password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value)
                  clearError("password")
                }}
                placeholder="Create a new password"
                secureToggle
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
                error={errors.password}
              />
              <PasswordRules value={password} />
              <AuthButton title="Update password" onPress={handleResetPassword} loading={submitting} disabled={isBusy} />
            </>
          )}
        </View>

        <View className="auth-link-row">
          <Text className="auth-link-copy">Remembered it?</Text>
          <Link href="/(auth)/sign-in" dismissTo asChild>
            <Pressable accessibilityRole="link" hitSlop={8}>
              <Text className="auth-link">Back to sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthScreen>
  );
}
