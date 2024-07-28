import React, { useState, useEffect, useRef } from 'react';
import PanoramaViewer from './PanoramaViewer';
import CollegeMiniGame from './CollegeMiniGame';
import './PathGame.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

const PathGame = ({ path, onBack, onMainMenu }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showPopDown, setShowPopDown] = useState(false);
  const popDownRef = useRef(null);

  const pages = [
    {
      title: 'Background Info',
      content: <PanoramaViewer imageUrl="/panorama1.jpg" />,
      header: 'Background Info',
      text: 'This section provides background information about the student.'
    },
    {
      title: 'Extracurriculars',
      content: <p>{path.studyInfo}</p>,
      header: 'Extracurriculars',
      text: 'This section details the extracurricular activities of the student.'
    },
    {
      title: 'Hobbies',
      content: <p>{path.interestingInfo}</p>,
      header: 'Hobbies',
      text: 'This section covers the hobbies and interests of the student.'
    },
    {
      title: 'College Admissions Day!',
      content: <CollegeMiniGame colleges={path.colleges} description={path.collegeDescription} />,
      header: 'College Admissions Day!',
      text: 'This section simulates the college admissions process.'
    },
    {
      title: 'Current Career Path',
      content: <p>{path.currentInfo}</p>,
      header: 'Current Career Path',
      text: 'This section describes the current career path of the student.'
    },
    {
      title: 'End',
      content: (
        <div>
          <p>Thank you for exploring this path!</p>
          <button onClick={onMainMenu} className="main-menu-button">Back to Main Menu</button>
        </div>
      ),
      header: 'End',
      text: 'Thank you for exploring this path!'
    },
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
      <h2>{pages[pageIndex].title}</h2>
      <div className="page-content">
        {pages[pageIndex].content}
        <div 
          ref={popDownRef}
          className={`pop-down ${showPopDown ? 'show' : ''}`}
        >
          <h3>{pages[pageIndex].header}</h3>
          <hr />
          <p>{pages[pageIndex].text}</p>
        </div>
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
      {pageIndex === 0 && (
        <button onClick={onBack} className="back-button">Back to Paths</button>
      )}
    </div>
  );
};

export default PathGame;        