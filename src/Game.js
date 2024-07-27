import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import Path from './Path';
import PathGame from './PathGame';
import './Game.css';

function Game() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [pathsData, setPathsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/pathsData.json')
      .then(response => response.json())
      .then(data => setPathsData(data))
      .catch(error => console.error('Error fetching paths data:', error));
  }, []);

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

  const filteredPaths = pathsData.filter(path => 
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
            <option value="Ethnicity 1">Asian</option>
            <option value="Ethnicity 2">Mexican</option>
            <option value="Ethnicity 3">American</option>
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