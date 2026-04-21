import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    original_price,
    discount_percent,
    brand,
    rating,
    rating_count,
    primary_image,
  } = product;

  const ratingNum = Number(rating);
  const priceNum = Number(price);
  const originalNum =
    original_price != null ? Number(original_price) : null;

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={primary_image || 'https://via.placeholder.com/280x280?text=No+Image'}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
      </div>

      <div className="product-card-info">
        <h3 className="product-card-brand">{brand}</h3>
        <p className="product-card-name">{name}</p>

        {ratingNum > 0 && (
          <div className="product-card-rating">
            <span className="rating-badge">
              {ratingNum} <FiStar size={10} fill="#fff" />
            </span>
            <span className="rating-count">
              ({rating_count?.toLocaleString()})
            </span>
          </div>
        )}

        <div className="product-card-pricing">
          <span className="product-price">{formatPrice(priceNum)}</span>
          {originalNum != null &&
            !Number.isNaN(originalNum) &&
            originalNum > priceNum && (
            <>
              <span className="product-original-price">
                {formatPrice(originalNum)}
              </span>
              <span className="product-discount">{discount_percent}% off</span>
            </>
          )}
        </div>

        <p className="product-card-delivery">Free delivery</p>
      </div>
    </Link>
  );
};

export default ProductCard;