import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} has been created successfully`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Please try again.");
    }
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

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <AdminMenu />
        </div>

        <div className="lg:w-3/4 bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-800 bg-gray-800 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Create New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Image Upload Area */}
            <div className="mb-6">
              <div
                className={`border-2 border-dashed border-gray-700 rounded-lg ${
                  imageUrl ? "bg-gray-800" : "bg-gray-800/50"
                } transition-all hover:bg-gray-800 hover:border-purple-500`}
              >
                {imageUrl ? (
                  <div className="text-center p-4">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="max-h-64 mx-auto object-contain"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      {image.name || "Selected image"}
                    </p>
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
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="mt-2 text-base font-medium text-gray-400">
                      Upload Product Image
                    </span>
                    <span className="text-sm text-gray-500">
                      Click or drag to upload
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Brand
                  </label>
                  <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Enter brand name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Count In Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled selected>
                      Select a category
                    </option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Enter product description"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
