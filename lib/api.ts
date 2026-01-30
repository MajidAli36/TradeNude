import { Profile, Status } from "../types";
import { getAdminSecret } from "./auth";

/**
 * API Configuration
 *
 * This frontend now talks directly to the built-in Next.js API routes
 * (see `app/api/*`). In most cases you should not need to change this.
 *
 * If you want to proxy through another origin, you can still override the
 * base URL via an environment variable:
 *   NEXT_PUBLIC_API_URL=https://your-domain.com/api
 */
const API_BASE_URL =
  (typeof window !== "undefined" &&
    (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL) ||
  "/api";

/**
 * API Client for backend communication
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      // Better error messages for common issues
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        const errorMessage = `Cannot connect to API at ${this.baseUrl}. Please check that the Next.js server is running and the API route exists.`;
        console.error(`API request failed: ${endpoint}`, errorMessage);
        throw new Error(errorMessage);
      }
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Get all approved profiles with optional filters
   */
  async getProfiles(filters?: {
    gender?: string;
    city?: string;
    country?: string;
  }): Promise<Profile[]> {
    const queryParams = new URLSearchParams();
    if (filters?.gender) queryParams.append("gender", filters.gender);
    if (filters?.city) queryParams.append("city", filters.city);
    if (filters?.country) queryParams.append("country", filters.country);

      const query = queryParams.toString();
      const endpoint = `/profiles${query ? `?${query}` : ""}`;
      
      const response = await this.request<{ profiles: Profile[] }>(endpoint);
      return response.profiles || [];
  }

  /**
   * Get a single profile by slug
   */
  async getProfileBySlug(slug: string): Promise<Profile | null> {
    try {
      const response = await this.request<{ profile: Profile }>(`/profiles/${slug}`);
      return response.profile;
    } catch (error: any) {
      if (error.message.includes("404") || error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new profile submission
   */
  async createProfile(data: {
    name: string;
    title?: string;
    gender: string;
    age?: string | number;
    country?: string;
    city: string;
    description: string;
    email?: string;
    telegram_username?: string;
    discord_username?: string;
    tags?: string[];
    images: File[] | string[];
    _slugSource?: string;
  }): Promise<Profile> {
    const formData = new FormData();
    
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    formData.append("city", data.city);
    formData.append("description", data.description);
    
    if (data.title) {
      formData.append("title", data.title);
    }
    if (data._slugSource) {
      formData.append("_slugSource", data._slugSource);
    }
    if (data.age) {
      formData.append("age", String(data.age));
    }
    if (data.country) {
      formData.append("country", data.country);
    }
    if (data.email) {
      formData.append("email", data.email);
    }
    if (data.telegram_username) {
      formData.append("telegram_username", data.telegram_username);
    }
    if (data.discord_username) {
      formData.append("discord_username", data.discord_username);
    }
    if (data.tags && data.tags.length > 0) {
      formData.append("tags", JSON.stringify(data.tags));
    }

    // Handle images - if File objects, append them; if strings (URLs), append as JSON
    const imageFiles: File[] = [];
    const imageUrls: string[] = [];

    data.images.forEach((image) => {
      if (image instanceof File) {
        imageFiles.push(image);
      } else if (typeof image === "string") {
        imageUrls.push(image);
      }
    });

    // Append file uploads
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // If we have URLs, append them as JSON
    if (imageUrls.length > 0) {
      formData.append("images", JSON.stringify(imageUrls));
    }

    const response = await this.request<{ profile: Profile }>("/profiles", {
      method: "POST",
      headers: {}, // Let browser set Content-Type with boundary for FormData
      body: formData,
    });

    return response.profile;
  }

  /**
   * Get admin profiles by status
   */
  async getAdminProfiles(status: Status = "pending"): Promise<Profile[]> {
    const adminSecret = getAdminSecret();
    const headers: Record<string, string> = {};
    
    if (adminSecret) {
      headers["Authorization"] = `Bearer ${adminSecret}`;
      // Some backends might use X-Admin-Secret header
      headers["X-Admin-Secret"] = adminSecret;
    }

    const response = await this.request<{ profiles: Profile[] }>(
      `/admin/profiles?status=${status}`,
      {
        headers,
      }
    );
    return response.profiles;
  }

  /**
   * Approve a profile
   */
  async approveProfile(id: string): Promise<Profile> {
    const adminSecret = getAdminSecret();
    const headers: Record<string, string> = {};
    
    if (adminSecret) {
      headers["Authorization"] = `Bearer ${adminSecret}`;
      headers["X-Admin-Secret"] = adminSecret;
    }

    const response = await this.request<{ profile: Profile }>(
      `/admin/profiles/${id}/approve`,
      {
        method: "PATCH",
        headers,
      }
    );
    return response.profile;
  }

  /**
   * Reject a profile
   */
  async rejectProfile(id: string): Promise<Profile> {
    const adminSecret = getAdminSecret();
    const headers: Record<string, string> = {};
    
    if (adminSecret) {
      headers["Authorization"] = `Bearer ${adminSecret}`;
      headers["X-Admin-Secret"] = adminSecret;
    }

    const response = await this.request<{ profile: Profile }>(
      `/admin/profiles/${id}/reject`,
      {
        method: "PATCH",
        headers,
      }
    );
    return response.profile;
  }

  /**
   * Delete a profile
   */
  async deleteProfile(id: string): Promise<void> {
    const adminSecret = getAdminSecret();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (adminSecret) {
      headers["Authorization"] = `Bearer ${adminSecret}`;
      headers["X-Admin-Secret"] = adminSecret;
    }

    await this.request<{ message?: string }>(
      `/admin/profiles/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience functions
export const getProfiles = (filters?: { gender?: string; city?: string; country?: string }) =>
  apiClient.getProfiles(filters);

export const getProfileBySlug = (slug: string) =>
  apiClient.getProfileBySlug(slug);

export const createProfile = (data: {
  name: string;
  title?: string;
  gender: string;
  age?: string | number;
  country?: string;
  city: string;
  description: string;
  email?: string;
  telegram_username?: string;
  discord_username?: string;
  tags?: string[];
  images: File[] | string[];
  _slugSource?: string;
}) => apiClient.createProfile(data);

export const getAdminProfiles = (status?: Status) =>
  apiClient.getAdminProfiles(status);

export const approveProfile = (id: string) =>
  apiClient.approveProfile(id);

export const rejectProfile = (id: string) =>
  apiClient.rejectProfile(id);

export const deleteProfile = (id: string) =>
  apiClient.deleteProfile(id);
