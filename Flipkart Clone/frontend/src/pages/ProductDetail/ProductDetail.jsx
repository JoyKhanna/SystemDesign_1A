import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiStar,
  FiShoppingCart,
  FiZap,
  FiCheck,
  FiTruck,
  FiShield,
  FiRepeat,
  FiLoader,
} from 'react-icons/fi';
import { getProductById } from '../../services/api';
import { addToCart } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import './ProductDetail.css';

function formatSpecValue(value) {
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      await refreshCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      await refreshCart();
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page product-detail-page--loading">
        <div className="loading-container">
          <FiLoader className="spinner" size={40} />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const price = Number(product.price);
  const originalPrice = product.original_price != null ? Number(product.original_price) : null;
  const savings =
    originalPrice != null && !Number.isNaN(originalPrice) && !Number.isNaN(price)
      ? originalPrice - price
      : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Left Column - Images */}
        <div className="product-detail-left">
          <ImageCarousel images={product.images} />

          <div className="product-detail-buttons">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              <FiShoppingCart size={18} />
              {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={addingToCart || product.stock === 0}
            >
              <FiZap size={18} />
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="product-detail-right">
          {/* Breadcrumb */}
          <p className="product-breadcrumb">
            <Link to="/">Home</Link>
            <span className="product-breadcrumb-sep"> &gt; </span>
            {product.category_name}
            <span className="product-breadcrumb-sep"> &gt; </span>
            {product.brand}
          </p>

          <h1 className="product-detail-name">{product.name}</h1>

          {/* Rating */}
          {Number(product.rating) > 0 && (
            <div className="product-detail-rating">
              <span className="rating-badge-lg">
                {Number(product.rating)} <FiStar size={12} fill="#fff" />
              </span>
              <span className="rating-count-lg">
                {product.rating_count?.toLocaleString()} Ratings & Reviews
              </span>
            </div>
          )}

          {/* Special Price Tag */}
          <div className="product-special-price-tag">Special Price</div>

          {/* Pricing */}
          <div className="product-detail-pricing">
            <span className="detail-price">{formatPrice(price)}</span>
            {originalPrice != null && originalPrice > price && (
              <>
                <span className="detail-original-price">
                  {formatPrice(originalPrice)}
                </span>
                <span className="detail-discount">
                  {product.discount_percent}% off
                </span>
              </>
            )}
          </div>

          {savings > 0 && (
            <p className="savings-text">
              You save {formatPrice(savings)} on this product
            </p>
          )}

          {/* Offers Section */}
          <div className="product-offers">
            <h4>Available Offers</h4>
            <div className="offer-item">
              <span className="offer-icon">🏷️</span>
              <p>
                <strong>Bank Offer</strong> 5% Cashback on Flipkart Axis Bank Card
              </p>
            </div>
            <div className="offer-item">
              <span className="offer-icon">🏷️</span>
              <p>
                <strong>Special Price</strong> Get extra {product.discount_percent}%
                off (price inclusive of cashback/coupon)
              </p>
            </div>
            <div className="offer-item">
              <span className="offer-icon">🏷️</span>
              <p>
                <strong>No Cost EMI</strong> on select cards for orders above ₹3000
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="product-services">
            <div className="service-item">
              <FiTruck size={20} />
              <div>
                <strong>Free Delivery</strong>
                <p>{price >= 500 ? 'Free' : '₹40 delivery charges'}</p>
              </div>
            </div>
            <div className="service-item">
              <FiRepeat size={20} />
              <div>
                <strong>7 Days Replacement</strong>
                <p>Return & replacement policy</p>
              </div>
            </div>
            <div className="service-item">
              <FiShield size={20} />
              <div>
                <strong>1 Year Warranty</strong>
                <p>Brand warranty</p>
              </div>
            </div>
            <div className="service-item">
              <FiCheck size={20} />
              <div>
                <strong>
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : 'Out of Stock'}
                </strong>
                <p
                  className={product.stock > 0 ? 'text-green' : 'text-red'}
                >
                  {product.stock > 0
                    ? 'Available for delivery'
                    : 'Currently unavailable'}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="product-highlights">
              <h3>Highlights</h3>
              <ul>
                {product.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                {Object.entries(product.specifications).map(
                  ([section, specs]) => (
                    <div key={section} className="spec-section">
                      <h4>{section}</h4>
                      <div className="spec-table-wrap">
                        <table className="spec-table">
                          <tbody>
                            {Object.entries(specs).map(([key, value]) => (
                              <tr key={key}>
                                <td className="spec-key">{key}</td>
                                <td className="spec-value">{formatSpecValue(value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;