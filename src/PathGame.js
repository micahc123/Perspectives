import React, { useState } from 'react';
import PanoramaView from './PanoramaView';
import './PathGame.css';

const PathGame = ({ path, onBack, onMainMenu }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const pages = [
    {
      title: 'Background Info',
      content: <PanoramaView images={path.panoramaImages} />,
    },
    {
      title: 'Where They Went to Study',
      content: <p>{path.studyInfo}</p>,
    },
    {
      title: 'What They Found Interesting',
      content: <p>{path.interestingInfo}</p>,
    },
    {
      title: 'Where They Went to College',
      content: <p>{path.collegeInfo}</p>,
    },
    {
      title: 'What They Are Doing Now',
      content: <p>{path.currentInfo}</p>,
    },
    {
      title: 'End',
      content: (
        <div>
          <p>Thank you for exploring this path!</p>
          <button onClick={onMainMenu} className="main-menu-button">Back to Main Menu</button>
        </div>
      ),
    },
  ];

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
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrev} className="nav-button">Previous</button>
        <button onClick={handleNext} className="nav-button">Next</button>
      </div>
    </div>
  );
};

export default PathGame;