"use client";

import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaEye,
  FaSearch,
  FaUserCog,
  FaSync,
} from "react-icons/fa";
import Loader from "../../Loader.jsx";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../../redux/api/userApiSlice.js";
import AdminMenu from "./AdminMenu.jsx";

const UserList = () => {
  // State for modals and selected user
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    username: "",
    email: "",
    isAdmin: false,
  });

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [adminFilter, setAdminFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // RTK Query hooks
  const {
    data: users = [],
    isLoading: fetchLoading,
    error: fetchError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const [updateUser, { isLoading: editLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  // Filter users based on search term and admin status
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter((user) => {
        const matchesSearch =
          searchTerm === "" ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAdminFilter =
          adminFilter === "all" ||
          (adminFilter === "admin" && user.isAdmin) ||
          (adminFilter === "user" && !user.isAdmin);

        return matchesSearch && matchesAdminFilter;
      });

      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm, adminFilter]);

  // View user details
  const handleViewUser = async (userId) => {
    try {
      const user = users.find((user) => user._id === userId);
      if (user) {
        setSelectedUser(user);
        setIsViewModalOpen(true);
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user details");
    }
  };

  // Edit user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser({
        userId: selectedUser._id,
        userData: editFormData,
      }).unwrap();

      if (result.success) {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
        refetchUsers();
      } else {
        toast.error(result.message || "Failed to update user");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while updating user"
      );
    }
  };

  // Delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(selectedUser._id).unwrap();

      if (result.success) {
        toast.success("User deleted successfully");
        setIsDeleteModalOpen(false);
        refetchUsers();
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while deleting user"
      );
    }
  };

  // Modal components
  const ViewModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl animate-slideIn">
          <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FaUserCog className="mr-2 text-purple-500" />
              User Details
            </h2>
            <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
              ID: {selectedUser._id.substring(0, 8)}...
            </div>
          </div>

          <div className="space-y-5 my-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Full Name
              </p>
              <p className="font-medium text-white">{selectedUser.name}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Username
              </p>
              <p className="font-medium text-white">{selectedUser.username}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Email Address
              </p>
              <p className="font-medium text-white">{selectedUser.email}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Admin Status
              </p>
              <div className="flex items-center mt-1">
                {selectedUser.isAdmin ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                    <FaCheck className="mr-1.5" /> Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-400 border border-gray-700">
                    <FaTimes className="mr-1.5" /> Regular User
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-800">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl animate-slideIn">
          <div className="flex items-center text-red-500 mb-4">
            <FaTrash className="mr-2" size={20} />
            <h2 className="text-xl font-bold">Delete User</h2>
          </div>

          <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 my-6">
            <p className="text-gray-300">
              Are you sure you want to delete the user:{" "}
              <span className="font-semibold text-white block mt-1">
                {selectedUser.name}
              </span>
            </p>
            <p className="text-red-400 text-sm mt-3">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-900 disabled:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <AdminMenu />
      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-80"></div>
          <div className="relative z-10 px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-200 max-w-2xl">
              View, edit, and manage user accounts from a central dashboard.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-white text-lg mr-2">
              All Users
            </span>
            <span className="bg-purple-600/20 text-purple-400 px-2.5 py-1 rounded-full text-xs">
              {users.length} total
            </span>
          </div>
          <button
            onClick={refetchUsers}
            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center font-medium"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>

        {/* Search and filter section */}
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="admin">Admin Only</option>
                <option value="user">Regular Users Only</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setAdminFilter("all");
                }}
                className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-700"
              >
                Clear Filters
              </button>
              <div className="bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg border border-gray-700">
                {filteredUsers.length} results
              </div>
            </div>
          </div>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center items-center py-20 bg-gray-900 rounded-xl border border-gray-800">
            <Loader />
          </div>
        ) : fetchError ? (
          <div className="bg-red-900/20 border border-red-800 p-6 rounded-xl text-red-400 flex items-start">
            <FaTimes className="mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-300 mb-1">
                Error Loading Users
              </p>
              <p>
                {fetchError?.data?.message ||
                  "An error occurred while fetching users"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono truncate max-w-[120px]">
                          {user._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                              <FaCheck className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                              <FaTimes className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 rounded-lg bg-purple-900/30 text-purple-400 hover:bg-purple-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-purple-800/30"
                              onClick={() => handleViewUser(user._id)}
                              title="View"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-blue-800/30"
                              onClick={() => handleEditClick(user)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-red-800/30"
                              onClick={() => handleDeleteClick(user)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FaSearch className="text-gray-600 mb-3" size={32} />
                          <p className="text-gray-400 text-lg mb-1">
                            {searchTerm || adminFilter !== "all"
                              ? "No users found matching your search criteria"
                              : "No users found"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isViewModalOpen && <ViewModal />}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl animate-slideIn">
              <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaEdit className="mr-2 text-blue-500" />
                  Edit User
                </h2>
                <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  ID: {selectedUser._id.substring(0, 8)}...
                </div>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-400 mb-1.5"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      id="isAdmin"
                      checked={editFormData.isAdmin}
                      onChange={handleEditInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label
                      htmlFor="isAdmin"
                      className="ml-3 block text-sm font-medium text-gray-300"
                    >
                      Administrator Access
                    </label>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Administrators have full access to manage all aspects of the
                    system.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-900 disabled:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium"
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isDeleteModalOpen && <DeleteModal />}
      </div>
    </div>
  );
};

export default UserList;
