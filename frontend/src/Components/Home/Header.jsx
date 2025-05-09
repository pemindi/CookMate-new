import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AuthModal from "../Modals/AuthModal";
import AuthService from "../../Services/AuthService";
import { ChefHat, Utensils, Book, ArrowRight } from "lucide-react";
import "../../Styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    };
    
    // Check on component mount
    checkLoginStatus();
    
    // Add event listener to detect localStorage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Also check every time the component is focused
    window.addEventListener('focus', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);

  const authButtonClicked = () => {
    if (isLoggedIn) {
      navigate("/community"); // Navigate to kitchen portal if logged in
    } else {
      setIsAuthModalOpened(true); // Open the login modal if not logged in
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpened(false);
    setIsLoggedIn(true); // Set logged in state to true after successful login
    navigate("/"); // Redirect to home
  };

  return (
    <header className="header">
      <div className="header__background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <div className="header__container">
        <div className="header__left">
         
          <h1>Discover Your Cooking Passion</h1>
          <p>
            Join a vibrant community of food enthusiasts who share recipes, techniques, 
            and the joy of creating memorable dishes from around the world.
          </p>
          
          <div className="cta-buttons">
            <button className="cta-primary" onClick={authButtonClicked}>
              {isLoggedIn ? "My Kitchen Space" : "Start Your Journey"}
              <ArrowRight size={18} />
            </button>
            
            {!isLoggedIn && (
              <button className="cta-secondary">
                Browse Recipes
              </button>
            )}
          </div>
          
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <Book size={24} />
              </div>
              <div className="feature-text">
                <h3>2,500+</h3>
                <p>Unique Recipes</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ChefHat size={24} />
              </div>
              <div className="feature-text">
                <h3>500+</h3>
                <p>Expert Chefs</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Utensils size={24} />
              </div>
              <div className="feature-text">
                <h3>10,000+</h3>
                <p>Community Members</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header__right">
          <div className="image-collage">
            <div className="collage-item collage-item-1"></div>
            <div className="collage-item collage-item-2"></div>
            <div className="collage-item collage-item-3"></div>
            <div className="floating-element floating-element-1">
              <ChefHat size={30} color="#E86A57" />
            </div>
            <div className="floating-element floating-element-2">
              <Utensils size={30} color="#FFB400" />
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        onSuccess={handleAuthSuccess} // Pass success handler to AuthModal
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;