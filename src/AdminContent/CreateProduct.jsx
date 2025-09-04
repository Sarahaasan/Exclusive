

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    Name: "",
    CategoryId: "",
    Description: "",
    Price: "",
    Dimensions: "",
    Material: "",
    SKU: "",
    StockQuantity: "",
  });

  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fixed: Remove /api from the URL since baseurl already includes the base path
      const response = await fetch(`${baseurl}/Category`);
      if (response.ok) {
        const data = await response.json();
        // Based on your CategoryHome component, the response has a data property
        setCategories(data.data || []);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.Name.trim()) newErrors.Name = "Product name is required";
    if (!product.CategoryId) newErrors.CategoryId = "Category is required";
    if (!product.Description.trim()) newErrors.Description = "Description is required";
    if (!product.Price || Number(product.Price) <= 0) newErrors.Price = "Price must be greater than 0";
    if (!product.SKU.trim()) newErrors.SKU = "SKU is required";
    if (product.StockQuantity === "" || Number(product.StockQuantity) < 0)
      newErrors.StockQuantity = "Stock quantity must be 0 or greater";
    if (files.length === 0) newErrors.Images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    if (list.length > 0 && errors.Images) {
      setErrors((prev) => ({ ...prev, Images: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please fix all errors before submitting");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Error: Not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Name", product.Name);
      formData.append("CategoryId", String(product.CategoryId));
      formData.append("Description", product.Description);
      formData.append("Price", String(product.Price));
      formData.append("Dimensions", product.Dimensions);
      formData.append("Material", product.Material);
      formData.append("SKU", product.SKU);
      formData.append("StockQuantity", String(product.StockQuantity));

      // Append images
      files.forEach((f) => formData.append("Images", f, f.name));

      const response = await fetch(`${baseurl}/Product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();

      if (response.ok) {
        setMessage("Product added successfully!");
        // Reset form
        setProduct({
          Name: "",
          CategoryId: "",
          Description: "",
          Price: "",
          Dimensions: "",
          Material: "",
          SKU: "",
          StockQuantity: "",
        });
        setFiles([]);
        setErrors({});
      } else {
        try {
          const err = JSON.parse(text);
          const errs = err.value?.errors || [err.value?.message || "Error adding product"];
          setMessage(`Error: ${errs.join(", ")}`);
        } catch {
          setMessage(text || "Error adding product.");
        }
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 my-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
           <Link to="/Admin">
              <p className='text-lg text-gray-500 hover:text-black'> - Back</p>
            </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Add a new product to your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="Name"
              value={product.Name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                errors.Name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Name && <p className="mt-1 text-sm text-red-600">{errors.Name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Category *</label>
              <select
                name="CategoryId"
                value={product.CategoryId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.CategoryId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select Category"}
                </option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  !loadingCategories && <option disabled>No categories available</option>
                )}
              </select>
              {errors.CategoryId && <p className="mt-1 text-sm text-red-600">{errors.CategoryId}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">SKU *</label>
              <input
                type="text"
                name="SKU"
                value={product.SKU}
                onChange={handleInputChange}
                placeholder="Enter SKU"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.SKU ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.SKU && <p className="mt-1 text-sm text-red-600">{errors.SKU}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Description *</label>
            <textarea
              name="Description"
              value={product.Description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows="4"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all ${
                errors.Description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Description && <p className="mt-1 text-sm text-red-600">{errors.Description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                name="Price"
                value={product.Price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.Price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Price && <p className="mt-1 text-sm text-red-600">{errors.Price}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="StockQuantity"
                value={product.StockQuantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.StockQuantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.StockQuantity && <p className="mt-1 text-sm text-red-600">{errors.StockQuantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Dimensions</label>
              <input
                type="text"
                name="Dimensions"
                value={product.Dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 10x20x30 cm"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Material</label>
              <input
                type="text"
                name="Material"
                value={product.Material}
                onChange={handleInputChange}
                placeholder="e.g., Cotton, Wood, Metal"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Product Images *
            </label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
              errors.Images ? "border-red-500" : "border-gray-300"
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload images or drag and drop</p>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
            {errors.Images && (
              <p className="mt-1 text-sm text-red-600">{errors.Images}</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center mb-6 flex items-center justify-center gap-2 ${
                message.startsWith("Error") || message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {(message.startsWith("Error") || message.includes("Error")) ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message}
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setProduct({
                  Name: "",
                  CategoryId: "",
                  Description: "",
                  Price: "",
                  Dimensions: "",
                  Material: "",
                  SKU: "",
                  StockQuantity: "",
                });
                setFiles([]);
                setErrors({});
                setMessage("");
              }}
              className="py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;