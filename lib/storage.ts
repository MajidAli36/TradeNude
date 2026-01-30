import { Profile, Status } from "../types";

const STORAGE_KEY = "profiles";

/**
 * Get all profiles from localStorage
 */
export function getProfiles(): Profile[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as Profile[];
  } catch (error) {
    console.error("Error reading profiles from localStorage:", error);
    return [];
  }
}

/**
 * Save profiles to localStorage
 */
export function saveProfiles(profiles: Profile[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Error saving profiles to localStorage:", error);
  }
}

/**
 * Update a profile's status
 */
export function updateProfileStatus(id: number, status: Status): void {
  const profiles = getProfiles();
  const updated = profiles.map((profile) =>
    Number(profile.id) === Number(id) ? { ...profile, status } : profile
  );
  saveProfiles(updated);
}

/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
