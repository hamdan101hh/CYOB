#!/usr/bin/env node
/**
 * Applies migration 000002 + auth URLs for cyob (Supabase project uxwrbupzrhrdktmrxyat).
 *
 * PowerShell:
 *   $env:SUPABASE_ACCESS_TOKEN = "paste from https://supabase.com/dashboard/account/tokens"
 *   node scripts/supabase-batch.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SUPABASE_REF = "uxwrbupzrhrdktmrxyat";
const APP_URL = "https://cyob.site";

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

const local = parseEnvFile(resolve(ROOT, ".env.local"));
const token = (
  process.env.SUPABASE_ACCESS_TOKEN ?? local.SUPABASE_ACCESS_TOKEN
)?.trim();
if (!token) {
  console.error(
    "\nSet SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)\n",
  );
  process.exit(1);
}

async function mgmt(path, opts = {}) {
  const res = await fetch(`https://api.supabase.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `${opts.method ?? "GET"} ${path} → ${res.status}: ${JSON.stringify(data)}`,
    );
  }
  return data;
}

const migrationSql = readFileSync(
  resolve(ROOT, "supabase/migrations/000002_runs_created_at_and_policies.sql"),
  "utf8",
);

const redirects = [
  "http://localhost:3000/auth/callback",
  `${APP_URL}/auth/callback`,
  "https://www.cyob.site/auth/callback",
  "https://cyob-k28y.vercel.app/auth/callback",
].join(",");

console.log("\n▶ Applying migration 000002…");
try {
  await mgmt(`/v1/projects/${SUPABASE_REF}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: migrationSql }),
  });
  console.log("  ✓ migration SQL executed");
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("403")) {
    console.log(
      "  ⚠ API cannot run SQL on your account (403). Use Supabase → SQL Editor instead:",
    );
    console.log(
      "    supabase/migrations/000002_runs_created_at_and_policies.sql",
    );
  } else {
    throw e;
  }
}

const codeOnly = (title) =>
  `<h2>${title}</h2>
<p>Your sign-in code:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:0.2em;margin:24px 0">{{ .Token }}</p>
<p>Open ${APP_URL}/login in the same browser, enter your email, then paste this code.</p>
<p>This code expires in 10 minutes. Do not share it.</p>`;

console.log("▶ Auth URLs + OTP email (code only, 6 digits, 3 min expiry)…");
await mgmt(`/v1/projects/${SUPABASE_REF}/config/auth`, {
  method: "PATCH",
  body: JSON.stringify({
    site_url: APP_URL,
    uri_allow_list: redirects,
    mailer_otp_length: 6,
    mailer_otp_exp: 600,
    mailer_subjects_magic_link: "Your cyob sign-in code",
    mailer_templates_magic_link_content: codeOnly("Your cyob sign-in code"),
    mailer_subjects_confirmation: "Your cyob sign-in code",
    mailer_templates_confirmation_content: codeOnly("Welcome to cyob"),
  }),
});
console.log("  ✓ auth URLs + email templates updated");

console.log("\n✅ Supabase batch done. Test login:");
console.log(`   ${APP_URL}/login\n`);