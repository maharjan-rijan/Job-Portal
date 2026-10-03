/**
 * Password strength scoring, shared by PasswordStrengthIndicator.
 * Pure function — no React — so it can also be reused inside a Zod
 * `.refine()` later if weak passwords should be blocked outright.
 */
export const PASSWORD_STRENGTH = {
  WEAK: "weak",
  MEDIUM: "medium",
  STRONG: "strong",
};

/**
 * @param {string} password
 * @returns {"weak"|"medium"|"strong"|null} null when empty, so callers
 *   can hide the indicator before the user starts typing.
 */
export function getPasswordStrength(password = "") {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 6 || score <= 2) return PASSWORD_STRENGTH.WEAK;
  if (score <= 3) return PASSWORD_STRENGTH.MEDIUM;
  return PASSWORD_STRENGTH.STRONG;
}

/** Visual config per strength level — bar color, text color, label. */
export const STRENGTH_CONFIG = {
  [PASSWORD_STRENGTH.WEAK]: {
    label: "Weak password",
    barColor: "bg-red-500",
    textColor: "text-red-600",
    level: 1,
  },
  [PASSWORD_STRENGTH.MEDIUM]: {
    label: "Medium strength",
    barColor: "bg-yellow-500",
    textColor: "text-yellow-600",
    level: 2,
  },
  [PASSWORD_STRENGTH.STRONG]: {
    label: "Strong password",
    barColor: "bg-green-500",
    textColor: "text-green-600",
    level: 3,
  },
};
