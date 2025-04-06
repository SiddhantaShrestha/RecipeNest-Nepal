import { useState } from "react";
import { toast } from "react-toastify";
import {
  useSubmitProductMutation,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";

const ProductSubmission = () => {
  const [submitProduct, { isLoading }] = useSubmitProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    countInStock: 0,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    // Create a local preview URL
    setImageUrl(URL.createObjectURL(file));

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      // Reset on error
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!image) {
      return toast.error("Please upload a product image");
    }

    for (const field in formData) {
      if (!formData[field]) {
        return toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    }

    try {
      // Create form data for submission with image
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      submitData.append("image", image);

      await submitProduct(submitData).unwrap();

      toast.success("Product submitted for approval");

      // Reset form
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
      });
      setImage("");
      setImageUrl(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Failed to submit product");
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-800 bg-gray-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Submit a New Product</h1>
          <p className="text-gray-400 mt-1">
            Products require admin approval before being listed in the store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">
              Product Image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-700"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-2/3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="block w-full text-gray-400 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-purple-600 file:text-white
                    hover:file:bg-purple-700
                    focus:outline-none"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Upload a high-quality image of your product (max 5MB)
                </p>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage("");
                      setImageUrl(null);
                    }}
                    className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-md text-sm hover:bg-red-500/30 transition-colors"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-gray-300 font-medium"
              >
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter brand name"
              />
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-gray-300 font-medium"
              >
                Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-gray-300 font-medium"
              >
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="countInStock"
                className="block text-gray-300 font-medium"
              >
                Count In Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="countInStock"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleInputChange}
                min="0"
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-gray-300 font-medium"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 font-medium"
            >
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Provide a detailed description of your product..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>

      {/* Submission Guidelines */}
      <div className="mt-8 bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-800 bg-gray-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            Submission Guidelines
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">1</span>
            </div>
            <p className="text-gray-300">
              Provide accurate and detailed information about your product.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">2</span>
            </div>
            <p className="text-gray-300">
              Upload a high-quality image that clearly shows the product.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">3</span>
            </div>
            <p className="text-gray-300">
              An admin will review your submission, and you'll be notified once
              it's approved or if changes are needed.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">4</span>
            </div>
            <p className="text-gray-300">
              You can check the status of your submissions in the "My
              Submissions" section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSubmission;
