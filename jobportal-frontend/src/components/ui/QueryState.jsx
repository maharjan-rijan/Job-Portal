import { Spinner } from "@/components/ui/Spinner";

export function QueryState({ isLoading, isError, error, errorLabel = "Could not load this", children }) {
  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-red-600">
        {errorLabel}
        {error?.message ? `: ${error.message}` : "."}
      </p>
    );
  }

  return children;
}
