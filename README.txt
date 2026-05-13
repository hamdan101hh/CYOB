cyob.live — PROTOTYPE v1.0
============================

Tuesday, 12 May 2026
Internal use · Path D · static prototype

This folder contains the complete cyob.live prototype.
Everything works in the browser. No server, no database, no API keys needed.

============================
WHAT'S IN THIS FOLDER
============================

index.html       — Landing page + 9-step intake popup with email verification
preparing.html   — "Your dashboard is being prepared" loading screen
dashboard.html   — The premium command center (dynamic to user's intake)
plan.html        — Full strategic plan: trends, gaps, strategy, 6-month roadmap
library.html     — Visual content library: 4 campaigns with AI image renders
pricing.html     — Free / Spark / Studio / Enterprise tiers
login.html       — Login flow with email + password + OTP
admin.html       — Your private admin control panel
style.css        — Master design system
app.js           — Engine: intake storage, plan generation, refresh prompts
README.txt       — This file

============================
HOW TO TEST LOCALLY (BEFORE DEPLOY)
============================

OPTION A — DOUBLE-CLICK
1. Open this folder in your file explorer
2. Double-click index.html
3. Your browser opens the platform
4. Test the full flow: intake → preparing → dashboard → plan → library

That's literally it. Everything runs in your browser.

OPTION B — SLIGHTLY MORE PROFESSIONAL
1. Install VS Code (free, from code.visualstudio.com)
2. Install the "Live Server" extension
3. Right-click index.html → "Open with Live Server"
4. Test in browser at http://localhost:5500


============================
HOW TO DEPLOY TO cyob.live (5 MINUTES)
============================

EASIEST PATH — VERCEL (RECOMMENDED)

Step 1 — Sign up for Vercel
  Go to vercel.com
  Click "Sign Up"
  Use your GitHub, Google, or email — any works
  This is free, no credit card needed

Step 2 — Deploy
  On the Vercel dashboard, click "Add New..." → "Project"
  Look for the "Deploy" section
  Click "Browse" or drag this entire cyob folder onto the upload area
  Wait ~30 seconds while Vercel deploys
  You'll get a live URL like cyob-xyz123.vercel.app
  Open it — your platform is LIVE on the internet

Step 3 — Point cyob.live to Vercel
  In Vercel: go to your project → "Settings" → "Domains"
  Click "Add" → type "cyob.live" → "Add"
  Vercel will show you DNS records to add (an A record and CNAME)

  Now go to wherever you bought cyob.live (Namecheap, GoDaddy, Cloudflare):
  Find DNS settings
  Add the records Vercel showed you
  Save

  Wait 5-30 minutes for DNS to propagate
  cyob.live will now show your platform


ALTERNATIVE — NETLIFY (ALSO 5 MINUTES)

Step 1 — Go to app.netlify.com/drop
Step 2 — Drag the cyob folder onto the page
Step 3 — Done. You get a URL like cyob-abc.netlify.app
Step 4 — Add cyob.live as a custom domain in Netlify settings


ALTERNATIVE — CLOUDFLARE PAGES (FAST, GLOBAL CDN)

Step 1 — Go to pages.cloudflare.com
Step 2 — Sign up free
Step 3 — Click "Upload assets" → drag this folder
Step 4 — Custom domain → add cyob.live (free SSL included)


============================
HOW IT WORKS (FOR YOU)
============================

1. A visitor arrives at cyob.live
2. They click "Start the intake"
3. A premium modal opens with 9 steps:
   - Company name
   - Industry (12 choices + custom)
   - Geography (8 regions + city)
   - Size (5 tiers)
   - Brand vibe (7 styles)
   - Audience (free text + type)
   - Budget tier
   - Email
   - 6-digit code verification (demo: any 6 digits works)
4. Their data saves to their browser (localStorage)
5. They see the "preparing" screen with 10 bots running for ~30 seconds
6. They land on a fully personalized dashboard
7. Every section is clickable, every campaign expandable
8. The refresh button copies a custom prompt + opens claude.ai
9. They can browse plan, library, pricing
10. The admin page at /admin.html shows you the simulated user list


============================
WHAT'S MOCKED (BE HONEST WITH YOURSELF)
============================

This is a PROTOTYPE. It looks and feels real, but:

WHAT WORKS FOR REAL:
✓ Full intake flow
✓ Email verification UI (any code accepts in demo)
✓ Plan generation (template-based, industry-aware)
✓ Dashboard with all sections
✓ Content library with SVG-generated visuals
✓ Copy-paste AI prompts (genuinely usable in DALL-E, Midjourney, Sora, etc.)
✓ Pricing page with monthly/annual toggle
✓ Login flow
✓ Admin control panel
✓ Refresh button (copies real prompt, opens Claude)
✓ Print to PDF (real, from plan.html)

WHAT'S SIMULATED (NEEDS REAL BACKEND IN v2):
✗ No emails actually send (no Resend integration)
✗ No real password hashing (data is in browser only)
✗ No real AI image generation (SVG placeholders that look like real cinematic stills)
✗ No real Stripe charges (upgrade buttons are demo)
✗ No real Supabase database (browser localStorage only)
✗ Plan content is template-driven, not LLM-generated per user

WHY THIS IS THE RIGHT MOVE FOR v1:
- Costs $0 to run forever
- Looks indistinguishable from a real platform
- You can pitch enterprise clients with this TODAY
- When you're ready for real backend, the frontend is done


============================
LIMITATIONS YOU SHOULD KNOW
============================

DATA RESETS WHEN COOKIES CLEAR
Users' plans live in their browser localStorage. If they clear cookies or use
a different device, their plan is gone. For v1 testing this is fine. For real
SaaS, we need Supabase.

NO LEAD CAPTURE TO YOUR INBOX
The intake doesn't actually email you. To get leads emailed to
hamdaaninh101@gmail.com and hamdan@gigh.com, we need either:
  (a) A free Formspree integration (5-minute add later)
  (b) The real Next.js + Resend backend (v2)

NO ACTUAL LOGINS
Anyone who fills the intake "creates an account" but it only exists in
their browser. The login page accepts any password + any 6-digit code for
demo purposes. Real auth = Supabase = v2.


============================
NEXT STEPS
============================

PHASE 1 (NOW): Deploy this prototype
  - Drop on Vercel/Netlify/Cloudflare Pages
  - Point cyob.live at it
  - Test the full flow
  - Show 5 people you trust

PHASE 2 (WEEK 2-3): Validate
  - Use this in real pitches
  - Run yourself + clients through the intake
  - See where people drop off
  - Note what they ask for that's missing

PHASE 3 (MONTH 2): Add real backend
  - Sign up for: Vercel, Supabase, Resend, Stripe, Anthropic, OpenAI, Apify, fal.ai
  - Convert this static prototype to Next.js
  - Wire real Claude API for plan generation
  - Real Stripe checkout
  - Real database
  - Real emails

The frontend you have now plugs directly into v2. None of this is wasted.


============================
QUICK FIX — IF SOMETHING BREAKS
============================

If a page looks broken or empty:
1. Open browser DevTools (F12 or Cmd+Opt+I)
2. Go to "Application" tab → "Local Storage"
3. Click "Clear All"
4. Refresh the page

This resets the demo to a clean state.


============================
SUPPORT
============================

If you're reading this and confused, you can:
1. Open a new Claude chat
2. Paste: "I'm working on the cyob.live prototype. [your question]"
3. Claude will help

Or skim the Stack Contract v1.0 from the previous conversation for the
full architecture and deploy plan.


============================
SHIP IT
============================

You don't need to be technical to deploy this.
You don't need to wait for anything.
The hardest part was making the decisions — and you already did that.

cyob.live is ready. Deploy when you're ready.

— end —
