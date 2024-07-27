import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Path from './Path';
import './Game.css';

const pathsData = [
  { name: 'Path 1', image: 'path1.jpg', description: 'Description for Path 1', ethnicity: 'Ethnicity 1' },
  { name: 'Path 2', image: 'path2.jpg', description: 'Description for Path 2', ethnicity: 'Ethnicity 2' },
  { name: 'Path 3', image: 'path3.jpg', description: 'Description for Path 3', ethnicity: 'Ethnicity 3' },
];

function Game() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEthnicity, setSelectedEthnicity] = useState('');

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

  return (
    <div className="game-header">
      <animated.h1 style={titleAnimation}>Look through the lens of another student.</animated.h1>
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
      <div className="paths">
        {filteredPaths.map((path, index) => (
          <Path 
            key={index} 
            name={path.name} 
            image={path.image} 
            description={path.description} 
            ethnicity={path.ethnicity} 
            animation={pathAnimation} 
          />
        ))}
      </div>
    </div>
  );
}

export default Game;