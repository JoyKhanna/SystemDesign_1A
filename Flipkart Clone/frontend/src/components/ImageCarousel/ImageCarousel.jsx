import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageCarousel.css';

function normalizeImages(images) {
  if (!images || images.length === 0) return [];
  return images.map((img, index) => {
    if (typeof img === 'string') {
      return { id: `img-${index}`, image_url: img };
    }
    return {
      id: img.id ?? `img-${index}`,
      image_url: img.image_url || img.url || '',
    };
  });
}

const ImageCarousel = ({ images }) => {
  const list = useMemo(() => normalizeImages(images), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [list]);

  const go = useCallback(
    (delta) => {
      if (list.length === 0) return;
      setCurrentIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return list.length - 1;
        if (next >= list.length) return 0;
        return next;
      });
    },
    [list.length]
  );

  const handlePrev = useCallback(() => go(-1), [go]);
  const handleNext = useCallback(() => go(1), [go]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 48) return;
    if (dx > 0) handlePrev();
    else handleNext();
  };

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (list.length === 0) {
    return (
      <div className="carousel carousel--empty" role="img" aria-label="No product image">
        <div className="carousel-main-stage">
          <img
            src="https://via.placeholder.com/500x500?text=No+Image"
            alt=""
            className="carousel-main-image"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  const current = list[currentIndex];

  return (
    <div
      className="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-thumbnails" role="tablist" aria-label="Product images">
        {list.map((img, index) => (
          <button
            key={img.id}
            type="button"
            role="tab"
            aria-selected={index === currentIndex}
            className={`carousel-thumb ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            onMouseEnter={() => setCurrentIndex(index)}
          >
            <img src={img.image_url} alt="" draggable={false} />
          </button>
        ))}
      </div>

      <div className="carousel-main">
        <div className="carousel-main-stage">
          <button
            type="button"
            className="carousel-nav-btn carousel-prev"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <FiChevronLeft size={22} aria-hidden />
          </button>

          <img
            src={current.image_url}
            alt={`Product image ${currentIndex + 1} of ${list.length}`}
            className="carousel-main-image"
            draggable={false}
          />

          <button
            type="button"
            className="carousel-nav-btn carousel-next"
            onClick={handleNext}
            aria-label="Next image"
          >
            <FiChevronRight size={22} aria-hidden />
          </button>
        </div>
        {list.length > 1 && (
          <p className="carousel-dots" aria-hidden>
            {list.map((_, i) => (
              <span key={i} className={i === currentIndex ? 'dot active' : 'dot'} />
            ))}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
