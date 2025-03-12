import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {buttonText}
        </button>

        {handleDelete && (
          <button
            onClick={handleDelete}
            type="button"
            className="bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
