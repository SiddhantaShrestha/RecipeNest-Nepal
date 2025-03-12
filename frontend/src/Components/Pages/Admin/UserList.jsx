import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import Loader from "../../Loader.jsx";
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
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

  // RTK Query hooks
  const {
    data: users = [],
    isLoading: fetchLoading,
    error: fetchError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const [updateUser, { isLoading: editLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

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
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-xl animate-slideIn">
          <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
            User Details
          </h2>

          <div className="space-y-4 my-4">
            <div>
              <p className="text-gray-400 text-sm">ID</p>
              <p className="font-medium text-gray-200 truncate">
                {selectedUser._id}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="font-medium text-gray-200">{selectedUser.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Username</p>
              <p className="font-medium text-gray-200">
                {selectedUser.username}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-medium text-gray-200">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admin Status</p>
              <div className="flex items-center mt-1">
                {selectedUser.isAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                    <FaCheck className="mr-1" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-400">
                    <FaTimes className="mr-1" /> Not Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-xl animate-slideIn">
          <h2 className="text-xl font-bold mb-4 text-red-400">Delete User</h2>
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete the user:{" "}
            <span className="font-semibold text-white">
              {selectedUser.name}
            </span>
            ?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-red-900 disabled:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminMenu />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={refetchUsers}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Refresh
          </button>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : fetchError ? (
          <div className="bg-red-900/50 border border-red-800 p-4 rounded-lg text-red-400">
            {fetchError?.data?.message ||
              "An error occurred while fetching users"}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono truncate max-w-[120px]">
                          {user._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                              <FaCheck className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400">
                              <FaTimes className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                          <button
                            className="p-2 rounded-full bg-green-900/30 text-green-400 hover:bg-green-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={() => handleViewUser(user._id)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="p-2 rounded-full bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={() => handleEditClick(user)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 rounded-full bg-red-900/30 text-red-400 hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={() => handleDeleteClick(user)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No users found
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
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-xl animate-slideIn">
              <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
                Edit User
              </h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    id="isAdmin"
                    checked={editFormData.isAdmin}
                    onChange={handleEditInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label
                    htmlFor="isAdmin"
                    className="ml-2 block text-sm font-medium text-gray-300"
                  >
                    Admin User
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-900 disabled:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
