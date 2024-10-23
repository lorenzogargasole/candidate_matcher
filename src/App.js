import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CVGPT from './components/CVGPT';  // AI-based page
import FilterCVs from './components/FilterCVs';  // Manual filtering page
import Homepage from './components/Homepage';  // Homepage

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />
        
        {/* CV GPT page */}
        <Route path="/cv-gpt" element={<CVGPT />} />

        {/* Filter CV's page */}
        <Route path="/filter-cvs" element={<FilterCVs />} />
      </Routes>
    </Router>
  );
}

export default App;
