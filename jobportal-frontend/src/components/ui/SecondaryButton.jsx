import { Button } from "@/components/ui/Button";

/**
 * Convenience wrapper around <Button variant="secondary" />, for the
 * lower-emphasis action next to a PrimaryButton (e.g. "Cancel" next to
 * "Save changes").
 */
export function SecondaryButton({ variant: _variant, ...props }) {
  return <Button variant="secondary" {...props} />;
}
