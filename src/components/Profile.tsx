import { useAppContext } from '../hooks/useAppContext'
import { useFirebaseStorage } from '../hooks/useFirebaseStorage'
import { FaUserCircle, FaCamera, FaTrash } from 'react-icons/fa'
import { useState, useRef } from 'react'

export default function Profile() {
    const { 
      currentUser,
      setIsUpdateUserProfile,
      updateUserProfile } = useAppContext();
    const { uploadFile, isUploading, error: uploadError, MAX_FILE_SIZE } = useFirebaseStorage();
    
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(
      currentUser?.photoURL || null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userName = currentUser?.displayName;

    // Handle file selection
    async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size on client side
      if (file.size > MAX_FILE_SIZE) {
        setUploadProgress(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
        setSelectedFile(file);
        setUploadProgress("");
      };
      reader.readAsDataURL(file);
    }

    // Clear file selection
    function handleClearFile() {
      setSelectedFile(null);
      setProfilePicturePreview(currentUser?.photoURL || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    // Handle profile update
    async function handleUpdateProfile(event: React.FormEvent) {
      event.preventDefault();

      if (!currentUser) return;

      let photoURL = currentUser.photoURL;

      try {
        setUploadProgress("Processing...");

        // Upload file if selected
        if (selectedFile) {
          setUploadProgress("Uploading image...");
          const uploadedURL = await uploadFile(selectedFile, currentUser.uid);
          
          if (!uploadedURL) {
            setUploadProgress("Image upload failed");
            return;
          }

          photoURL = uploadedURL;
          setUploadProgress("Image uploaded successfully");
        }

        // Update user profile
        setUploadProgress("Updating profile...");
        await updateUserProfile(currentUser, {
          displayName: displayName || currentUser.displayName || undefined,
          photoURL: photoURL || undefined,
        });

        setUploadProgress("Profile updated successfully!");
        setSelectedFile(null);

        // Close profile page after 1.5 seconds
        setTimeout(() => {
          setIsUpdateUserProfile(false);
          setUploadProgress("");
        }, 1500);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Update failed";
        setUploadProgress(`Error: ${errorMsg}`);
      }
    }

    return (
      <div className="w-full max-w-[600px] mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {userName ? `${userName}'s Profile` : "User Profile"}
        </h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-400"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 fill-gray-400" />
            )}
            <label htmlFor="file-input" className="absolute bottom-0 right-0 cursor-pointer">
              <div className="bg-orange-400 text-white p-2 rounded-full hover:bg-orange-500 transition-colors">
                <FaCamera className="text-lg" />
              </div>
            </label>
          </div>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-sm text-gray-600 text-center mb-2">
            Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
          </p>
          <p className="text-sm text-gray-500 text-center">
            Supported formats: JPEG, PNG, WebP
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Display Name Input */}
          <div>
            <label htmlFor="input-user-name" className="block text-sm font-bold text-gray-700 mb-2">
              Display Name
            </label>
            <input
              id="input-user-name"
              type="text"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="
                w-full px-4 py-2
                rounded-lg
                text-lg
                border-2 border-gray-300
                focus:border-orange-400 focus:outline-none
                transition-colors
              "
            />
          </div>

          {/* File Upload Status */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Selected File: {selectedFile.name}
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                type="button"
                onClick={handleClearFile}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <FaTrash className="text-sm" />
                Remove File
              </button>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm font-semibold">
              {uploadError}
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className={`rounded-lg p-4 text-sm font-semibold text-center ${
              uploadProgress.includes("Error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : uploadProgress.includes("successfully")
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-yellow-50 text-yellow-600 border border-yellow-200"
            }`}>
              {uploadProgress}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={isUploading}
              className="
                flex-1
                py-3
                rounded-lg
                font-bold
                text-white
                text-lg
                bg-orange-600 hover:bg-orange-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {isUploading ? "Uploading..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => setIsUpdateUserProfile(false)}
              className="
                flex-1
                py-3
                rounded-lg
                font-bold
                text-gray-700
                text-lg
                bg-gray-200 hover:bg-gray-300
                transition-all duration-300
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
}