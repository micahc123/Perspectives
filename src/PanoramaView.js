import React, { useState, useCallback } from 'react';
import { useTransition, animated } from '@react-spring/web';
import './PanoramaView.css';

const PanoramaView = ({ images }) => {
  const [index, setIndex] = useState(0);

  const handleArrowClick = useCallback((direction) => {
    setIndex((state) => {
      if (direction === 'right') {
        return (state + 1) % images.length;
      } else {
        return (state - 1 + images.length) % images.length;
      }
    });
  }, [images.length]);

  const transitions = useTransition(index, {
    from: { opacity: 0, filter: 'blur(10px)' },
    enter: { opacity: 1, filter: 'blur(0px)' },
    leave: { opacity: 0, filter: 'blur(10px)' },
    config: { duration: 1500 },
  });

  return (
    <div className="panorama-view">
      {transitions((style, i) => (
        <animated.img
          className="panorama-image"
          src={images[i]}
          alt={`View ${i + 1}`}
          style={style}
        />
      ))}
      <div className="arrow-controls">
        <button onClick={() => handleArrowClick('left')} className="arrow left">←</button>
        <button onClick={() => handleArrowClick('right')} className="arrow right">→</button>
      </div>
    </div>
  );
};

export default PanoramaView;