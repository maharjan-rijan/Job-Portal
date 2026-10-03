import { getPasswordStrength, STRENGTH_CONFIG } from "@/utils/passwordStrength";

/**
 * Validation 1 — live password-strength meter.
 * Place directly under the password <PasswordInput> and pass the
 * current field value (react-hook-form's `watch("password")`).
 * Renders nothing until the user types something.
 */
export function PasswordStrengthIndicator({ password }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;

  const config = STRENGTH_CONFIG[strength];

  return (
    <div className="-mt-2 space-y-1.5" role="status" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              bar <= config.level ? config.barColor : "bg-primary/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${config.textColor}`}>{config.label}</p>
    </div>
  );
}
