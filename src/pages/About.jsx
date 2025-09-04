import React from "react";
import "../css/About.css";
import { FaStore, FaShoppingCart, FaDollarSign, FaTwitter, FaLinkedin, FaTruck, FaHeadset, FaUndo, FaInstagram, FaShoppingBag } from "react-icons/fa";
import SideImage from "../assets/SideImagelogin.png";
import { FaWallet } from "react-icons/fa6";
import Image from "../assets/4.png";



export default function About() {
  return (
    <div className="about-page">
     
      <section className="about-hero">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by
            wide range of tailored marketing, data and service solutions,
            Exclusive has 10,500 sellers and 300 brands and serves 3 million
            customers across the region.
          </p>
          <p>
            Exclusive has more than 1 Million products to offer, growing at a
            very fast pace. Exclusive offers a diverse assortment in categories
            ranging from consumer.
          </p>
        </div>
        <div className="about-image">
          <img src={SideImage}alt="About banner" />
        </div>
      </section>

     
      <section className="about-stats">
        <div className="stat-box">
          <FaStore className="stat-icon" />
          <h3>10.5k</h3>
          <p>Sellers active on our site</p>
        </div>
        <div className="stat-box active">
          <FaDollarSign className="stat-icon" />
          <h3>33k</h3>
          <p>Monthly Product Sale</p>
        </div>
        <div className="stat-box">
          <FaShoppingBag className="stat-icon" />
          <h3>45.5k</h3>
          <p>Customers active on our site</p>
        </div>
        <div className="stat-box">
          <FaWallet className="stat-icon" />
          <h3>25k</h3>
          <p>Annual gross sales in our site</p>
        </div>
      </section>

      
      <section className="about-team">
        <div className="team-member">
          <img src={Image}  />
          <h4>Tom Cruise</h4>
          <p>Founder & Chairman</p>
          <div className="social-icons">
            <FaTwitter /> <FaInstagram /> <FaLinkedin />
          </div>
        </div>
        <div className="team-member">
          <img src={Image} />
          <h4>Emma Watson</h4>
          <p>Managing Director</p>
          <div className="social-icons">
            <FaTwitter /> <FaInstagram /> <FaLinkedin />
          </div>
        </div>
        <div className="team-member">
          <img src={Image}  />
          <h4>Will Smith</h4>
          <p>Product Designer</p>
          <div className="social-icons">
            <FaTwitter /> <FaInstagram /> <FaLinkedin />
          </div>
        </div>
      </section>
<div className="dots">
          
          <span></span>
          <span></span>
          <span className="active"></span>
          <span></span>
          <span></span>
        </div>
     
      <section className="about-features">
        <div className="feature-box">
          <FaTruck className="feature-icon" />
          <h4>FREE AND FAST DELIVERY</h4>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div className="feature-box">
          <FaHeadset className="feature-icon" />
          <h4>24/7 CUSTOMER SERVICE</h4>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="feature-box">
          <FaUndo className="feature-icon" />
          <h4>MONEY BACK GUARANTEE</h4>
          <p>We return money within 30 days</p>
        </div>
      </section>
    </div>
  );
}
