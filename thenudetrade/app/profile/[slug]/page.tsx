"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { getProfileBySlug } from "../../../lib/api";
import { Profile } from "../../../types";
import ProfileGallery from "../../../components/profile/ProfileGallery";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Get country code from country name (common countries)
const getCountryCode = (country: string) => {
  const countryToCode: Record<string, string> = {
    "United States": "US",
    "USA": "US",
    "US": "US",
    "United Kingdom": "GB",
    "UK": "GB",
    "Germany": "DE",
    "Canada": "CA",
    "France": "FR",
    "Australia": "AU",
    "Japan": "JP",
    "Spain": "ES",
    "Italy": "IT",
    "Netherlands": "NL",
    "Brazil": "BR",
    "Mexico": "MX",
    "India": "IN",
    "China": "CN",
  };
  return countryToCode[country] || country.substring(0, 2).toUpperCase();
};

// Calculate time ago from createdAt date
const getTimeAgo = (createdAt: string) => {
  if (!createdAt) return "Recently";
  
  try {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } catch (error) {
    return "Recently";
  }
};

export default function ProfileDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile from API
    async function loadProfile() {
      try {
        setLoading(true);
        const found = await getProfileBySlug(slug);
        setProfile(found);
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile not available</h1>
          <p className="text-gray-600 mb-6">
          This profile doesn&apos;t exist or may not be approved yet.
        </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to listings
        </Link>
        </div>
      </div>
    );
  }

  const countryCode = getCountryCode(profile.country || "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to listings
        </Link>

      {/* Main Profile Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section with Image */}
        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* Profile Image */}
            <div className="relative flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
                {profile.avatar || (profile.images && profile.images.length > 0) ? (
                  <img
                    src={profile.avatar || profile.images[0]}
                    alt={profile.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center transform-gpu"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {profile.name}
                </h1>
                {profile.headline && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium mb-3 sm:mb-4">
                    {profile.headline}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm border border-purple-200">
                  {profile.gender === "girl" ? "Female" : "Male"}
                </span>
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm border border-gray-200">
                  {profile.city}
                </span>
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm border border-blue-200">
                  {profile.gender === "girl" ? "Straight, Female" : "Straight, Male"}{profile.age ? `, ${profile.age} years old` : ""}
                </span>
                {profile.country && (
                  <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-100 text-green-700 font-semibold text-xs sm:text-sm border border-green-200">
                    {profile.country}
                  </span>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {getTimeAgo(profile.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Trust & Anonymity Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-purple-900 mb-1">100% Anonymous & Trustworthy</h3>
                <p className="text-sm text-purple-800">All profiles are verified and moderated by our team. Your privacy is our priority.</p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          {(profile.telegram_username || profile.discord_username) && (
            <section className="bg-white border-2 border-purple-200 rounded-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.821l.471 2.822c.05.299-.172.557-.467.657L4.5 8.863a12.987 12.987 0 008.364 8.364l1.563-.783c.1-.295.358-.517.657-.467l2.822.471a1 1 0 01.821.986V17a1 1 0 01-1 1A16.974 16.974 0 012 3z" />
                </svg>
                Contact Information
              </h2>
              <div className="space-y-3">
                {profile.telegram_username && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      T
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Telegram</p>
                      <p className="text-sm font-bold text-gray-900 break-all">@{profile.telegram_username}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://t.me/${profile.telegram_username}`, '_blank');
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-sm transition-colors"
                    >
                      Open
                    </button>
                  </div>
                )}
                {profile.discord_username && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      D
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Discord</p>
                      <p className="text-sm font-bold text-gray-900 break-all">{profile.discord_username}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(profile.discord_username || '');
                        alert('Discord username copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* About Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              About
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
              {profile.description}
            </p>
      </section>

          {/* Gallery Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Gallery
            </h2>
        <ProfileGallery images={profile.images} profileName={profile.name} />
      </section>
        </div>
      </div>
    </div>
  );
}
