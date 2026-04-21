import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiLoader } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSummary, refreshCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.trim()))
      newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.address_line1.trim())
      newErrors.address_line1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode.trim()))
      newErrors.pincode = 'Enter a valid 6-digit pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setPlacing(true);
      const response = await placeOrder({ address: formData });
      await refreshCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left: Address Form */}
        <div className="checkout-left">
          {/* Step 1: Address */}
          <div className="checkout-step active">
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>DELIVERY ADDRESS</h3>
            </div>
            <form className="address-form" onSubmit={handlePlaceOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  placeholder="House No., Building, Street, Area"
                  className={errors.address_line1 ? 'error' : ''}
                />
                {errors.address_line1 && (
                  <span className="error-text">{errors.address_line1}</span>
                )}
              </div>

              <div className="form-group">
                <label>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  placeholder="Landmark, Nearby"
                />
              </div>

              <div className="form-row form-row-3">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && (
                    <span className="error-text">{errors.city}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && (
                    <span className="error-text">{errors.state}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && (
                    <span className="error-text">{errors.pincode}</span>
                  )}
                </div>
              </div>

              {/* Step 2: Order Summary */}
              <div className="checkout-order-summary">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <h3>ORDER SUMMARY</h3>
                </div>
                <div className="checkout-items-preview">
                  {cartItems.map((item) => (
                    <div key={item.id} className="checkout-item-preview">
                      <img
                        src={
                          item.image_url ||
                          'https://via.placeholder.com/48x48?text=Img'
                        }
                        alt={item.name}
                      />
                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{item.name}</p>
                        <p className="checkout-item-qty">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="checkout-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="checkout-payment">
                <div className="step-header">
                  <span className="step-number">3</span>
                  <h3>PAYMENT</h3>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                    id="cod"
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-confirm-order"
                disabled={placing}
              >
                {placing ? (
                  <>
                    <FiLoader className="spinner" size={18} />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiMapPin size={18} />
                    CONFIRM ORDER — {formatPrice(cartSummary.totalAmount)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Price Details */}
        <div className="checkout-right">
          <div className="price-details">
            <h3 className="price-details-title">PRICE DETAILS</h3>
            <div className="price-row">
              <span>Price ({cartSummary.itemCount} items)</span>
              <span>{formatPrice(cartSummary.subtotal)}</span>
            </div>
            <div className="price-row">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;