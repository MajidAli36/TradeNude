"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { getProfiles } from "../../../lib/api";
import { Profile } from "../../../types";
import ProfileCard from "../../../components/profile/ProfileCard";
import Breadcrumb from "../../../components/common/Breadcrumb";
import EmptyState from "../../../components/common/EmptyState";
import CityFilter from "../../../components/filters/CityFilter";

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function CountryPage({ params }: PageProps) {
  const { country: encodedCountry } = use(params);
  const country = decodeURIComponent(encodedCountry);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [city, setCity] = useState<string>("All cities");
  const [gender, setGender] = useState<string>("All");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true);
        const allProfiles = await getProfiles({ country });
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [country]);

  // Filter profiles by city, gender, and search
  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (city !== "All cities" && p.city !== city) return false;
      if (gender !== "All" && p.gender !== gender.toLowerCase()) return false;
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchableText = [
          p.name,
          p.city,
          p.country,
          p.headline,
          p.description,
          p.gender
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    });
  }, [profiles, city, gender, searchQuery]);

  // Get unique cities from profiles
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(profiles.map((p) => p.city))).sort();
    return ["All cities", ...uniqueCities];
  }, [profiles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: country }]} />

      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2">
          Nude Traders in {country}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          100% Anonymous • 100% Trustworthy Community
        </p>

        {/* Search Bar with Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          {/* Search Bar - 2 columns */}
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
                placeholder="Search traders..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value || "")}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-lg bg-white text-gray-800 font-semibold text-xs sm:text-sm uppercase border-2 border-gray-300 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* City Filter - 1 column */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">City</label>
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter - 1 column */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Gender</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              <option value="All">ALL GENDERS</option>
              <option value="Girl">GIRLS</option>
              <option value="Boy">BOYS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState 
          message={`No traders found in ${city === "All cities" ? country : `${city}, ${country}`}.`}
          description="Check back later or explore other cities."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12 text-center">
        <Link 
          href="/countries"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Countries
        </Link>
      </div>
    </div>
  );
}
