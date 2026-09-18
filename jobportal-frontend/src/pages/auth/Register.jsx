import { RegisterForm } from "@/components/forms/RegisterForm";

export function Register() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-center text-xl font-semibold text-ink-900">
        Create your account
      </h1>
      <p className="mt-1 text-center text-sm text-ink-500">
        Join as a candidate or start hiring.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}