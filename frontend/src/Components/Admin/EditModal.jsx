import React from "react";

const EditModal = ({
  selectedUser,
  editFormData,
  handleEditInputChange,
  handleUpdateUser,
  editLoading,
  setIsEditModalOpen,
}) => {
  return (
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
  );
};

export default EditModal;
