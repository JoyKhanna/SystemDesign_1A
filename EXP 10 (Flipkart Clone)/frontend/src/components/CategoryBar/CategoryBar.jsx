import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories } from '../../services/api';
import './CategoryBar.css';

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    if (activeCategory === slug) {
      navigate('/');
    } else {
      navigate(`/?category=${slug}`);
    }
  };

  return (
    <div className="category-bar">
      <div className="category-bar-container">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-item ${activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className="category-image-wrapper">
              <img
                src={cat.image_url}
                alt={cat.name}
                className="category-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=' + cat.name[0];
                }}
              />
            </div>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;