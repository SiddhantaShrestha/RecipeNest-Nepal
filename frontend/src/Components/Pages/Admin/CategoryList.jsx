import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../../redux/api/categoryApiSlice";
import CategoryForm from "../../E-commerce components/CategoryForm";
import Modal from "../../E-commerce components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      setName("");
      toast.success(`${result.name} is created`);
    } catch (error) {
      toast.error("Creating category failed, try again");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name} is updated`);
      setModalVisible(false);
    } catch (error) {
      toast.error("Update failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${result.name} is deleted.`);
      setModalVisible(false);
    } catch (error) {
      toast.error("Category deletion failed, try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <AdminMenu />
      <div className="bg-gray-900 shadow-xl rounded-lg p-6 w-full max-w-3xl border border-gray-800">
        <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">
          Manage Categories
        </h2>

        {/* Category Form */}
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <hr className="my-6 border-gray-700" />

        {/* Category List */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories?.map((category) => (
            <button
              key={category._id}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-purple-600 hover:shadow-lg shadow-md"
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
