import { useFetch } from "../utils/useFetch.js";
import  { useState, useEffect, useRef } from "react";
import Card from "../componants/Card";
import LoadingSpinner from "../componants/LoadingSpinner";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const AllProducts =() => 
{
      const sliderRef = useRef(null);
    //   const { data: products, error } = useFetch(
    //     "https://fakestoreapi.com/products"
    //   );
      const { data: response, error } = useFetch(
            `${baseUrl}/Product`
      );

      // ❌❌
  //     console.log("API Response:", response);
  //    console.log("Type of products:", typeof response);
  // console.log("Is products an array?", Array.isArray(response));

      const products = response?.data?.items || [];
      // console.log(products);
    

 if (!response && !error) {
    return <LoadingSpinner />;
  }

  if (error) return <p className="text-red-600">Error loading products.</p>;
    return (
      <>
           <div className="mx-auto max-w-[90%] lg:max-w-[1400px] py-8">
      <h2 className="text-3xl font-bold mb-6">All Products</h2>

      <div
        ref={sliderRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
    </div>
      </>
    )
}
export default AllProducts;