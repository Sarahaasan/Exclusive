import SaleCard from "../componants/saleCard.jsx";
import React, { useState, useEffect, useRef } from "react";
import { SliderButtons } from "../pages/Home.jsx";
import CountdownTimer from "../componants/CountDown.jsx";
import { useFetch } from "../utils/useFetch.js";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SalesHome = () => {
  const sliderRef = useRef(null);
  
  // Fetch products with pagination parameters (same as ProductsSection)
  const { data: response, error } = useFetch(
    `${baseUrl}/Product?PageNumber=1&PageSize=10`
  );
  
  // Extract products from response using the same structure
  const products = response?.data?.items || [];
  
  // timer
  const [targetDate, setTargetDate] = useState(null);
  
  useEffect(() => {
    setTargetDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // 3 days from now
  }, []);

  return (
    <div className="py-8 mt-10" id="saleproducts">
      <p className="text-lg text-[rgba(219,68,68,1)] flex items-center">
        <span className="bg-[rgba(219,68,68,1)] w-4 h-10 inline-block mr-2 rounded mb-3"></span>
        Todays
      </p>
      
      {/* sales timer */}
      <div className="flex items-center justify-between mb-4 flex-col md:flex-row">
        <div className="flex items-center gap-8 flex-col md:flex-row mb-2">
          <h2 className="text-4xl">Flash Sales</h2>
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* scrolling buttons */}
        <SliderButtons sliderRef={sliderRef} />
      </div>

      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-hidden scroll-smooth"
      >
        {products.length > 0 ? (
          products.map((p) => (
            <SaleCard key={p.id} product={p} />
          ))
        ) : (
          !error && <p>Loading products...</p>
        )}
        {error && <p>Error loading products</p>}
      </div>

      <div className="flex justify-center">
        <Link to="./products">
        <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
          View All Products
        </button>
        </Link>
      </div>
    </div>
  );
};

export default SalesHome;