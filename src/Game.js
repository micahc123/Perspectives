import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import Path from './Path';
import PathGame from './PathGame';
import './Game.css';
import pathsData from './pathsData.json';

function Game() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [paths, setPaths] = useState(pathsData);
  const navigate = useNavigate();

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

  const filteredPaths = paths.filter(path => 
    path.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedEthnicity === '' || path.ethnicity === selectedEthnicity)
  );

  const handlePathClick = (path) => {
    setSelectedPath(path);
  };

  const handleBack = () => {
    setSelectedPath(null);
  };

  const handleMainMenu = () => {
    navigate('/');
  };

  return (
    <div className="game-header">
      {!selectedPath && (
        <animated.h1 style={titleAnimation}>Look through the lens of another student.</animated.h1>
      )}
      {!selectedPath && (
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search paths..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select 
            value={selectedEthnicity} 
            onChange={(e) => setSelectedEthnicity(e.target.value)}
          >
            <option value="">All Ethnicities</option>
            <option value="Asian">Asian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
          </select>
        </div>
      )}
      {selectedPath ? (
        <PathGame path={selectedPath} onBack={handleBack} onMainMenu={handleMainMenu} />
      ) : (
        <div className="paths">
          {filteredPaths.map((path, index) => (
            <Path 
              key={index} 
              name={path.name} 
              image={path.image} 
              description={path.description} 
              ethnicity={path.ethnicity} 
              animation={pathAnimation}
              onClick={() => handlePathClick(path)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Game;