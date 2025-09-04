import "./App.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Footer from "./componants/Footer.jsx";
import Contact from "./pages/Contact.jsx";
import ScrollToTop from "./componants/Backtotop.jsx";
import AllProducts from "./pages/AllProducts.jsx";

import AddToCart from "./pages/AddToCart";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/UseAuth '; 
import ProductDetails from  "./pages/ProductDetails ";
import Checkout from "./pages/CheckOut";
import PublicRoute from './context/PublicRoute';
import Header from "./componants/Header";
import Wishlist from "./pages/Whishlist";
import SignUp from "./pages/SignUp";
import About from "./pages/About"
import Profile from "./pages/Profile"
import Admin from "./AdminContent/AdminProfile.jsx"
import CreateProduct from "./AdminContent/CreateProduct.jsx"
import CreateCat from "./AdminContent/CreateCat.jsx"
import Adv from "./AdminContent/Advertisments.jsx"



if(!localStorage.getItem("token"))
{
  localStorage.clear()
}

function App() {
  return (
   <AuthProvider>
      <Router>
        <Header/>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/CreateProduct" element={<CreateProduct />} />
          <Route path="/CreateCat" element={<CreateCat />} />
          <Route path="/Cart" element={<AddToCart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Whishlist" element={<Wishlist />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/adv" element={<adv />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
