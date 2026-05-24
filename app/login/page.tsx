import { Suspense } from "react";

import { LoginAuthNotice } from "@/components/login/login-auth-notice";
import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="page-wrap-narrow">
      <p className="eyebrow">Login</p>
      <h1 className="page-title">Sign in to cyob</h1>
      <p className="page-lead">
        Save runs, unlock tiers, and return to your war room anytime.
      </p>
      <Suspense fallback={null}>
        <LoginAuthNotice />
      </Suspense>
      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
