import { Button } from "@/components/ui/Button";

/**
 * Convenience wrapper around <Button variant="primary" />. Use this when a
 * call site should always render the primary action style and shouldn't be
 * able to accidentally switch variants.
 */
export function PrimaryButton({ variant: _variant, ...props }) {
  return <Button variant="primary" {...props} />;
}
