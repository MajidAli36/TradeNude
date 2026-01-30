"use client";

import { useState, useEffect } from "react";
import StatusBadge from "../../../components/profile/StatusBadge";
import { Profile } from "../../../types";
import { getAdminProfiles } from "../../../lib/api";

export default function AllProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("all");

  useEffect(() => {
    // Load profiles from API
    async function loadProfiles() {
      try {
        setLoading(true);
        let allProfiles: Profile[] = [];
        
        if (statusFilter === "all") {
          // Load all statuses
          const [pending, approved, rejected] = await Promise.all([
            getAdminProfiles("pending"),
            getAdminProfiles("approved"),
            getAdminProfiles("rejected"),
          ]);
          allProfiles = [...pending, ...approved, ...rejected];
        } else {
          allProfiles = await getAdminProfiles(statusFilter);
        }
        
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">All Profiles</h1>
        <p className="text-xs text-slate-600">
          View all profiles with their current status. No editing available.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs rounded border ${
              statusFilter === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 text-xs rounded border ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1 text-xs rounded border ${
              statusFilter === "approved"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1 text-xs rounded border ${
              statusFilter === "rejected"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Rejected
          </button>
        </div>
      </header>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-2.5">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">Loading...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">
              No profiles found. Submit a profile to get started.
            </p>
          </div>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5"
            >
              <div className="flex items-start gap-3">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    {profile.avatar || (profile.images && profile.images.length > 0) ? (
                      <img
                        src={profile.avatar || profile.images[0]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{profile.name}</h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                        <span>{profile.city}</span>
                        <span className="text-slate-400">•</span>
                        <span className="capitalize">{profile.gender}</span>
                        <span className="text-slate-400">•</span>
                        <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={profile.status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Image</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Profile</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">City</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-500 bg-slate-50">
                    Loading...
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                      {profile.avatar || (profile.images && profile.images.length > 0) ? (
                        <img
                          src={profile.avatar || profile.images[0]}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-900 font-medium text-sm">{profile.name}</td>
                  <td className="px-4 py-2.5 text-slate-700 text-sm">{profile.city}</td>
                  <td className="px-4 py-2.5 text-slate-700 capitalize text-sm">{profile.gender}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-sm">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={profile.status} />
                  </td>
                </tr>
                ))
              )}
              {!loading && profiles.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-xs text-slate-500 bg-slate-50"
                  >
                    No profiles found. Submit a profile to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
