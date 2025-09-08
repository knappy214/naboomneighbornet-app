import * as LocalAuthentication from "expo-local-authentication";

/**
 * Prompts biometric auth when available. Returns true if authenticated or not required.
 * Use to gate sensitive mutations (profile save, logout, password change, etc.).
 */
export async function requireBiometric(reason = "Confirm your identity") {
  try {
    const hw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hw || !enrolled) return true;
    const res = await LocalAuthentication.authenticateAsync({ 
      promptMessage: reason, 
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel" 
    });
    return !!res.success;
  } catch {
    return true; // fail-open to avoid lockouts; log with Sentry in production
  }
}
