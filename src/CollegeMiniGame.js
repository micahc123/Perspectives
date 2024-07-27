import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './CollegeMiniGame.css';

const CollegeMiniGame = ({ colleges }) => {
  const [revealed, setRevealed] = useState({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const handleReveal = (collegeName) => {
    setRevealed((prev) => ({ ...prev, [collegeName]: true }));
  };

  return (
    <div className="path-game">
      <div className="college-mini-game">
        {colleges.map((college) => (
          <div key={college.name} className="college-envelope" onClick={() => handleReveal(college.name)}>
            <p>{college.name}</p>
            {revealed[college.name] && (
              <>
                <p>{college.status === 'accepted' ? 'Accepted!' : 'Rejected'}</p>
                {college.status === 'accepted' && (
                  <Confetti width={dimensions.width} height={dimensions.height} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeMiniGame;