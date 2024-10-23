import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();  // Using useNavigate instead of useHistory

  return (
    <div className="homepage-container">
      <h1>Welcome to the CV Matching App</h1>
      <div className="buttons-container">
        {/* CV GPT button, navigates to AI-based filtering */}
        <button className="homepage-button" onClick={() => navigate('/cv-gpt')}>
          CV GPT
        </button>
        {/* Filter CV's button, navigates to manual filtering */}
        <button className="homepage-button" onClick={() => navigate('/filter-cvs')}>
          Filter CV's
        </button>
      </div>
    </div>
  );
}

export default Homepage;
