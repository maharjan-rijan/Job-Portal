import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-brand-500">404</p>
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="text-sm text-ink-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        Back home
      </Link>
    </div>
  );
}
