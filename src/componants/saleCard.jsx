import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Function to render stars from rating
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

const SaleCard = ({ product }) => {
  if (!product) return null;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Calculate discount (you can adjust this based on your needs)
  const discountPercentage = 20;
  const originalPrice = product?.price / (1 - discountPercentage / 100);

  // product details  
  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };
  
  // Check if product is in wishlist on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlistIds') || '[]');
    setIsInWishlist(wishlist.includes(product.id));
  }, [product.id]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    setIsWishlistLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setToastMessage("Please login to add items to wishlist");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsWishlistLoading(false);
      return;
    }

    try {
      if (!isInWishlist) {
        // Add to wishlist
        const wishlistIds = JSON.parse(localStorage.getItem('wishlistIds') || '[]');
        wishlistIds.push(product.id);
        localStorage.setItem('wishlistIds', JSON.stringify(wishlistIds));
        
        setIsInWishlist(true);
        setToastMessage("❤️ Added to wishlist successfully!");
        
        // Try API call but don't wait for it
        fetch(`${baseUrl}/Wishlist/items`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product.id }),
        }).catch(err => console.error("Wishlist API error:", err));
        
      } else {
        // Remove from wishlist
        const wishlistIds = JSON.parse(localStorage.getItem('wishlistIds') || '[]');
        const updatedWishlistIds = wishlistIds.filter(id => id !== product.id);
        localStorage.setItem('wishlistIds', JSON.stringify(updatedWishlistIds));
        
        setIsInWishlist(false);
        setToastMessage("💔 Removed from wishlist");
        
        // Try API call but don't wait for it
        fetch(`${baseUrl}/Wishlist/items/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => console.error("Remove wishlist API error:", err));
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (error) {
      console.error("Wishlist error:", error);
      setToastMessage("Failed to update wishlist");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // add to cart 
  const addToCart = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setToastMessage("Please login to add items to cart");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsLoading(false);
      return;
    }

    if (!product.id) {
      console.error("Product ID is missing");
      setToastMessage("Error: Product ID is missing");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsLoading(false);
      return;
    }

    try {
      const requestPayload = {
        productId: product.id,
        quantity: 1,
      };

      const response = await fetch(`${baseUrl}/Cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) {
        setToastMessage("🛒 Added to cart successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const errorText = await response.text();
        console.error("Cart error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Add to cart error:", error.message);
      setToastMessage(`Failed to add to cart`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 flex-shrink-0 text-white rounded-xl overflow-hidden transition-transform duration-300">
      {/* Image Container */}
      <div className="relative group bg-gray-100 p-3 cursor-pointer">
        {/* Sale badge */}
        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs absolute top-2 left-2 z-10">
          -{discountPercentage}%
        </span>
        
        <button 
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`p-1 rounded-full absolute top-2 right-2 z-10 ${
            isInWishlist 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-black hover:text-red-500'
          } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaHeart className={isInWishlist ? 'fill-current' : ''} />
        </button>

        <button 
          onClick={handleViewProduct}
          className="bg-white text-gray-800 p-1 rounded-full hover:bg-gray-200 absolute top-2 right-10 z-10">
          <FaEye />
        </button>

        <img
          src={product?.imageUrls?.[0] || product?.imageUrl}
          alt={product?.name || "Product"}
          className="w-full h-40 object-cover"
        />

        {/* Add to Cart Button sliding up */}
        <button
          onClick={addToCart}
          disabled={isLoading}
          className="absolute bottom-0 left-0 w-full bg-black text-white px-4 py-2 text-sm transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : '🛒 Add To Cart'}
        </button>
      </div>

      {/* Toast Message - positioned near the heart icon */}
      {showToast && (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in text-white ${
          toastMessage.includes('Failed') || toastMessage.includes('Error') || toastMessage.includes('Please login')
            ? 'bg-red-500' 
            : 'bg-green-500'
        }`}>
          {toastMessage}
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold text-black">{product?.name}</h3>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span className="text-red-400 font-bold">${product?.price}</span>
          <span className="line-through text-gray-400">
            ${originalPrice?.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-yellow-400 text-sm">
          {renderStars(product?.rating?.rate)} ({product?.rating?.count})
        </p>
      </div>
    </div>
  );
};

export default SaleCard;