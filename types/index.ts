export interface Profile {
  // Supabase `id` is a UUID string
  id: string;
  slug: string;
  name: string;
  title?: string; // Profile title used for URL generation
  gender: "girl" | "boy";
  age?: number;
  country?: string;
  city: string;
  headline?: string;
  description: string;
  avatar?: string;
  images: string[];
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  email?: string;
  telegram_username?: string;
  discord_username?: string;
  tags?: string[];
}

export type Status = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  name: string;
  gender: "girl" | "boy";
  city: string;
  submittedAt: string;
  status: Status;
}
