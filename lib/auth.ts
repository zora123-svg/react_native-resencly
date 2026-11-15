import { isClerkAPIResponseError } from "@clerk/expo";
import type { SetActiveNavigate } from "@clerk/expo/types";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;

export const GENERIC_AUTH_ERROR = "Something went wrong. Check your connection and try again.";
export const PENDING_TASK_ERROR = "Your account needs one more setup step before you can continue. Please contact support.";

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (value) => value.length >= 8 },
  { id: "letter", label: "One letter", test: (value) => /[A-Za-z]/.test(value) },
  { id: "number", label: "One number", test: (value) => /\d/.test(value) },
];

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
};

// Sign in only needs a value, the server decides whether it's correct
export const validatePassword = (value: string): string | undefined =>
  value ? undefined : "Enter your password.";

export const validateNewPassword = (value: string): string | undefined => {
  if (!value) return "Create a password.";
  return PASSWORD_RULES.every((rule) => rule.test(value))
    ? undefined
    : "Your password doesn't meet the requirements yet.";
};

export const validateCode = (value: string): string | undefined =>
  CODE_PATTERN.test(value) ? undefined : "Enter the 6-digit code from your email.";

// Keeps only digits so pasted codes like "123 456" still work
export const sanitizeCode = (value: string): string => value.replace(/\D/g, "").slice(0, 6);

// Brand-voice copy for the error codes the auth API returns, so raw vendor text never reaches the user
const AUTH_ERRORS: Record<string, { field: AuthErrorField; message: string }> = {
  form_identifier_not_found: { field: "email", message: "We couldn't find an account with this email." },
  form_identifier_exists: { field: "email", message: "An account with this email already exists. Sign in instead." },
  form_param_format_invalid: { field: "email", message: "Enter a valid email address." },
  form_password_incorrect: { field: "password", message: "That password isn't right. Try again or reset it." },
  form_password_pwned: { field: "password", message: "This password appeared in a known data breach. Please choose a different one." },
  form_password_length_too_short: { field: "password", message: "Use at least 8 characters." },
  form_password_validation_failed: { field: "password", message: "That password isn't right. Try again or reset it." },
  form_password_not_strong_enough: { field: "password", message: "Choose a stronger password." },
  form_code_incorrect: { field: "code", message: "That code isn't right. Check your email and try again." },
  verification_expired: { field: "code", message: "That code has expired. Request a new one." },
  verification_failed: { field: "code", message: "Too many incorrect attempts. Request a new code." },
  too_many_requests: { field: "form", message: "Too many attempts. Please wait a moment and try again." },
  user_locked: { field: "form", message: "This account is temporarily locked after too many attempts. Please try again later." },
};

const getAuthErrorCode = (error: unknown): string | undefined => {
  if (isClerkAPIResponseError(error)) return error.errors[0]?.code;
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") return error.code;
  return undefined;
};

/**
 * Maps an auth error to the form field it belongs to and a message written in the app's voice.
 */
export const resolveAuthError = (error: unknown): { field: AuthErrorField; message: string } => {
  const code = getAuthErrorCode(error);
  return (code && AUTH_ERRORS[code]) || { field: "form", message: GENERIC_AUTH_ERROR };
};

export const notifyAuthError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
};

/**
 * Builds the finalize() navigate callback. The root Stack.Protected guards move the user
 * into the app once the session is active, so we only need to catch pending session tasks.
 */
export const createAuthNavigate = (onPendingTask: () => void): SetActiveNavigate => ({ session }) => {
  if (session?.currentTask) onPendingTask();
};

/**
 * Counts down the seconds before a verification code can be resent.
 */
export const useResendCooldown = (seconds = 30) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return { remaining, start: () => setRemaining(seconds) };
};
