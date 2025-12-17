# Stripe Webhook Setup Guide

## Overview
The webhook automatically creates Supabase user accounts when customers complete payment.

## Step 1: Add Environment Variables

Add these to your `.env.local`:

```
# Stripe Webhook Secret (get from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Supabase Service Role Key (get from Supabase Dashboard → Settings → API)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...YOUR_SERVICE_ROLE_KEY
```

⚠️ **NEVER expose the service role key to the client!** It bypasses all security.

---

## Step 2: Set Up Stripe Webhook (Production)

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://haulverify.com/api/webhooks/stripe`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired` (optional)
   - ✅ `payment_intent.payment_failed` (optional)
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## Step 3: Test Locally with Stripe CLI

### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### Login to Stripe
```bash
stripe login
```

### Forward webhooks to localhost
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

This will give you a temporary webhook secret for testing (starts with `whsec_`).
Use this secret in `.env.local` for local testing.

### Trigger a test event
```bash
stripe trigger checkout.session.completed
```

---

## Step 4: Get Supabase Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy the **service_role** key (NOT the anon key!)
5. Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 5: Deploy to Vercel

After deployment, update the Stripe webhook endpoint URL to your production domain.

---

## What the Webhook Does

When `checkout.session.completed` fires:

1. ✅ Verifies Stripe signature (security)
2. ✅ Extracts customer email from session
3. ✅ Checks if user exists in Supabase
4. ✅ If exists: Updates user metadata with V1 access
5. ✅ If new: Creates user with V1 access, sends magic link
6. ✅ Stores: `has_v1_access`, `stripe_customer_id`, `purchase_date`

---

## Troubleshooting

### "Invalid signature" error
- Make sure `STRIPE_WEBHOOK_SECRET` matches your endpoint's signing secret
- For local testing, use the secret from `stripe listen` command

### User not created
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Supabase logs in dashboard

### Webhook not firing
- Verify endpoint URL is correct in Stripe Dashboard
- Check Stripe webhook logs for failures

---

## Testing Checklist

- [ ] Stripe CLI installed
- [ ] `stripe listen` running
- [ ] Environment variables set
- [ ] Trigger test: `stripe trigger checkout.session.completed`
- [ ] Check terminal logs for success messages
- [ ] Verify user created in Supabase Auth dashboard

