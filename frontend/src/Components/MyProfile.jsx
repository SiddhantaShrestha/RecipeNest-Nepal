import React, { useState, useEffect } from "react";
import axios from "axios";
import SubNavbar from "./SubNavbar"; // Import SubNavbar component
import Navbar from "./Navbar";

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/register/my-profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        contact: response.data.data.contact,
        email: response.data.data.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data.message);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated profile data
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:8000/register/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert("Profile updated successfully!");
      setEditMode(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error.response?.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar></Navbar>
      {/* SubNavbar Component */}
      <SubNavbar />

      {/* Profile Container */}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, {profile.name}
        </h1>

        {/* View or Edit Profile */}
        {!editMode ? (
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Contact:</strong> {profile.contact}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
              Edit Profile
            </button>
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
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
