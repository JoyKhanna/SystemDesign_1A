import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiPackage,
  FiMapPin,
  FiLoader,
} from 'react-icons/fi';
import { getOrderById } from '../../services/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="spinner" size={40} />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order not found</h2>
        <Link to="/" className="btn-continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        {/* Success Banner */}
        <div className="order-success-banner">
          <FiCheckCircle size={60} className="success-icon" />
          <h1>Order Placed Successfully!</h1>
          <p className="order-id-text">
            Order ID: <strong>#{order.id}</strong>
          </p>
          <p className="order-date-text">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="order-details-grid">
          {/* Delivery Address */}
          <div className="order-section">
            <div className="order-section-header">
              <FiMapPin size={20} />
              <h3>Delivery Address</h3>
            </div>
            <div className="order-section-content">
              <p className="address-name">{order.address_name}</p>
              <p className="address-phone">{order.address_phone}</p>
              <p className="address-text">
                {order.address_line1}
                {order.address_line2 && `, ${order.address_line2}`}
              </p>
              <p className="address-text">
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="order-section">
            <div className="order-section-header">
              <FiPackage size={20} />
              <h3>Order Info</h3>
            </div>
            <div className="order-section-content">
              <div className="info-row">
                <span>Status</span>
                <span className="order-status-badge">
                  {order.status?.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span>Payment Method</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="info-row">
                <span>Items Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="info-row">
                <span>Discount</span>
                <span className="text-green">
                  − {formatPrice(order.discount_amount)}
                </span>
              </div>
              <div className="info-row">
                <span>Delivery Charges</span>
                <span
                  className={
                    parseFloat(order.delivery_charges) === 0
                      ? 'text-green'
                      : ''
                  }
                >
                  {parseFloat(order.delivery_charges) === 0
                    ? 'FREE'
                    : formatPrice(order.delivery_charges)}
                </span>
              </div>
              <div className="info-row total-row">
                <strong>Total Amount</strong>
                <strong>{formatPrice(order.final_amount)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3 className="order-items-title">
            Items Ordered ({order.items?.length || 0})
          </h3>
          <div className="order-items-list">
            {order.items?.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-image">
                  <img
                    src={
                      item.image_url ||
                      'https://via.placeholder.com/80x80?text=Img'
                    }
                    alt={item.product_name}
                  />
                </div>
                <div className="order-item-details">
                  <p className="order-item-name">{item.product_name}</p>
                  <p className="order-item-qty">Qty: {item.quantity}</p>
                  <p className="order-item-price">
                    {formatPrice(item.price)} × {item.quantity} ={' '}
                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="estimated-delivery">
          <FiPackage size={20} />
          <p>
            Estimated delivery by{' '}
            <strong>
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </p>
        </div>

        {/* Actions */}
        <div className="order-actions">
          <Link to="/" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;