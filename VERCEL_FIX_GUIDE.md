# Fix for ERR_CONNECTION_RESET on Vercel

## Problem
Your Vercel deployment shows `ERR_CONNECTION_RESET`, which means the serverless function is crashing at runtime. This is almost always caused by **missing environment variables**.

## Step-by-Step Fix

### 1. Check Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `TradeNudes` or `trade-nude`
3. Go to **Settings** → **Environment Variables**
4. Verify these variables are set:

   **Required Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (NOT the anon key!)

   **Optional (for admin routes):**
   - `ADMIN_SECRET` or `NEXT_PUBLIC_ADMIN_SECRET` - Secret for admin authentication

### 2. Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (NOT anon key!) → Use for `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **Important**: Use the `service_role` key, not the `anon` key!

### 3. Add Environment Variables in Vercel

1. In Vercel, go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

4. Repeat for `SUPABASE_SERVICE_ROLE_KEY`

### 4. Redeploy

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### 5. Test the Health Check Endpoint

After redeploying, test:
```
https://your-app.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": {
    "NEXT_PUBLIC_SUPABASE_URL": "✓ Set",
    "SUPABASE_SERVICE_ROLE_KEY": "✓ Set"
  },
  "message": "API is running"
}
```

If you see "✗ Missing" for any variable, it's not set correctly.

### 6. Check Vercel Function Logs

If it still doesn't work:

1. Go to **Deployments** → Click on your deployment
2. Go to **Functions** tab
3. Click on a function (e.g., `/api/profiles`)
4. Check the **Logs** tab for error messages

Look for errors like:
- "Missing required environment variables"
- "Failed to create Supabase client"
- Any stack traces

## Common Issues

### Issue 1: Using Anon Key Instead of Service Role Key
- ❌ **Wrong**: Using `anon` key from Supabase
- ✅ **Correct**: Use `service_role` key (found in Supabase Settings → API)

### Issue 2: Environment Variables Not Applied
- Make sure you selected **Production**, **Preview**, AND **Development** environments
- After adding variables, you MUST redeploy

### Issue 3: Wrong Variable Names
- Must be exactly: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Case-sensitive!

## Quick Test Commands

After fixing, test these endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Profiles endpoint
curl https://your-app.vercel.app/api/profiles
```

## Still Not Working?

1. Check Vercel Function Logs (most important!)
2. Verify environment variables are set correctly
3. Make sure you're using `service_role` key, not `anon` key
4. Try the health endpoint first: `/api/health`
