import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartSummary } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-wrapper">
            <span className="logo-text">Flipkart</span>
            <span className="logo-subtitle">
              Explore <span className="logo-plus">Plus</span>
              <img
                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header/helper/plus-702ce0.svg"
                alt="plus"
                className="logo-plus-icon"
              />
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <FiSearch size={20} />
          </button>
        </form>

        {/* Nav Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-link user-link">
            <FiUser size={18} />
            <span>Flipkart User</span>
          </div>

          <Link to="/cart" className="nav-link cart-link">
            <div className="cart-icon-wrapper">
              <FiShoppingCart size={20} />
              {cartSummary.itemCount > 0 && (
                <span className="cart-badge">{cartSummary.itemCount}</span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FiMenu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;