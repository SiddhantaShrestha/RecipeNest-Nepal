import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter category name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex justify-between">
        <button className="bg-purple-500 text-white py-2 px-5 rounded-lg hover:bg-purple-600 transition-all">
          {buttonText}
        </button>
        {handleDelete && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-5 rounded-lg hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
