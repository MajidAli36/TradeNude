"use client";

import Link from "next/link";
import { Profile } from "../../types";

interface ProfileCardProps {
  profile: Profile;
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

// Truncate description to 2 lines
const truncateDescription = (text: string, maxLines: number = 2) => {
  const lines = text.split('\n');
  const truncated = lines.slice(0, maxLines).join('\n');
  if (lines.length > maxLines) {
    return truncated + '...';
  }
  return truncated.length > 120 ? truncated.substring(0, 120) + '...' : truncated;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const countryCode = getCountryCode(profile.country || "");
  const hasContactInfo = profile.telegram_username || profile.discord_username;
  
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-200/70 ring-1 ring-black/5 h-full"
    >
      {/* Image Section - Responsive Height */}
      <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {profile.avatar || (profile.images && profile.images.length > 0) ? (
          <img
            src={profile.avatar || profile.images[0]}
            alt={profile.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform-gpu"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        
        {/* "View Profile" Overlay Button */}
        <div className="absolute inset-0 bg-black/0 flex items-center justify-center z-20">
          <Link 
            href={`/profile/${profile.slug}`}
            className="opacity-0 bg-white text-purple-600 font-bold px-6 py-3 rounded-xl shadow-2xl hover:bg-purple-600 hover:text-white transition-all duration-200 transform scale-75 pointer-events-none"
          >
            View Profile
          </Link>
        </div>

        {/* Title at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
          <h3 className="font-bold text-sm sm:text-base text-white drop-shadow-lg line-clamp-1">
            {profile.name}
          </h3>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col p-3 sm:p-4 bg-white flex-1">
        {/* Title and Location */}
        <div className="mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            <span className="capitalize">{profile.gender}</span>
            {profile.age && <span> • {profile.age} yrs</span>}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {profile.city}{profile.country && `, ${profile.country}`}
          </p>
        </div>

        {/* Description Preview */}
        {profile.description && (
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4 line-clamp-2 flex-1">
            {truncateDescription(profile.description, 2)}
          </p>
        )}

        {/* Contact Info Badge */}
        {hasContactInfo && (
          <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{profile.telegram_username ? '✓ Telegram' : profile.discord_username ? '✓ Discord' : 'Contact'}</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.tags.slice(0, 2).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
            {profile.tags.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                +{profile.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Link 
          href={`/profile/${profile.slug}`}
          className="block w-full mt-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-3 rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-md text-center"
        >
          View the Trader
        </Link>
      </div>
    </div>
  );
}