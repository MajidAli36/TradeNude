"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getProfiles } from "../../lib/api";
import { Profile } from "../../types";
import EmptyState from "../../components/common/EmptyState";

export default function CountriesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true);
        const allProfiles = await getProfiles();
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  // Group profiles by country
  const countries = useMemo(() => {
    const countryMap = new Map<string, { girls: number; boys: number }>();
    
    profiles.forEach((profile) => {
      const country = profile.country || "Unknown";
      if (!countryMap.has(country)) {
        countryMap.set(country, { girls: 0, boys: 0 });
      }
      
      const counts = countryMap.get(country)!;
      if (profile.gender === "girl") {
        counts.girls++;
      } else {
        counts.boys++;
      }
    });

    return Array.from(countryMap.entries())
      .map(([country, counts]) => ({
        country,
        girls: counts.girls,
        boys: counts.boys,
        total: counts.girls + counts.boys,
      }))
      .sort((a, b) => b.total - a.total);
  }, [profiles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3">
          Browse by Country
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
          100% Anonymous • 100% Trustworthy • Verified Nude Traders Community
        </p>
      </div>

      {/* Countries Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading countries...</p>
        </div>
      ) : countries.length === 0 ? (
        <EmptyState 
          message="No profiles found yet."
          description="Check back later for traders in your area."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {countries.map(({ country, girls, boys, total }) => (
            <Link
              key={country}
              href={`/country/${encodeURIComponent(country)}`}
              className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300 transform hover:-translate-y-1"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative p-6 sm:p-7">
                {/* Country Flag and Name */}
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                    {country}
                  </h3>
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded group-hover:w-full transition-all duration-300" />
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  {/* Girls count */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-600 font-bold text-sm">♀</span>
                      </div>
                      <span className="text-gray-700 font-medium">Girls</span>
                    </div>
                    <span className="text-xl font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      {girls}
                    </span>
                  </div>

                  {/* Boys count */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">♂</span>
                      </div>
                      <span className="text-gray-700 font-medium">Boys</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {boys}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-gray-200 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Total Traders</span>
                      <span className="text-2xl font-bold text-purple-600">{total}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                  Explore {country}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
