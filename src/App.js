import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import About from './About';
import HomePage from './Homepage';
import Game from './Game'; // Import the Game component
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Game />} /> {/* Add the Game route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;