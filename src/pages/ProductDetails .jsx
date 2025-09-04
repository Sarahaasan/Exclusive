import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import LoadingSpinner from "../componants/LoadingSpinner"

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ProductDetails = () => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details by ID
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${baseUrl}/Product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Product details:', data);
        
        if (data.succeeded) {
          setProduct(data.data);
        } else {
          console.error('Failed to fetch product:', data.message);
        }
      } else {
        console.error('Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    setAddingToCart(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseUrl}/Cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rate) => {
    if (!rate) return null;
    const fullStars = Math.floor(rate);
    const halfStar = rate - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "½" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
      
        <LoadingSpinner/>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/account" className="hover:text-gray-800 text-lg">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 text-lg">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-8 flex justify-center">
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full max-w-md h-96 object-contain"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Product Name */}
          <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-400 text-lg">
              {renderStars(product.rating?.rate || 4.5)}
            </div>
            <span className="text-gray-600">({product.rating?.count || 150} Reviews)</span>
            <span className="text-green-600 ml-4">In Stock</span>
          </div>

          {/* Price */}
          <div className="text-2xl font-semibold text-gray-800">
            ${product.price}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description || "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal. Pressure sensitive."}
          </p>

          {/* Colors */}
          <div>
            <span className="text-gray-700 font-medium">Colours:</span>
            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={() => setSelectedColor('black')}
                className={`w-6 h-6 bg-black rounded-full border-2 ${selectedColor === 'black' ? 'border-gray-800' : 'border-gray-300'}`}
              />
              <button 
                onClick={() => setSelectedColor('red')}
                className={`w-6 h-6 bg-red-500 rounded-full border-2 ${selectedColor === 'red' ? 'border-red-700' : 'border-gray-300'}`}
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <span className="text-gray-700 font-medium">Size:</span>
            <div className="flex items-center gap-3 mt-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === size 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaMinus size={12} />
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-100"
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {addingToCart ? 'Adding...' : 'Buy Now'}
            </button>

            {/* Wishlist Button */}
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
              <FaHeart className="text-gray-600 hover:text-red-500" />
            </button>
          </div>

          {/* Delivery Information */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                🚚
              </div>
              <div>
                <div className="font-medium">Free Delivery</div>
                <div className="text-sm text-gray-600">Enter your postal code for Delivery Availability</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                ↩️
              </div>
              <div>
                <div className="font-medium">Return Delivery</div>
                <div className="text-sm text-gray-600">Free 30 Days Delivery Returns. Details</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;