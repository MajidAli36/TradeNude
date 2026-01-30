/**
 * Admin Authentication Utilities
 * 
 * Admin secret can be set via:
 * 1. Environment variable: NEXT_PUBLIC_ADMIN_SECRET
 * 2. localStorage: 'admin_secret'
 * 3. Manual entry via prompt (for development)
 */

const ADMIN_SECRET_KEY = "admin_secret";

/**
 * Get admin secret from various sources
 */
export function getAdminSecret(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Priority 1: Environment variable (client-side check)
  if (typeof window !== "undefined") {
    const envSecret = (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_ADMIN_SECRET;
    if (envSecret) {
      return envSecret;
    }
  }
  
  // Server-side check
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_SECRET) {
    return process.env.NEXT_PUBLIC_ADMIN_SECRET;
  }

  // Priority 2: localStorage
  try {
    const stored = localStorage.getItem(ADMIN_SECRET_KEY);
    if (stored) {
      return stored;
    }
  } catch (error) {
    console.error("Error reading admin secret from localStorage:", error);
  }

  return null;
}

/**
 * Set admin secret in localStorage
 */
export function setAdminSecret(secret: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(ADMIN_SECRET_KEY, secret);
  } catch (error) {
    console.error("Error saving admin secret to localStorage:", error);
  }
}

/**
 * Clear admin secret
 */
export function clearAdminSecret(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ADMIN_SECRET_KEY);
  } catch (error) {
    console.error("Error clearing admin secret:", error);
  }
}

/**
 * Prompt user for admin secret (for development)
 */
export function promptAdminSecret(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const secret = prompt("Enter admin secret:");
  if (secret) {
    setAdminSecret(secret);
    return secret;
  }

  return null;
}
