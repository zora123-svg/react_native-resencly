import { useRef, useState } from "react";
import { Pressable, Text, View, type TextInputInstance } from "react-native";
import { Link } from "expo-router";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AuthScreen from "@/componets/AuthScreen";
import AuthBrand from "@/componets/AuthBrand";
import AuthField from "@/componets/AuthField";
import AuthButton from "@/componets/AuthButton";
import AuthBanner from "@/componets/AuthBanner";
import AuthCodeStep from "@/componets/AuthCodeStep";
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
  validatePassword,
} from "@/lib/auth";

/**
 * Lets a returning user sign in with email and password, plus an email code when the device needs verifying.
 */
export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn()
  const cooldown = useResendCooldown()
  const passwordRef = useRef<TextInputInstance>(null)

  const [step, setStep] = useState<"credentials" | "code">("credentials")
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

  const finalize = async () => {
    const { error } = await signIn.finalize({
      navigate: createAuthNavigate(() => setErrors({ form: PENDING_TASK_ERROR })),
    })
    if (error) showError(error)
  }

  // New devices or accounts with 2FA need a second step before the session is created
  const sendVerificationCode = async () => {
    const supportsEmailCode = signIn.supportedSecondFactors.some((factor) => factor.strategy === "email_code")
    if (!supportsEmailCode) {
      setErrors({ form: "This account uses a verification method the app doesn't support yet. Please contact support." })
      notifyAuthError()
      return
    }

    const { error } = await signIn.mfa.sendEmailCode()
    if (error) return showError(error)

    setCode("")
    setStep("code")
    cooldown.start()
  }

  const handleSignIn = async () => {
    const nextErrors: AuthFormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors)
      notifyAuthError()
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      const { error } = await signIn.password({ emailAddress: email.trim(), password })
      if (error) return showError(error)

      if (signIn.status === "complete") return await finalize()
      if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
        return await sendVerificationCode()
      }
      setErrors({ form: GENERIC_AUTH_ERROR })
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
      const { error } = await signIn.mfa.verifyEmailCode({ code })
      if (error) return showError(error)

      if (signIn.status === "complete") return await finalize()
      setErrors({ form: GENERIC_AUTH_ERROR })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const { error } = await signIn.mfa.sendEmailCode()
      if (error) return showError(error)
      setErrors({})
      cooldown.start()
    } finally {
      setResending(false)
    }
  }

  const handleStartOver = async () => {
    await signIn.reset()
    setStep("credentials")
    setCode("")
    setPassword("")
    setErrors({})
  }

  return (
    <AuthScreen>
      <AuthBrand
        title={step === "code" ? "Check your inbox" : "Welcome back"}
        subtitle={step === "code"
          ? "Confirm it's you to keep your account secure"
          : "Sign in to keep every renewal in view"}
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
              onBack={handleStartOver}
              backLabel="Use a different account"
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
              placeholder="Enter your password"
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
              error={errors.password}
            />

            <Link href={{ pathname: "/(auth)/forgot-password", params: { email: email.trim() } }} asChild>
              <Pressable className="auth-forgot" accessibilityRole="link" hitSlop={8}>
                <Text className="auth-link">Forgot password?</Text>
              </Pressable>
            </Link>

            <AuthButton title="Sign in" onPress={handleSignIn} loading={submitting} disabled={isBusy} />
          </View>
        )}

        <View className="auth-link-row">
          <Text className="auth-link-copy">New to Resencly?</Text>
          <Link href="/(auth)/sign-up" replace asChild>
            <Pressable accessibilityRole="link" hitSlop={8}>
              <Text className="auth-link">Create an account</Text>
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
