# Debugging Guide: Application Not Loading on Vercel

## Current Status
✅ **API is working**: `/api/profiles` returns data successfully  
❌ **Frontend not loading**: Root URL (`/`) shows `ERR_CONNECTION_RESET`

## Step-by-Step Debugging

### 1. Check Vercel Function Logs (MOST IMPORTANT)

1. Go to **Vercel Dashboard** → Your Project
2. Click on the latest **Deployment**
3. Go to **Functions** tab
4. Look for functions like:
   - `GET /` (the home page)
   - `GET /api/profiles` (this one works)
5. Click on `GET /` and check the **Logs** tab
6. Look for error messages

**What to look for:**
- JavaScript errors
- Import errors
- Component errors
- "Cannot find module" errors
- Any stack traces

### 2. Test These URLs

Test each URL to see which ones work:

```bash
# Test endpoints (should all work)
https://trade-nude.vercel.app/api/health
https://trade-nude.vercel.app/api/profiles
https://trade-nude.vercel.app/api/test

# Test pages (might fail)
https://trade-nude.vercel.app/
https://trade-nude.vercel.app/boys
https://trade-nude.vercel.app/girls
```

### 3. Check Browser Console

1. Open your site: `https://trade-nude.vercel.app`
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Look for JavaScript errors
5. Go to **Network** tab
6. Reload the page
7. Check which requests fail

### 4. Common Issues & Fixes

#### Issue 1: Component Import Error
**Symptom**: Logs show "Cannot find module" or "Failed to import"

**Fix**: Check if all components exist:
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/profile/ProfileCard.tsx`
- `components/common/EmptyState.tsx`

#### Issue 2: Image Loading Error
**Symptom**: Logs mention image loading failures

**Fix**: Check if `/logo/logo1.png` exists in `public/logo/` folder

#### Issue 3: Client Component Error
**Symptom**: Hydration mismatch or client-side error

**Fix**: All components using `window` or browser APIs should be in `useEffect`

#### Issue 4: Build Configuration
**Symptom**: Build succeeds but page doesn't load

**Fix**: Check `next.config.js` or `next.config.mjs` for issues

### 5. Quick Fixes to Try

#### Fix A: Add Error Boundary

Create `app/error.tsx`:
```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

#### Fix B: Check for Missing Dependencies

Run locally:
```bash
npm install
npm run build
```

If build fails locally, fix those errors first.

#### Fix C: Verify All Imports

Check that all imports in `app/page.tsx` are correct:
- `ProfileCard` exists
- `EmptyState` exists
- `getProfiles` function exists

### 6. Check Vercel Build Logs

1. Go to **Deployments** → Latest deployment
2. Click **Build Logs**
3. Look for:
   - Warnings about missing files
   - Import errors
   - TypeScript errors
   - Build failures

### 7. Test Locally First

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

If it works locally but not on Vercel, it's an environment or deployment issue.

### 8. Nuclear Option: Simplify the Page

If nothing works, temporarily simplify `app/page.tsx` to test:

```tsx
"use client";

export default function HomePage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>If you see this, the page is working!</p>
    </div>
  );
}
```

If this works, gradually add back components to find the problematic one.

## What to Share for Help

If you need help, share:
1. **Vercel Function Logs** (screenshot or copy/paste)
2. **Browser Console Errors** (screenshot)
3. **Network Tab** showing failed requests
4. **Build Logs** from Vercel
5. **Local build output** (`npm run build`)

## Expected Behavior

After fixing, you should see:
- ✅ Home page loads at `https://trade-nude.vercel.app/`
- ✅ Profiles display correctly
- ✅ No errors in browser console
- ✅ No errors in Vercel logs
