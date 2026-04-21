import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiTag,
  FiShield,
  FiLoader,
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import {
  updateCartItem,
  removeFromCart as removeCartItem,
} from '../../services/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartSummary, loading, refreshCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      setUpdatingId(cartItemId);
      await updateCartItem(cartItemId, newQty);
      await refreshCart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setUpdatingId(cartItemId);
      await removeCartItem(cartItemId);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="spinner" size={40} />
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <img
            src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560571e8.png"
            alt="Empty cart"
            className="cart-empty-image"
          />
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <Link to="/" className="btn-shop-now">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2>My Cart ({cartSummary.itemCount})</h2>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <Link
                to={`/product/${item.product_id}`}
                className="cart-item-image"
              >
                <img
                  src={
                    item.image_url ||
                    'https://via.placeholder.com/112x112?text=No+Image'
                  }
                  alt={item.name}
                />
              </Link>

              <div className="cart-item-details">
                <Link
                  to={`/product/${item.product_id}`}
                  className="cart-item-name"
                >
                  {item.name}
                </Link>
                <p className="cart-item-brand">{item.brand}</p>

                <div className="cart-item-pricing">
                  <span className="cart-item-price">
                    {formatPrice(item.price)}
                  </span>
                  {item.original_price &&
                    parseFloat(item.original_price) >
                      parseFloat(item.price) && (
                      <>
                        <span className="cart-item-original">
                          {formatPrice(item.original_price)}
                        </span>
                        <span className="cart-item-discount">
                          {item.discount_percent}% off
                        </span>
                      </>
                    )}
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || updatingId === item.id}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="qty-value">
                      {updatingId === item.id ? '...' : item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={updatingId === item.id}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updatingId === item.id}
                  >
                    <FiTrash2 size={14} />
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-place-order-bar">
            <button
              className="btn-place-order"
              onClick={() => navigate('/checkout')}
            >
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="cart-summary-section">
          <div className="price-details">
            <h3 className="price-details-title">PRICE DETAILS</h3>
            <div className="price-row">
              <span>Price ({cartSummary.itemCount} items)</span>
              <span>{formatPrice(cartSummary.subtotal)}</span>
            </div>
            <div className="price-row discount-row">
              <span>Discount</span>
              <span className="text-green">
                − {formatPrice(cartSummary.discount)}
              </span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span
                className={
                  parseFloat(cartSummary.deliveryCharges) === 0
                    ? 'text-green'
                    : ''
                }
              >
                {parseFloat(cartSummary.deliveryCharges) === 0
                  ? 'FREE'
                  : formatPrice(cartSummary.deliveryCharges)}
              </span>
            </div>
            <div className="price-row total-row">
              <strong>Total Amount</strong>
              <strong>{formatPrice(cartSummary.totalAmount)}</strong>
            </div>

            {parseFloat(cartSummary.discount) > 0 && (
              <p className="savings-info">
                You will save {formatPrice(cartSummary.discount)} on this order
              </p>
            )}
          </div>

          <div className="cart-safe-info">
            <FiShield size={24} color="#878787" />
            <span>
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;