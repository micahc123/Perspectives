import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './Path.css';

function Path({ name, image, description, ethnicity, animation }) {
  return (
    <animated.div className="path" style={animation}>
      <div className="path-content">
        <div className="path-description">
          <h2>{name}</h2>
          <p>{description}</p>
          <p><strong>Ethnicity:</strong> {ethnicity}</p>
        </div>
        <div className="path-image-container">
          <img src={image} alt={name} className="path-image" />
          <button className="btn btn-secondary btn-lg">Play {name}</button>
        </div>
      </div>
    </animated.div>
  );
}

export default Path;