import { useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * Row of single-digit boxes for a one-time code. Controlled: `value` is the
 * whole code as a string, `onChange` receives the new string. Supports typing
 * (auto-advance), Backspace, arrow keys and pasting the full code.
 */
export function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled,
  hasError,
  autoFocus,
}) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusBox = (index) =>
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const setDigits = (next) => onChange?.(next.join("").slice(0, length));

  const handleChange = (index, event) => {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) return;
    // Typing (or autofill) can deliver more than one digit — spread them across boxes.
    const next = [...digits];
    typed.split("").forEach((char, offset) => {
      if (index + offset < length) next[index + offset] = char;
    });
    setDigits(next);
    focusBox(index + typed.length);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = "";
        setDigits(next);
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      focusBox(index + 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange?.(pasted);
    focusBox(pasted.length);
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} of ${length}`}
          maxLength={length}
          className={cn(
            "h-12 w-10 rounded-lg border bg-surface text-center text-lg font-semibold text-text sm:h-14 sm:w-12",
            "focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30",
            hasError ? "border-red-500" : "border-primary/20",
            disabled && "opacity-60",
          )}
        />
      ))}
    </div>
  );
}
