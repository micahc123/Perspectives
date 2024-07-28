import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './CollegeMiniGame.css';

const CollegeMiniGame = ({ pathName, colleges }) => {
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
            <p>{college.name}</p> {}
            <img src={`${process.env.PUBLIC_URL}/envelope.svg`} alt="Envelope" className={`envelope-icon ${revealed[college.name] ? 'opened' : ''}`} />
            {revealed[college.name] && (
              <div className="letter">
                <p>Dear Student,</p> {}
                <p>{college.status === 'accepted' ? 'Congratulations! You have been accepted!' : 'We regret to inform you that you have been rejected.'}</p>
                {college.status === 'accepted' && (
                  <Confetti width={dimensions.width} height={dimensions.height} />
                )}
                <p>Regards,</p>
                <p>Headmaster of School</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeMiniGame;