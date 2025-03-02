import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import Loader from "../Loader";
import { toast } from "react-toastify";
import Navbar from "../Navbar";
import EditModal from "./EditModal";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../redux/api/userApiSlice.js";

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <div className="mb-4">
            <p className="text-gray-600">ID</p>
            <p className="font-medium">{selectedUser._id}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{selectedUser.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Username</p>
            <p className="font-medium">{selectedUser.username}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{selectedUser.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Admin Status</p>
            <p className="font-medium">
              {selectedUser.isAdmin ? "Admin" : "Not Admin"}
            </p>
          </div>
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const DeleteModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Delete User</h2>
          <p className="mb-4">
            Are you sure you want to delete the user:{" "}
            <strong>{selectedUser.name}</strong>?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
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
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        {fetchLoading ? (
          <Loader />
        ) : fetchError ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            {fetchError?.data?.message ||
              "An error occurred while fetching users"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user._id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap flex space-x-2">
                        <button
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          onClick={() => handleViewUser(user._id)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditClick(user)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
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
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isViewModalOpen && <ViewModal />}
        {isEditModalOpen && selectedUser && (
          <EditModal
            selectedUser={selectedUser}
            editFormData={editFormData}
            handleEditInputChange={handleEditInputChange}
            handleUpdateUser={handleUpdateUser}
            editLoading={editLoading}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        )}
        {isDeleteModalOpen && <DeleteModal />}
      </div>
    </div>
  );
};

export default UserList;
