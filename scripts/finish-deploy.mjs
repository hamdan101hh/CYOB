#!/usr/bin/env node
/**
 * One-shot: Vercel env vars + Next.js settings + production deploy + Supabase auth URLs.
 *
 * Usage (PowerShell):
 *   $env:VERCEL_TOKEN = "paste from https://vercel.com/account/tokens"
 *   $env:SUPABASE_ACCESS_TOKEN = "paste from https://supabase.com/dashboard/account/tokens"
 *   node scripts/finish-deploy.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PROJECT_NAME = "cyob-k28y";
const SUPABASE_REF = "uxwrbupzrhrdktmrxyat";
const PRODUCTION_BRANCH = "production";
const APP_URL = "https://cyob.site";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN?.trim();
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN?.trim();

function fail(msg) {
  console.error(`\n❌ ${msg}`);
  process.exit(1);
}

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function vercel(path, opts = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
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
      `Vercel ${opts.method ?? "GET"} ${path} → ${res.status}: ${JSON.stringify(data)}`,
    );
  }
  return data;
}

async function supabaseMgmt(path, opts = {}) {
  const res = await fetch(`https://api.supabase.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
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
      `Supabase ${opts.method ?? "GET"} ${path} → ${res.status}: ${JSON.stringify(data)}`,
    );
  }
  return data;
}

async function upsertVercelEnv(projectId, key, value, targets) {
  const existing = await vercel(`/v9/projects/${projectId}/env`);
  const found = (existing.envs ?? []).find((e) => e.key === key);
  if (found) {
    await vercel(`/v9/projects/${projectId}/env/${found.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        value,
        target: targets,
        type: "encrypted",
      }),
    });
    console.log(`  ↻ updated ${key}`);
  } else {
    await vercel(`/v10/projects/${projectId}/env`, {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        target: targets,
        type: "encrypted",
      }),
    });
    console.log(`  + added ${key}`);
  }
}

async function main() {
  if (!VERCEL_TOKEN) {
    fail(
      "Set VERCEL_TOKEN (create at https://vercel.com/account/tokens — scope: Full Account)",
    );
  }

  const local = parseEnvFile(resolve(ROOT, ".env.local"));
  const cronSecret =
    local.CRON_SECRET?.trim() ||
    randomBytes(32).toString("base64url");

  const envToSet = {
    NEXT_PUBLIC_APP_URL: APP_URL,
    ADMIN_EMAILS:
      local.ADMIN_EMAILS || "createyourownbot.ai@gmail.com",
    BOSS_EMAIL: local.BOSS_EMAIL || "hamdaaninh101@gmail.com",
    NEXT_PUBLIC_SUPABASE_URL: local.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: local.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: local.SUPABASE_SERVICE_ROLE_KEY,
    CRON_SECRET: cronSecret,
  };

  for (const [k, v] of Object.entries(envToSet)) {
    if (!v) fail(`Missing ${k} in .env.local`);
  }

  console.log("\n▶ Vercel: load project…");
  const project = await vercel(`/v9/projects/${PROJECT_NAME}`);
  const projectId = project.id;
  const teamId = project.accountId;

  console.log("▶ Vercel: set framework + build (Next.js)…");
  await vercel(`/v9/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify({
      framework: "nextjs",
      buildCommand: "npm run build",
      installCommand: "npm install",
      outputDirectory: null,
      nodeVersion: "20.x",
    }),
  });

  console.log(
    "▶ Vercel: production branch (set manually in Environments if still main)",
  );

  console.log("▶ Vercel: environment variables (production + preview)…");
  const targets = ["production", "preview"];
  for (const [key, value] of Object.entries(envToSet)) {
    await upsertVercelEnv(projectId, key, value, targets);
  }

  console.log("▶ Vercel: trigger production deployment…");
  const deploy = await vercel(
    teamId ? `/v13/deployments?teamId=${teamId}` : "/v13/deployments",
    {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        project: projectId,
        target: "production",
        gitSource: {
          type: "github",
          repoId: project.link?.repoId,
          ref: PRODUCTION_BRANCH,
        },
      }),
    },
  );
  console.log(`  deployment: ${deploy.url ?? deploy.id}`);

  if (SUPABASE_ACCESS_TOKEN) {
    console.log("▶ Supabase: auth redirect URLs…");
    const redirects = [
      "http://localhost:3000/auth/callback",
      `${APP_URL}/auth/callback`,
      `https://www.cyob.site/auth/callback`,
      "https://cyob-k28y.vercel.app/auth/callback",
    ].join(",");

    await supabaseMgmt(`/v1/projects/${SUPABASE_REF}/config/auth`, {
      method: "PATCH",
      body: JSON.stringify({
        site_url: APP_URL,
        uri_allow_list: redirects,
      }),
    });
    console.log("  ✓ site_url + uri_allow_list updated");
  } else {
    console.log(
      "\n⚠ Skipped Supabase (set SUPABASE_ACCESS_TOKEN to configure auth URLs automatically)",
    );
  }

  console.log("\n✅ Done. In ~2 min check:");
  console.log(`   ${APP_URL}/login`);
  console.log(`   (homepage should mention “Skip login (local demo)”)\n`);
  if (!local.CRON_SECRET?.trim()) {
    console.log(
      `Add to .env.local:\nCRON_SECRET=${cronSecret}\n`,
    );
  }
}

main().catch((e) => fail(e.message));
