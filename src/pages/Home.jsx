import Hero from "../componants/hero";


import ThisMonth from "../homecomponants/thismonth";
import Black from "../homecomponants/black";
import PRoductsSection from "../homecomponants/OurProducts";
import Features from "../homecomponants/Features";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import CategoryHome from "../homecomponants/CategoryHome.jsx"
import SalesHome from "../homecomponants/SalesHome.jsx"

// slider button 
export function SliderButtons({ sliderRef }) {
  const scrollLeft = () =>
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="flex gap-2 my-3">
      <button
        onClick={scrollLeft}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
      >
        <RiArrowLeftSLine />
      </button>
      <button
        onClick={scrollRight}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
      >
        <RiArrowRightSLine />
      </button>
    </div>
  );
}


const Home = () => {
  return (
    <>
 
      <Hero />
      <div className="mx-auto max-w-[90%] lg:max-w-[1400px] py-8">
   
        <SalesHome />
        <hr />
     
       
        <CategoryHome />

        <hr />
        <ThisMonth />
      </div>
      <Black />
      <PRoductsSection />
      <Features />
      {/* <Link to="/admin"><p className="text-2xl text-red-500 text-center">Admin</p> </Link> */}
    </>
  );
};
export default Home;
