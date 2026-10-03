/**
 * Validation 2 — live confirm-password match indicator.
 * Place directly under the confirm-password <PasswordInput>.
 * Renders nothing until the user starts typing in the confirm field.
 */
export function PasswordMatchIndicator({ password, confirmPassword }) {
  if (!confirmPassword) return null;

  const matches = password === confirmPassword;

  return (
    <p
      className={`-mt-2 text-xs font-medium ${
        matches ? "text-green-600" : "text-red-600"
      }`}
      role="status"
      aria-live="polite"
    >
      {matches ? "Password Match" : "Password do not match"}
    </p>
  );
}
