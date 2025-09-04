import {SliderButtons} from '../pages/Home.jsx'
import { useFetch } from "../utils/useFetch";
import { useRef , createContext} from "react";
import LoadingSpinner from "../componants/LoadingSpinner.jsx"

const baseUrl = import.meta.env.VITE_API_BASE_URL;


const CategoryHome = () => {
  // Fetch cat using the custom hook
  const sliderRef = useRef(null);
  const { data: response, error, loading } = useFetch(
    `${baseUrl}/Category`
  );
  
  // Console log the response to verify the structure
  console.log('Response:', response);
  
  if(loading) {
    return <LoadingSpinner/>;
  }
  
  if(error) {
    return <p className="text-red-500 mt-4">Error fetching categories</p>;
  }
  
  // Extract the categories array directly from the response
  const categories = response?.data || [];
  console.log('Categories:', categories);
   const Catnum = categories.length;
  
  return (
    <section className="py-8">
      <p className="text-lg text-[rgba(219,68,68,1)] flex items-center">
        <span className="bg-[rgba(219,68,68,1)] w-4 h-10 inline-block mr-2 rounded mb-3"></span>
        Our Categories
      </p>
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
        <h2 className="text-4xl">Check our Category</h2>
        <SliderButtons sliderRef={sliderRef}/> 
      </div> 
      <div ref={sliderRef} className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition text-red-500 w-[170px] h-[145px] flex-shrink-0 mx-auto"
          >
            <p className="font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryHome;