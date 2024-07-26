import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './Game.css';

function Game() {
  const titleAnimation = useSpring({
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  const pathAnimation = useSpring({
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <div className="game-container">
      <animated.h1 style={titleAnimation}>Look through the lens of another student.</animated.h1>
      <div className="paths">
        <animated.div className="path" style={pathAnimation}>
          <img src="path1.jpg" alt="Path 1" className="path-image" />
          <button className="btn btn-secondary btn-lg">Play Path 1</button>
        </animated.div>
        <animated.div className="path" style={pathAnimation}>
          <img src="path2.jpg" alt="Path 2" className="path-image" />
          <button className="btn btn-secondary btn-lg">Play Path 2</button>
        </animated.div>
        <animated.div className="path" style={pathAnimation}>
          <img src="path3.jpg" alt="Path 3" className="path-image" />
          <button className="btn btn-secondary btn-lg">Play Path 3</button>
        </animated.div>
      </div>
    </div>
  );
}

export default Game;