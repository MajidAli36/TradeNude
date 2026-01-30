import { Profile, Status } from "./../types";
import { generateSlug } from "./storage";
import { getSupabaseClient } from "./supabase";

const PROFILE_IMAGES_BUCKET = "profile-images";

function mapRowToProfile(row: any): Profile {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title ?? undefined,
    gender: row.gender,
    age: row.age ?? undefined,
    country: row.country ?? undefined,
    city: row.city,
    headline: row.headline ?? undefined,
    description: row.description,
    // Use dedicated avatar if present, otherwise fall back to first image
    avatar: (row as any).avatar ?? (row.images?.[0] ?? undefined),
    images: row.images ?? [],
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
    status: row.status as Status,
    email: row.email ?? undefined,
    telegram_username: row.telegram_username ?? undefined,
    discord_username: row.discord_username ?? undefined,
    tags: row.tags ?? undefined,
  };
}

export async function listPublicProfiles(filters?: {
  gender?: string;
  city?: string;
  country?: string;
}): Promise<Profile[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }
  if (filters?.city) {
    query = query.eq("city", filters.city);
  }
  if (filters?.country) {
    query = query.eq("country", filters.country);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching public profiles from Supabase:", error);
    throw new Error("Failed to fetch profiles");
  }

  return (data || []).map(mapRowToProfile);
}

export async function findProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile by slug from Supabase:", error);
    throw new Error("Failed to fetch profile");
  }

  if (!data) return null;
  return mapRowToProfile(data);
}

export async function createProfileFromFormData(
  formData: FormData
): Promise<Profile> {
  const name = String(formData.get("name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const gender = String(formData.get("gender") || "").trim() as
    | "girl"
    | "boy";
  const city = String(formData.get("city") || "").trim();
  const description = String(formData.get("description") || "").trim();
  // Get slug source - use title if provided, otherwise use name
  const slugSource = String(formData.get("_slugSource") || title || name).trim();
  const ageValue = formData.get("age");
  const country = String(formData.get("country") || "").trim() || undefined;
  const email = String(formData.get("email") || "").trim() || undefined;
  const telegram_username = String(formData.get("telegram_username") || "").trim() || undefined;
  const discord_username = String(formData.get("discord_username") || "").trim() || undefined;
  
  // Parse tags
  let tags: string[] | undefined;
  const tagsValue = formData.get("tags");
  if (tagsValue) {
    try {
      const parsed = JSON.parse(String(tagsValue));
      if (Array.isArray(parsed)) {
        tags = parsed;
      }
    } catch {
      // If not JSON, try comma-separated
      const parsed = String(tagsValue)
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      tags = parsed.length > 0 ? parsed : undefined;
    }
  }

  if (!name || !gender || !city || !description) {
    throw new Error("Missing required fields");
  }
  
  // Title is required if provided, but we'll use name as fallback
  if (!title && !name) {
    throw new Error("Name or Title is required");
  }

  const age =
    typeof ageValue === "string" && ageValue
      ? Number(ageValue)
      : undefined;

  // Collect image URLs and uploaded image URLs from form data.
  const images: string[] = [];
  const imageEntries = formData.getAll("images");

  for (const entry of imageEntries) {
    if (typeof entry === "string") {
      try {
        const parsed = JSON.parse(entry);
        if (Array.isArray(parsed)) {
          parsed.forEach((url) => {
            if (typeof url === "string") images.push(url);
          });
        }
      } catch {
        images.push(entry);
      }
    } else if (entry instanceof File) {
      // Upload file to Supabase Storage and store the public URL
      const file = entry as File;
      const supabase = getSupabaseClient();
      const ext =
        file.name && file.name.includes(".")
          ? file.name.split(".").pop()
          : "jpg";
      const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
      const path = `profiles/${uniqueSuffix}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(PROFILE_IMAGES_BUCKET)
        .upload(path, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "Error uploading image to Supabase Storage:",
          uploadError
        );
        continue;
      }

      const { data: publicData } = supabase.storage
        .from(PROFILE_IMAGES_BUCKET)
        .getPublicUrl(uploadData.path);

      if (publicData?.publicUrl) {
        images.push(publicData.publicUrl);
      }
    }
  }

  const now = new Date().toISOString();
  // Use slugSource (title if provided, otherwise name) for URL generation
  const slug = await generateUniqueSlug(slugSource);
  const supabase = getSupabaseClient();

  // Build insert object - include title if provided
  const insertData: any = {
    slug,
    name,
    gender,
    age,
    country,
    city,
    description,
    email,
    telegram_username,
    discord_username,
    tags,
    images,
    status: "pending",
    created_at: now,
  };
  
  // Add title if provided (column may not exist yet if migration not run)
  if (title && title.trim()) {
    insertData.title = title.trim();
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert(insertData)
    .select("*")
    .single();

  if (error) {
    console.error("Error creating profile in Supabase:", error);

    // Handle duplicate slug constraint gracefully
    if (error.code === "23505" && error.message?.includes("profiles_slug_key")) {
      throw new Error(
        "A profile with a similar name already exists. Please slightly change the name or try again."
      );
    }

    throw new Error(error.message || "Failed to create profile");
  }

  return mapRowToProfile(data);
}

export async function listAdminProfiles(status: Status): Promise<Profile[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin profiles from Supabase:", error);
    throw new Error("Failed to fetch admin profiles");
  }

  return (data || []).map(mapRowToProfile);
}

export async function updateProfileStatus(
  id: string,
  status: Status
): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error updating profile status in Supabase:", error);
    throw new Error("Failed to update profile status");
  }

  if (!data) return null;
  return mapRowToProfile(data);
}

export async function deleteProfileById(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting profile in Supabase:", error);
    throw new Error("Failed to delete profile");
  }

  return true;
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let counter = 1;
  const supabase = getSupabaseClient();

  while (true) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // Ignore "not found" style errors; rethrow others
      console.error("Error checking slug uniqueness:", error);
      break;
    }

    if (!data) {
      // slug is free
      return slug;
    }

    // slug exists, try with suffix
    slug = `${base}-${counter++}`;
  }

  // Fallback: return base even if check failed
  return slug;
}

