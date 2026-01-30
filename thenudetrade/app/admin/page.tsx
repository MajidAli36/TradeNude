"use client";

import { useState, useEffect } from "react";
import StatusBadge from "../../components/profile/StatusBadge";
import Button from "../../components/ui/Button";
import { Profile, Status } from "../../types";
import { getAdminProfiles, approveProfile, rejectProfile, deleteProfile } from "../../lib/api";

export default function AdminPage() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    // Load pending profiles from API
    async function loadProfiles() {
      try {
        setLoading(true);
        const profiles = await getAdminProfiles("pending");
        setRows(profiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  function handleActionClick(profile: Profile, action: "approve" | "reject") {
    setSelectedProfile(profile);
    setActionType(action);
    setShowConfirmModal(true);
  }

  async function handleConfirmAction() {
    if (!selectedProfile || !actionType) return;

    try {
      if (actionType === "approve") {
        await approveProfile(selectedProfile.id);
      } else if (actionType === "reject") {
        await rejectProfile(selectedProfile.id);
      }
      
      // Show success modal with profile details
      setShowSuccessModal(true);
      setShowConfirmModal(false);
      
      // Remove from pending list after a delay
      setTimeout(() => {
        setRows((current) => current.filter((row) => row.id !== selectedProfile.id));
        setShowSuccessModal(false);
        setSelectedProfile(null);
        setActionType(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile status:", error);
      alert("Failed to update profile status. Please try again.");
      setShowConfirmModal(false);
      setSelectedProfile(null);
      setActionType(null);
    }
  }

  function handleCancelAction() {
    setShowConfirmModal(false);
    setSelectedProfile(null);
    setActionType(null);
  }

  async function handleDelete(id: string) {
    const profile = rows.find((row) => row.id === id);
    
    if (!profile) return;

    setSelectedProfile(profile);
    setShowDeleteModal(true);
  }

  function handleCancelDelete() {
    setShowDeleteModal(false);
    setSelectedProfile(null);
  }

  async function handleConfirmDelete() {
    if (!selectedProfile) return;

    try {
      await deleteProfile(selectedProfile.id);
      // Remove from list
      setRows((current) => current.filter((row) => row.id !== selectedProfile.id));
      setShowDeleteModal(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
      setShowDeleteModal(false);
      setSelectedProfile(null);
    }
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && selectedProfile && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleCancelAction}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {actionType === "approve" ? "Approve Profile?" : "Reject Profile?"}
                </h2>
                <button
                  onClick={handleCancelAction}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                      {selectedProfile.avatar || (selectedProfile.images && selectedProfile.images.length > 0) ? (
                        <img
                          src={selectedProfile.avatar || selectedProfile.images[0]}
                          alt={selectedProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{selectedProfile.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedProfile.headline || selectedProfile.description?.substring(0, 100)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">City:</span>
                        <span className="font-medium text-slate-900">{selectedProfile.city}</span>
                      </div>
                      {selectedProfile.country && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Country:</span>
                          <span className="font-medium text-slate-900">{selectedProfile.country}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Gender:</span>
                        <span className="font-medium text-slate-900 capitalize">{selectedProfile.gender}</span>
                      </div>
                      {selectedProfile.age && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Age:</span>
                          <span className="font-medium text-slate-900">{selectedProfile.age}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProfile.description && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedProfile.description}</p>
                  </div>
                )}

                {/* Images Preview */}
                {selectedProfile.images && selectedProfile.images.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">Images ({selectedProfile.images.length}):</p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProfile.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={img}
                            alt={`${selectedProfile.name} image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleCancelAction}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors ${
                    actionType === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {actionType === "approve" ? "Approve Profile" : "Reject Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedProfile && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                actionType === "approve" ? "bg-emerald-100" : "bg-rose-100"
              }`}>
                {actionType === "approve" ? (
                  <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Profile {actionType === "approve" ? "Approved" : "Rejected"}!
              </h2>
              <div className="space-y-2">
                <p className="text-base text-slate-700 font-medium">{selectedProfile.name}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                  <span>{selectedProfile.city}</span>
                  {selectedProfile.country && (
                    <>
                      <span>•</span>
                      <span>{selectedProfile.country}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{selectedProfile.gender}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                {actionType === "approve" 
                  ? "This profile is now visible on the website."
                  : "This profile has been rejected and will not be visible."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProfile && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-rose-600">Delete Profile?</h2>
                <button
                  onClick={handleCancelDelete}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Warning Message */}
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-sm text-rose-800 font-medium">
                  ⚠️ This action cannot be undone. The profile will be permanently deleted.
                </p>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                      {selectedProfile.avatar || (selectedProfile.images && selectedProfile.images.length > 0) ? (
                        <img
                          src={selectedProfile.avatar || selectedProfile.images[0]}
                          alt={selectedProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{selectedProfile.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedProfile.headline || selectedProfile.description?.substring(0, 100)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">City:</span>
                        <span className="font-medium text-slate-900">{selectedProfile.city}</span>
                      </div>
                      {selectedProfile.country && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Country:</span>
                          <span className="font-medium text-slate-900">{selectedProfile.country}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Gender:</span>
                        <span className="font-medium text-slate-900 capitalize">{selectedProfile.gender}</span>
                      </div>
                      {selectedProfile.age && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Age:</span>
                          <span className="font-medium text-slate-900">{selectedProfile.age}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Submissions</h1>
        <p className="text-xs text-slate-600">
          Review and manage pending profile submissions. Approve or reject profiles to update their status.
        </p>
      </header>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-2.5">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">Loading...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">
              No pending submissions. All profiles have been reviewed.
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5"
            >
              <div className="flex items-start gap-3">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    {row.avatar || (row.images && row.images.length > 0) ? (
                      <img
                        src={row.avatar || row.images[0]}
                        alt={row.name}
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
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{row.name}</h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                        <span>{row.city}</span>
                        <span className="text-slate-400">•</span>
                        <span className="capitalize">{row.gender}</span>
                        <span className="text-slate-400">•</span>
                        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={row.status} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                <Button
                  variant="ghost"
                  className="flex-1 min-w-[70px] text-[11px] border border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-1.5 px-2"
                  onClick={() => handleActionClick(row, "approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 min-w-[70px] text-[11px] border border-rose-500 text-rose-600 hover:bg-rose-50 py-1.5 px-2"
                  onClick={() => handleActionClick(row, "reject")}
                >
                  Reject
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 min-w-[70px] text-[11px] border border-slate-300 text-slate-700 hover:bg-slate-100 py-1.5 px-2"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
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
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Submitted</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500 bg-slate-50">
                    Loading...
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                      {row.avatar || (row.images && row.images.length > 0) ? (
                        <img
                          src={row.avatar || row.images[0]}
                          alt={row.name}
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
                  <td className="px-4 py-2.5 text-slate-900 font-medium text-sm">{row.name}</td>
                  <td className="px-4 py-2.5 text-slate-700 text-sm">{row.city}</td>
                  <td className="px-4 py-2.5 text-slate-700 capitalize text-sm">{row.gender}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-xs py-1 px-2.5"
                        onClick={() => handleActionClick(row, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        className="border border-rose-500 text-rose-600 hover:bg-rose-50 text-xs py-1 px-2.5"
                        onClick={() => handleActionClick(row, "reject")}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="ghost"
                        className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs py-1 px-2.5"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                ))
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-xs text-slate-500 bg-slate-50"
                  >
                    No pending submissions. All profiles have been reviewed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
