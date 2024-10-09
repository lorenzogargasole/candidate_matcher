import React, { useState, useEffect } from 'react';
import './App.css';
import JobDescriptionInput from './components/JobDescriptionInput';
import CVList from './components/CVList';

function App() {
  // States for candidates and filtered candidates
  const [candidates, setCandidates] = useState([]);  // Store all candidates
  const [description, setDescription] = useState('');  // Store the job description
  const [filteredCandidates, setFilteredCandidates] = useState([]);  // Store filtered candidates

  // Fetch data from the backend API
  useEffect(() => {
    fetch('http://localhost:5001/api/candidates')  // Adjust this URL based on your backend setup
      .then((response) => response.json())
      .then((data) => {
        console.log('Data fetched from API:', data);  // Check if data is correctly fetched
        setCandidates(data);  // Set state with fetched data
        setFilteredCandidates(data);  // Set initial state for displaying candidates
      })
      .catch((error) => console.error('Error fetching candidates:', error));
  }, []);

  // Filter candidates based on the job description
  const handleDescriptionSubmit = (jobDescription) => {
    setDescription(jobDescription);
    console.log('Job Description Submitted:', jobDescription);

    // Filter candidates based on job description
    const filtered = candidates.filter((candidate) =>
      candidate.CV && candidate.CV.toLowerCase().includes(jobDescription.toLowerCase())  // Adjusted to filter using CV
    );
    setFilteredCandidates(filtered);
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
