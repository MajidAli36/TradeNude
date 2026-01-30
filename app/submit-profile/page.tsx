"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import FormField from "../../components/ui/FormField";
import { createProfile } from "../../lib/api";

export default function SubmitProfilePage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    gender: "",
    age: "",
    country: "",
    city: "",
    description: "",
    email: "",
    telegram_username: "",
    discord_username: "",
    tags: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Validate required fields
      if (!formData.title.trim() && !formData.name.trim()) {
        setError("Title or Name is required");
        setLoading(false);
        return;
      }

      // Create profile via API
      // Use title for slug generation, but send name for display
      // If title is provided, use it for slug; otherwise use name
      const slugSource = formData.title.trim() || formData.name;
      
      await createProfile({
        name: formData.name,
        title: formData.title.trim() || undefined,
        gender: formData.gender,
        age: formData.age || undefined,
        country: formData.country || undefined,
        city: formData.city,
        description: formData.description,
        email: formData.email || undefined,
        telegram_username: formData.telegram_username || undefined,
        discord_username: formData.discord_username || undefined,
        tags: tags.length > 0 ? tags : undefined,
        images: selectedImages.length > 0 ? selectedImages : [],
        // Pass slug source for URL generation
        _slugSource: slugSource,
      });

      // Show success message
      setSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        title: "",
        gender: "",
        age: "",
        country: "",
        city: "",
        description: "",
        email: "",
        telegram_username: "",
        discord_username: "",
        tags: "",
      });
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (err: any) {
      console.error("Error submitting profile:", err);
      setError(err.message || "Failed to submit profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      // Create previews for display
      const imagePromises = newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((previews) => {
        setImagePreviews((prev) => [...prev, ...previews]);
      });
    }
  }

  function removeImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <>
      {/* Success Modal Popup */}
      {submitted && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSubmitted(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSubmitted(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Submitted Successfully!
              </h2>
              <p className="text-base text-gray-600">
                Your profile is pending approval.
              </p>
              <p className="text-sm text-gray-500">
                An admin will review your submission shortly. You'll be notified once your profile is approved.
              </p>
              
              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
          Submit your profile
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
            Fill out the form below to submit your profile for review.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="NAME" required>
            <Input 
              placeholder="Display name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
        </FormField>

          <FormField label="GENDER" required>
            <Select 
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
            <option value="">Select gender</option>
            <option value="girl">Girl</option>
            <option value="boy">Boy</option>
          </Select>
        </FormField>

          <FormField label="AGE" required>
            <Input 
              type="number"
              placeholder="Age" 
              required 
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="COUNTRY" required>
              <Input 
                placeholder="Country" 
                required 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
        </FormField>

            <FormField label="CITY" required>
              <Input 
                placeholder="City" 
                required 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="EMAIL (OPTIONAL)">
            <Input 
              type="email"
              placeholder="your.email@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormField>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5">
            <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.821l.471 2.822c.05.299-.172.557-.467.657L4.5 8.863a12.987 12.987 0 008.364 8.364l1.563-.783c.1-.295.358-.517.657-.467l2.822.471a1 1 0 01.821.986V17a1 1 0 01-1 1A16.974 16.974 0 012 3z" />
              </svg>
              Contact Information
            </h3>
            <div className="space-y-4">
              <FormField label="TELEGRAM USERNAME (OPTIONAL)">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">@</span>
                  <Input 
                    placeholder="yourusername" 
                    value={formData.telegram_username}
                    onChange={(e) => setFormData({ ...formData, telegram_username: e.target.value })}
                  />
                </div>
              </FormField>

              <FormField label="DISCORD USERNAME (OPTIONAL)">
                <Input 
                  placeholder="YourUsername#1234" 
                  value={formData.discord_username}
                  onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <FormField label="PROFILE TITLE" required>
            <Input 
              placeholder="Enter a title for your profile (used for URL)" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">This title will be used to generate your profile URL.</p>
          </FormField>

          <FormField label="SHORT DESCRIPTION" required>
            <Textarea 
              placeholder="A short, friendly description of your profile." 
              required 
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
        </FormField>

          <FormField label="TAGS (OPTIONAL)">
            <Input 
              placeholder="e.g., sexting, telegram, trading, anonymous (comma separated)" 
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">Enter tags separated by commas to help others find your profile.</p>
          </FormField>

          <FormField label="IMAGES">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Upload images for your profile. Images will be uploaded to the server.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 transition-all px-6 py-3 text-sm font-medium text-gray-700">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Select images</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-red-900 mb-1">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Submitting..." : "Submit for review"}
            </button>
        </div>
      </form>
      </div>
    </div>
    </>
  );
}
