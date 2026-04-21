import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/api';
import CategoryBar from '../../components/CategoryBar/CategoryBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FiChevronDown, FiLoader } from 'react-icons/fi';
import './Home.css';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_low', label: 'Price -- Low to High' },
  { value: 'price_high', label: 'Price -- High to Low' },
  { value: 'rating', label: 'Popularity' },
  { value: 'discount', label: 'Discount' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sort, setSort] = useState('relevance');
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 40 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort !== 'relevance') params.sort = sort;

      const response = await getProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getPageTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (category) return category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return 'All Products';
  };

  return (
    <div className="home-page">
      <CategoryBar />

      <div className="home-container">
        {/* Sort Bar */}
        <div className="sort-bar">
          <div className="sort-bar-left">
            <h2 className="page-title">{getPageTitle()}</h2>
            {pagination.total !== undefined && (
              <span className="result-count">
                (Showing {products.length} of {pagination.total} products)
              </span>
            )}
          </div>
          <div className="sort-bar-right">
            <span className="sort-label">Sort By</span>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`sort-btn ${sort === option.value ? 'active' : ''}`}
                onClick={() => setSort(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="loading-container">
            <FiLoader className="spinner" size={40} />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-container">
            <img
              src="https://rukminim1.flixcart.com/www/100/100/promos/23/08/2020/c5f14d2a-2431-4a36-b6cb-8b5b5e283d4f.png"
              alt="No results"
              className="empty-image"
            />
            <h3>Sorry, no results found!</h3>
            <p>Please check the spelling or try searching for something else</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;