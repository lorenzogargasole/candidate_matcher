import React, { useState } from 'react';
import './App.css';
import CVList from './components/CVList';
import JobDescriptionInput from './components/JobDescriptionInput';

function App() {
  // States for candidates and filtered candidates
  const [filteredCandidates, setFilteredCandidates] = useState([]);  // Store filtered candidates

  // Fetch filtered data from the backend API based on job description
  const handleDescriptionSubmit = (jobDescription) => {
    fetch(`http://localhost:5001/api/candidates/filter?jobDescription=${jobDescription}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Filtered candidates from API:', data);  // Check if data is correctly fetched
        setFilteredCandidates(data);  // Set state with filtered data
      })
      .catch((error) => console.error('Error fetching candidates:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CV Matching App</h1>
      </header>
      <JobDescriptionInput onSubmit={handleDescriptionSubmit} />
      <CVList candidates={filteredCandidates} />
    </div>
  );
}

export default App;
