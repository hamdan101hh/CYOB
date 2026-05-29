#!/usr/bin/env node
/**
 * Prints auth/SMTP config (no secrets). Needs SUPABASE_ACCESS_TOKEN in env or .env.local
 *   node scripts/check-supabase-auth.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REF = "uxwrbupzrhrdktmrxyat";

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = val;
  }
  return out;
}

const token = (
  process.env.SUPABASE_ACCESS_TOKEN ??
  parseEnvFile(resolve(ROOT, ".env.local")).SUPABASE_ACCESS_TOKEN
)?.trim();

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/config/auth`,
  { headers: { Authorization: `Bearer ${token}` } },
);
const data = await res.json();
if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

console.log("\nSupabase auth config (project", REF, "):\n");
console.log("  external_email_enabled:", data.external_email_enabled);
console.log("  smtp_host:", JSON.stringify(data.smtp_host));
console.log("  smtp_port:", data.smtp_port);
console.log("  smtp_user:", JSON.stringify(data.smtp_user));
console.log("  smtp_admin_email:", data.smtp_admin_email);
console.log("  smtp_sender_name:", data.smtp_sender_name);
console.log("  smtp_pass set:", Boolean(data.smtp_pass));
console.log("  mailer_autoconfirm:", data.mailer_autoconfirm);
console.log("  mailer_otp_length:", data.mailer_otp_length);
console.log("  mailer_otp_exp:", data.mailer_otp_exp);
console.log("\nIf smtp_host is empty, custom SMTP is not saved. Fix in dashboard or Resend integration.\n");
