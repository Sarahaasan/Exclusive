import { useRef, useEffect, useState } from "react";
import Card from "../componants/Card.jsx";
import { useFetch } from "../utils/useFetch.js";
import { Link } from "react-router-dom";
import LoadingSpinner from "../componants/LoadingSpinner.jsx"

const ThisMonth = () => {
  const sliderRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [randomProducts, setRandomProducts] = useState([]);
  
  const { data: response, error } = useFetch(
    `${baseUrl}/Product`
  );
  
  // Extract the products array from the paginated response
  const products = response?.data?.items || [];

// check response 
  // console.log("1. Full Response:", response);
  // console.log("2. Products extracted:", products);
  
  useEffect(() => {
   
    
    if (products.length > 0 && randomProducts.length === 0) {
      const selected = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      setRandomProducts(selected);
    }
  }, [products, randomProducts.length]);

  // Add loading state
  if (!response && !error) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.log("Error occurred:", error);
    return <p className="text-red-500">Error: {error.message || 'Failed to load products'}</p>;
  }

  return (
    <div className="mx-auto max-w-[90%] lg:max-w-[1400px] py-8">
      <p className="text-lg text-[rgba(219,68,68,1)] flex items-center">
        <span className="bg-[rgba(219,68,68,1)] w-4 h-10 inline-block mr-2 rounded mb-3"></span>
        This Month
      </p>

      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
        <h2 className="text-4xl">Best Selling Products</h2>
        <Link to="/products">
          <button className="bg-[rgba(219,68,68,1)] p-3 text-white w-52 rounded-lg">
            View All
          </button>
        </Link>
      </div>
      <div
        ref={sliderRef}
        className="flex flex-col md:flex-row gap-6 overflow-x-auto scroll-smooth items-center md:items-start"
      >
        {randomProducts.length > 0 ? (
          randomProducts.map((product, index) => {
            // console.log(`Rendering product ${index}:`, product);
            return <Card key={product.id || index} product={product} />;
          })
        ) : (
          <p>No products to display</p>
        )}
      </div>
    </div>
  );
};

export default ThisMonth;