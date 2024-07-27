import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './PathGame.css';

const CollegeMiniGame = ({ colleges }) => {
  const [revealed, setRevealed] = useState({});

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
                {college.status === 'accepted' && <Confetti />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeMiniGame;