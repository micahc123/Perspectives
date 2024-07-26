import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function HomePage() {
  const navigate = useNavigate();

  const headingAnimation = useSpring({
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  const buttonAnimation = useSpring({
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  const handleStartClick = () => {
    navigate('/game');
  };

  return (
    <header className="App-header">
      <div className="project-info">
        <animated.h1 style={headingAnimation}>Perspective</animated.h1>
        <animated.button
          style={buttonAnimation}
          className="btn btn-secondary btn-sm small-button"
          onClick={handleStartClick}
        >
          Start
        </animated.button>
      </div>
    </header>
  );
}

export default HomePage;