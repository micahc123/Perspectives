import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import About from './About';
import HomePage from './Homepage';
import Game from './Game'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Game />} />
          {/* Catch-all route to redirect to the homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;