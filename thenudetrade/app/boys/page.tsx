"use client";

import { useMemo, useState, useEffect } from "react";
import { getProfiles } from "../../lib/api";
import { Profile } from "../../types";
import ProfileCard from "../../components/profile/ProfileCard";
import EmptyState from "../../components/common/EmptyState";

export default function BoysPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [country, setCountry] = useState<string>("All countries");
  const [city, setCity] = useState<string>("All cities");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load profiles from API
    async function loadProfiles() {
      try {
        setLoading(true);
        const allProfiles = await getProfiles({ gender: "boy" });
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (country !== "All countries" && p.country !== country) return false;
      if (city !== "All cities" && p.city !== city) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = [p.name, p.city, p.country, p.headline, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [profiles, country, city, searchQuery]);

  // Get unique cities and countries from boy profiles
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(profiles.map((p) => p.city))).sort();
    return ["All cities", ...uniqueCities];
  }, [profiles]);

  const countries = useMemo(() => {
    const unique = Array.from(new Set(profiles.map((p) => p.country || "Unknown"))).sort();
    return ["All countries", ...unique];
  }, [profiles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              Boys
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              Browse boy profiles with a focus on readability and trust. Use search and filters to refine results.
            </p>
          </div>
        </div>

        {/* Search + Filters: search spans 2 cols, then country and city */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search boys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value || "")}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-lg bg-white text-gray-800 font-semibold text-xs sm:text-sm uppercase border-2 border-gray-300 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Profile Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState 
          message="No profiles found in this city yet."
          description="Try selecting a different city or check back later."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
