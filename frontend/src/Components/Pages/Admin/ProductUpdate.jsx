import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData, refetch } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    refetch();

    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();

      toast.success(`Product successfully updated`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <AdminMenu />
        </div>

        <div className="md:w-3/4 bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">
            Update / Delete Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-300 mb-4">
                Product Image
              </h3>

              {image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={`http://localhost:8000/${image}`}
                    alt={name}
                    className="max-h-64 object-contain rounded-md border border-gray-700"
                  />
                </div>
              )}

              <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">
                    {image ? "Change image" : "Upload product image"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-300"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-300"
                >
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brand name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-300"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Available stock"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Product description"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Update Product
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
