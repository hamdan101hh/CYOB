import { Resend } from "resend";

import { env } from "@/lib/env";

let client: Resend | null = null;

function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}

const defaultFrom = "cyob <onboarding@resend.dev>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ sent: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { sent: false, error: "Resend not configured" };
  }

  const { data, error } = await resend.emails.send({
    from: params.from ?? defaultFrom,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    return { sent: false, error: error.message };
  }

  return { sent: true, id: data?.id };
}
