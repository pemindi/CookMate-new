import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UtensilsCrossed } from "lucide-react";
import "../../Styles/navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is scrolling to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Check login status (this would use your AuthService in a real app)
    const checkLoginStatus = () => {
      // Replace with your actual auth check
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar__scrolled" : ""}`}>
      <div className="nav__container">
        <div className="nav__header">
          <div className="nav__logo">
            <Link to="/">
              <UtensilsCrossed className="logo__icon" size={32} />
              <h1 className="logo__text">Cook<span>Mate</span></h1>
            </Link>
          </div>

          <div className="nav__search">
            <form>
              <input
                type="text"
                placeholder="Search for recipes, ingredients..."
              />
              <button type="submit" className="search__button">
                <Search size={20} />
              </button>
            </form>
          </div>

          <button
            className="nav__menu__btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className={`menu__icon ${menuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        <ul className={`nav__links ${menuOpen ? "open" : ""}`}>
          <li className="nav__item">
            <Link to="/recipes" className="nav__link">
              Recipes
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/categories" className="nav__link">
              Categories
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/about" className="nav__link">
              About Us
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/blog" className="nav__link">
              Blog
            </Link>
          </li>
          <li className="nav__item nav__item--cta">
            {isLoggedIn ? (
              <div className="user-avatar">
                <img
                  src="/api/placeholder/40/40"
                  alt="User Avatar"
                />
              </div>
            ) : (
              <Link to="/signup" className="nav__link--cta">
                Join Now
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;