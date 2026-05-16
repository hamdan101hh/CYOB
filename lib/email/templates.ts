import type { RunBundle } from "@/lib/data/get-run";

const appName = "cyob";

export function otpEmailTemplate(token: string) {
  return {
    subject: "Your cyob verification code",
    html: `<p>Your ${appName} verification code is:</p><h1>${token}</h1><p>Enter this in the cyob app.</p>`,
  };
}

export function planReadyEmailTemplate(bundle: RunBundle) {
  return {
    subject: `Your cyob strategy for ${bundle.intake.company} is ready`,
    html: `<p>Your strategic intelligence dashboard is live.</p><p><strong>${bundle.intake.company}</strong> — ${bundle.intake.industry}, ${bundle.intake.geography}</p>`,
  };
}

export function dailyBossSummaryTemplate(params: {
  runCount: number;
  spendCents: number;
  warnings: string[];
}) {
  const warnings = params.warnings.length
    ? params.warnings.map((w) => `<li>${w}</li>`).join("")
    : "<li>No warnings.</li>";

  return {
    subject: "cyob daily boss summary",
    html: `<h2>cyob daily summary</h2><p>Runs: ${params.runCount}</p><p>Spend: $${(params.spendCents / 100).toFixed(2)}</p><ul>${warnings}</ul>`,
  };
}
