import React, { useState, useEffect, useRef } from 'react';
import { useSpring, useTrail, animated, useSpringRef, useChain } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import PanoramaViewer from './PanoramaViewer';
import './PathGame.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PathGame = ({ path }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showPopDown, setShowPopDown] = useState(false);
  const popDownRef = useRef(null);
  const navigate = useNavigate();

  const pageDetails = [
    { title: "School", header: "School View", text: "Drag and click around to learn more about my school life" },
    { title: "Home", header: "Home View", text: "Drag and click around to learn more about my home life" },
    { title: "College Admissions Day", header: "CAD View", text: "Drag and click around to open my college letters" },
    { title: "Work", header: "Work View", text: "Drag and click around to learn more about what I do now" }
  ];

  const finalPageText = "You have reached the end of the path. We hope this experience gave you another perspective of someone else's life. We truly believe that understanding others' experiences can help you in choosing your career path and making a difference in the world. Thank you.";

  const handleMainMenu = () => {
    navigate('/');
  };

  const pages = [
    ...path.panoramaImages.map((image, index) => ({
      title: pageDetails[index]?.title || `View ${index + 1}`,
      content: (
        <PanoramaViewer
          imageUrl={typeof image === 'string' ? image : image.url}
          interactivePoints={typeof image === 'string' ? [] : image.interactivePoints || []}
        />
      ),
      header: pageDetails[index]?.header || `View ${index + 1}`,
      text: pageDetails[index]?.text || `This is view ${index + 1} of the path.`
    })),
    {
      title: 'End of Path',
      content: <AnimatedFinalPage text={finalPageText} onMainMenu={handleMainMenu} />,
      header: 'End of Path',
      text: 'You have reached the end of the path'
    }
  ];

  useEffect(() => {
    setShowPopDown(false);

    if (popDownRef.current) {
      popDownRef.current.style.display = 'none';
      void popDownRef.current.offsetHeight; // Trigger a reflow 
      popDownRef.current.style.display = '';
    }

    const showTimer = setTimeout(() => setShowPopDown(true), 50);

    return () => {
      clearTimeout(showTimer);
    };
  }, [pageIndex]);

  const handleNext = () => {
    setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
  };

  const handlePrev = () => {
    setPageIndex((prevIndex) => (prevIndex - 1 + pages.length) % pages.length);
  };

  return (
    <div className="path-game">
      <div className="page-content">
        {pages[pageIndex].content}
        {pageIndex !== pages.length - 1 && (
          <div 
            ref={popDownRef}
            className={`pop-down ${showPopDown ? 'show' : ''}`}
          >
            <h3>{pages[pageIndex].header}</h3>
            <hr />
            <p>{pages[pageIndex].text}</p>
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        {pageIndex > 0 && (
          <button onClick={handlePrev} className="nav-button btn-prev">
            <FaArrowLeft /> Previous
          </button>
        )}
        {pageIndex < pages.length - 1 && (
          <button onClick={handleNext} className="nav-button btn-next">
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

const AnimatedFinalPage = ({ text, onMainMenu }) => {
  const words = text.split(' ');

  const trailRef = useSpringRef();
  const trail = useTrail(words.length, {
    ref: trailRef,
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 50 },
  });

  const buttonRef = useSpringRef();
  const buttonAnimation = useSpring({
    ref: buttonRef,
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { duration: 1000 },
  });

  useChain([trailRef, buttonRef], [0, 1]);

  return (
    <div className="animated-final-page">
      <div className="animated-text">
        {trail.map((style, index) => (
          <animated.span key={index} style={style}>
            {words[index]}&nbsp;
          </animated.span>
        ))}
      </div>
      <animated.button
        style={buttonAnimation}
        className="main-menu-button"
        onClick={onMainMenu}
      >
        Back to Main Menu
      </animated.button>
    </div>
  );
};

export default PathGame;