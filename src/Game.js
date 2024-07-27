import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Path from './Path';
import PanoramaView from './PanoramaView';
import './Game.css';

const pathsData = [
  { 
    name: 'Path 1', 
    image: '/images/path1.jpg', 
    description: 'Description for Path 1', 
    ethnicity: 'Ethnicity 1',
    panoramaImages: [
      '/images/path1_view1.jpg',
      '/images/path1_view2.jpg',
      '/images/path1_view3.jpg',
      '/images/path1_view4.jpg'
    ]
  },
  { 
    name: 'Path 2', 
    image: '/images/path2.jpg', 
    description: 'Description for Path 2', 
    ethnicity: 'Ethnicity 2',
    panoramaImages: [
      '/images/path2_view1.jpg',
      '/images/path2_view2.jpg',
      '/images/path2_view3.jpg',
      '/images/path2_view4.jpg'
    ]
  },
  { 
    name: 'Path 3', 
    image: '/images/path3.jpg', 
    description: 'Description for Path 3', 
    ethnicity: 'Ethnicity 3',
    panoramaImages: [
      '/images/path3_view1.jpg',
      '/images/path3_view2.jpg',
      '/images/path3_view3.jpg',
      '/images/path3_view4.jpg'
    ]
  },
];

function Game() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

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
      {selectedPath ? (
        <PanoramaView images={selectedPath.panoramaImages} />
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