import "../css/Header.css";
import { FaHeart, FaShoppingCart, FaSearch, FaUser, FaBox, FaStar, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net/api";

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${baseUrl}/Account/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      window.location.href = "/";
    } else {
      console.error("Logout failed");
      alert("Logout failed ❌");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Error connecting to server.");
  }
};

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <>
      <header className="header">
        <p className="logo">Exclusive</p>
        
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
            {!isLoggedIn && <li><Link to="/signup">Sign Up</Link></li>}
          </ul>
        </nav>

        <div className="search-bar">
          <input type="text" placeholder="What are you looking for?" />
          <FaSearch className="search-icon" />
        </div>
        
        <div className="icons">
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />

          {isLoggedIn ? (
            <div className="profile-menu">
              <FaUser
                id="profile-icon"
                className="icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="dropdown">
                  <ul>
                    <div className="dropdown-icons">
                      <div><FaUser className="dropdown-icon" /></div>
                      <div><li><Link className="myprof" to="/profile">Manage My Account</Link></li></div>
                    </div>

                    <div className="dropdown-icons">
                      <div><FaBox className="dropdown-icon" /></div>
                      <div><li><Link className="myprof" to="/profile">My Orders</Link></li></div>
                    </div>

                    <div className="dropdown-icons">
                      <div><FaStar className="dropdown-icon" /></div>
                      <div><li><Link className="myprof" to="/profile">My Reviews</Link></li></div>
                    </div>

                    <div className="dropdown-icons">
                      <div><TbTrash className="dropdown-icon" /></div>
                      <div><li><Link className="myprof" to="/profile">My Cancellations</Link></li></div>
                    </div>

                    <div className="dropdown-icons-logout">
                      <div><FaSignOutAlt className="dropdown-icon" /></div>
                      <div className="logout">
                        <li>
                          <button className="logout-btn" onClick={handleLogout}>
                            Logout
                          </button>
                        </li>
                      </div>
                    </div>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="login-btn">Log In</button>
            </Link>
          )}
        </div>

        {/* Burger Menu */}
        <div className={`burger-menu ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={closeMobileMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="mobile-search">
          <div className="search-bar">
            <input type="text" placeholder="What are you looking for?" />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <ul>
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
          <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
          {!isLoggedIn && <li><Link to="/signup" onClick={closeMobileMenu}>Sign Up</Link></li>}
        </ul>

        <div className="mobile-icons">
          <Link to="/wishlist">
            <FaHeart className="icon" />
          </Link>
          <Link to="/cart">
            <FaShoppingCart className="icon" />
          </Link>
        </div>

        <div className="mobile-profile-section">
          {isLoggedIn ? (
            <>
              <button className="mobile-profile-btn" onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}>
                <FaUser /> My Account
              </button>
              
              {mobileDropdownOpen && (
                <ul style={{marginTop: '10px'}}>
                  <li><Link to="/profile" onClick={closeMobileMenu}><FaUser style={{marginRight: '10px'}} />Manage My Account</Link></li>
                  <li><Link to="/profile" onClick={closeMobileMenu}><FaBox style={{marginRight: '10px'}} />My Orders</Link></li>
                  <li><Link to="/profile" onClick={closeMobileMenu}><FaStar style={{marginRight: '10px'}} />My Reviews</Link></li>
                  <li><Link to="/profile" onClick={closeMobileMenu}><TbTrash style={{marginRight: '10px'}} />My Cancellations</Link></li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout} style={{width: '100%', justifyContent: 'center'}}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <Link to="/login" onClick={closeMobileMenu}>
              <button className="login-btn" style={{width: '100%'}}>Log In</button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;