import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubNavbar from "../SubNavbar";
import Navbar from "../Navbar";
import {
  useGetMyProfileQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify"; // Assuming you have react-toastify for notifications

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SubNavbar />
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
          <p className="text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SubNavbar />
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
          <p className="text-center text-red-500">
            Error loading profile: {error?.data?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Destructure profile data for cleaner JSX
  const profile = profileData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SubNavbar />

      {/* Profile Container */}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, {profile.username}
        </h1>

        {/* View or Edit Profile */}
        {!editMode ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Contact:</strong> {profile.contact}
            </p>
            <p>
              <strong>Status:</strong> {profile.isAdmin ? "Admin" : "User"}
            </p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
              >
                Edit Profile
              </button>
              <Link
                to="/user-orders"
                className="bg-pink-600 text-white py-2 px-4 rounded mt-4 hover:bg-pink-700"
              >
                My Orders
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block font-medium">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block font-medium">Contact:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border bg-gray-100 rounded"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
