import { SliderButtons } from "../pages/Home.jsx";
import { useFetch } from "../utils/useFetch.js";
import { useRef } from "react";
import Card from "../componants/Card.jsx";
import { Link } from "react-router-dom";
import LoadingSpinner from "../componants/LoadingSpinner.jsx"

const ProductsSection = () => {
  const sliderRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Fetch products with pagination parameters
  const { data: response, error } = useFetch(
    `${baseUrl}/Product?PageNumber=1&PageSize=16`
  );

  // Extract products and pagination info from the response
  const productsArray = response?.data?.items || [];

//   check response 
//   const pagination = response?.data || {};
  
//   console.log("API Response:", response);
//   console.log("Products Array:", productsArray);
//   console.log("Pagination Info:", {
//     currentPage: pagination.pageNumber,
//     totalPages: pagination.totalPages,
//     hasNext: pagination.hasNextPage,
//     hasPrevious: pagination.hasPreviousPage
//   });

  // Loading state
   if (!response && !error) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    console.error("Error loading products:", error);
    return <p className="text-red-500">Error loading products: {error.message || 'Unknown error'}</p>;
  }

  // Create chunks of 8 products for slider view (optional)
  const chunkedProducts = [];
  for (let i = 0; i < productsArray.length; i += 8) {
    chunkedProducts.push(productsArray.slice(i, i + 8));
  }
  
  return (
    <div className="mx-auto max-w-[90%] lg:max-w-[1400px] py-8">
      <p className="text-lg text-[rgba(219,68,68,1)] flex items-center">
        <span className="bg-[rgba(219,68,68,1)] w-4 h-10 inline-block mr-2 rounded mb-3"></span>
        Our Products
      </p>

      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
        <h2 className="text-4xl">Explore Our Products</h2>
        <SliderButtons sliderRef={sliderRef} />
      </div>

    
      <div ref={sliderRef} className="overflow-x-auto scroll-smooth no-scrollbar">
        <div className="flex gap-8">
          {chunkedProducts.map((group, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-6 min-w-full flex-shrink-0"
            >
              {group.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/products">
          <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
            View All Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductsSection;