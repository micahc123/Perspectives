import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './Path.css';

function Path({ name, image, description, ethnicity, animation, onClick }) {
  return (
    <animated.div className="path" style={animation}>
      <div className="path-content">
        <div className="path-description">
          <h2>{name}</h2>
          <p>{description}</p>
          <p><strong>Ethnicity:</strong> {ethnicity}</p>
        </div>
          <button className="btn btn-secondary btn-lg" onClick={onClick}>Play {name}</button>
        </div>
    </animated.div>
  );
}

export default Path;