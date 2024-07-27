import React, { useRef } from 'react';
import { useSpring, useTrail, animated, useSpringRef, useChain } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function HomePage() {
  const navigate = useNavigate();

  const headingRef = useSpringRef();
  const headingAnimation = useSpring({
    ref: headingRef,
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  const buttonRef = useSpringRef();
  const buttonAnimation = useSpring({
    ref: buttonRef,
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  const text = "A collection of stories about low income first generation students.";
  const words = text.split(" ");
  const trailRef = useSpringRef();
  const trail = useTrail(words.length, {
    ref: trailRef,
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 200 },
  });

  useChain([headingRef, buttonRef, trailRef], [0, 0, 1]);

  const handleStartClick = () => {
    navigate('/game');
  };

  return (
    <header className="App-header">
      <div className="project-info">
        <animated.h1 style={headingAnimation}>Perspective</animated.h1>
        <div className="animated-text small-text">
          {trail.map((style, index) => (
            <animated.span key={index} style={style}>
              {words[index]}&nbsp;
            </animated.span>
          ))}
        </div>
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