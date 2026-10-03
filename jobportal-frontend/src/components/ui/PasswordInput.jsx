import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextInput } from "@/components/ui/TextInput";

/**
 * TextInput + show/hide toggle, extracted from the identical markup that
 * used to be copy-pasted into RegisterForm, ChangePasswordForm,
 * ResetPasswordForm and LoginForm (8 copies of the same eye-icon button).
 * Behaves like TextInput — forwardRef, same props — just always
 * type="password"/"text" instead of accepting a `type` prop.
 */
export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput
        ref={ref}
        label={label}
        type={visible ? "text" : "password"}
        error={error}
        className={className}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
});
