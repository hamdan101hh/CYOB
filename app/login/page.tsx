import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 md:px-10">
      <p className="text-sm text-[var(--text-3)]">Login</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-[var(--text)]">
        Email + OTP
      </h1>
      <p className="mt-3 text-[var(--text-2)]">
        Sign in to access saved runs and paid tiers.
      </p>
      <LoginForm />
    </div>
  );
}
