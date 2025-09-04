import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../componants/Card";
import { useFetch } from "../utils/useFetch";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all products from API
  const { data: productsResponse, error: productsError, loading } = useFetch(`${baseUrl}/product`);

  useEffect(() => {
    // console.log("Products Response:", productsResponse); // Debug log
    
    if (productsResponse) {
      // Get wishlist IDs from localStorage
      const wishlistIds = JSON.parse(localStorage.getItem('wishlistIds') || '[]');
    //   console.log("Wishlist IDs from localStorage:", wishlistIds); // Debug log
      
   
      let products = [];
      if (productsResponse.items && Array.isArray(productsResponse.items)) {
        products = productsResponse.items;
      } else if (productsResponse.data && Array.isArray(productsResponse.data.items)) {
        products = productsResponse.data.items;
      } else if (Array.isArray(productsResponse)) {
        products = productsResponse;
      } else if (productsResponse.data && Array.isArray(productsResponse.data)) {
        products = productsResponse.data;
      }
      
      console.log("Products array:", products); // Debug log
      
      // Filter products based on wishlist IDs
      const filteredProducts = products.filter(product => 
        wishlistIds.includes(product.id)
      );
      
    //   console.log("Filtered products:", filteredProducts); // Debug log
      
      setWishlistProducts(filteredProducts);
      setIsLoading(false);
    } else if (productsError) {
      console.error("Error fetching products:", productsError);
      setIsLoading(false);
    } else if (!loading && !productsResponse) {
      setIsLoading(false);
    }
  }, [productsResponse, productsError, loading]);


  useEffect(() => {
    const handleStorageChange = () => {
      if (productsResponse) {
        const wishlistIds = JSON.parse(localStorage.getItem('wishlistIds') || '[]');
        
       
        let products = [];
        if (productsResponse.items && Array.isArray(productsResponse.items)) {
          products = productsResponse.items;
        } else if (productsResponse.data && Array.isArray(productsResponse.data.items)) {
          products = productsResponse.data.items;
        } else if (Array.isArray(productsResponse)) {
          products = productsResponse;
        } else if (productsResponse.data && Array.isArray(productsResponse.data)) {
          products = productsResponse.data;
        }
        
        const filteredProducts = products.filter(product => 
          wishlistIds.includes(product.id)
        );
        setWishlistProducts(filteredProducts);
      }
    };

  
    window.addEventListener('storage', handleStorageChange);
    
  
    window.addEventListener('wishlistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, [productsResponse]);


  useEffect(() => {
    const dispatchWishlistUpdate = () => {
      window.dispatchEvent(new Event('wishlistUpdated'));
    };

  
    dispatchWishlistUpdate();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[90%] lg:max-w-[1400px] py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start adding items you love to your wishlist
          </p>
          <Link to="/products">
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/products">
              <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;