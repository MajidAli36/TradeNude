"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import EmptyState from "../components/common/EmptyState";
import { getProfiles } from "../lib/api";
import { Profile } from "../types";

export default function HomePage() {
  const [gender, setGender] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Handle hash navigation on page load
    if (window.location.hash === '#search-bar') {
      setTimeout(() => {
        document.getElementById('search-bar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }

    // Load profiles from API
    async function loadProfiles() {
      try {
        setLoading(true);
        const allProfiles = await getProfiles();
        setProfiles(allProfiles);
      } catch (error: any) {
        console.error("Error loading profiles:", error);
        // Show user-friendly error message
        if (error.message?.includes("Cannot connect to backend")) {
          console.warn("Backend connection failed. Make sure backend server is running.");
        }
        // Set empty array on error so UI doesn't break
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      // Gender filter
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
  }, [profiles, gender, searchQuery]);

  return (
    <div className="w-full">
      {/* Purple Gradient Hero Section */}
      <section className="bg-gradient-to-b from-purple-600 via-purple-500 to-white pt-12 pb-16 relative overflow-hidden shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-3 sm:mb-4 drop-shadow-lg">
            Connect with Like-Minded People
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 text-center mb-6 sm:mb-8 drop-shadow-md px-2">
            Find Sexting Usernames for Telegram, Kik, and More
          </p>

          {/* Search Bar with By Country Button */}
          <div id="search-bar" className="max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-2">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="SEARCH SEXTING USERS"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value || "")}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white text-gray-800 font-bold text-xs sm:text-sm uppercase border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <Link
                href="/countries"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl hover:shadow-purple-900/50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
              >
                
                <span>BY COUNTRY</span>
              </Link>
            </div>
          </div>

          {/* Latest Profiles (show 8 latest) */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <EmptyState
              message="No profiles found."
              description="Try adjusting the filters or search query."
            />
          ) : (
            <>
             

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6">
                {/** Ensure newest first and limit to 8 profiles */}
                {profiles
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 12)
                  .map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
              </div>

              {/* Themed CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-8">
                <Link
                  href="/boys"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-2xl hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zM12 13v6" />
                  </svg>
                  More Boys
                </Link>

                <Link
                  href="/girls"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-2xl hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zM12 13v6" />
                  </svg>
                  More Girls
                </Link>
              </div>
            </>
          )}

          {/* No Additional Buttons Here */}
        </div>
      </section>

      {/* Informational Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Wanna have fun?
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            Quickly find new open-minded people for Sex Chat? Use our Friend Finder for Telegram and more social apps. Feeling dirty? Interested in Telegram and Kik Sexting? Want to browse through Free Nudes and find Sexting Usernames? TheTradeNudes.com is the place!
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Looking for Free Sexting?
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            TheTradeNudes.com is the best place for free sexting. Find Free Nudes, Kik sexting or Telegram nudes. Browse through our extensive list of sexting usernames and connect with like-minded people.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Usernames for Free Sex Chat!
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            TheTradeNudes.com is a platform for adult chat and private naughty Free Nudes. It&apos;s popular for sharing usernames for sexting chat. Find people who want to sext and share nudes.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Girl Sexting Usernames
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            Girls use apps like Telegram, Kik, and Snapchat for sexting and posting Nude Selfies. Browse our collection of girl sexting usernames and connect with them.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Free Sexting with Kik and Telegram
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            Find sexting lists for Telegram and Kik. Discover new apps for free sexting and connect with people who share your interests.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Free Nudes
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black mb-3">
            Apps that allow saving and sharing Free Nudes and videos. Find people who want to share nudes and connect with them.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            It&apos;s important to trust and use a burner social media account to avoid leaked nudes. Always be careful when sharing personal content.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Gay Sexting
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black mb-3">
            TheTradeNudes.com caters to gay men and lesbian members, offering Lesbian Sexting Usernames and Gay Sexting Usernames.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            Find Naked Gay Men and connect with the LGBTQ+ community for sexting and adult chat.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-black">
            Welcome Telegram and Kik Friends!
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-black">
            New Telegram and Kik Sexting lists for users to mingle with our new friends. Connect with people on your favorite instant messenger apps.
          </p>
        </div>
      </section>
    </div>
  );
}
