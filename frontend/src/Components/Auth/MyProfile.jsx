import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubNavbar from "../SubNavbar";
import Navbar from "../Navbar";
import {
  useGetMyProfileQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "",
    email: "",
  });

  // Use Redux hooks for fetching profile
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetMyProfileQuery();

  // Use Redux hooks for updating profile
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Set form data when profile is fetched
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        username: profileData.username || "",
        contact: profileData.contact || "",
        email: profileData.email || "",
      });
    }
  }, [profileData]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated profile data
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId: profileData._id,
        userData: formData,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.data?.message || "Error updating profile");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <SubNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-12 h-12 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-12 h-12 bg-pink-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <SubNavbar />
        <div className="container mx-auto p-6 bg-gray-800 shadow-lg rounded-lg mt-6 border border-red-500">
          <div className="flex items-center justify-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-lg text-red-300">
              {error?.data?.message || "Failed to load profile data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Destructure profile data for cleaner JSX
  const profile = profileData || {};

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <SubNavbar />

      {/* Profile Container */}
      <div className="container mx-auto p-8 max-w-3xl">
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between">
              <div className="flex flex-col items-center sm:items-start">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800 mb-2 flex items-center justify-center overflow-hidden">
                  {/* User avatar placeholder */}
                  <span className="text-4xl">
                    {profile.name?.charAt(0) ||
                      profile.username?.charAt(0) ||
                      "U"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profile.name}
                </h1>
                <p className="text-purple-200 font-medium">
                  @{profile.username}
                </p>
              </div>

              {!editMode && (
                <div className="mt-4 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                    {profile.isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!editMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {profile.email}
                    </p>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-gray-400 text-sm mb-1">Contact</p>
                    <p className="text-white font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {profile.contact || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 mt-4">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <Link
                    to="/my-orders"
                    className="flex items-center justify-center bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    My Orders
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-2 border bg-gray-700 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-2 border bg-gray-700 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Contact
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-2 border bg-gray-700 border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="block w-full pl-10 pr-4 py-2 border bg-gray-800 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-lg flex items-center justify-center disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
