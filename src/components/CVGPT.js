import React, { useState } from 'react';
import CVList from './CVList';  // Candidate list component
import JobDescriptionInput from './JobDescriptionInput';  // Job description input component
import './CVGPT.css';

function CVGPT() {
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDescriptionSubmit = (jobDescription) => {
    setLoading(true);
    setError(null);
    setFilteredCandidates([]);
    console.log(`Sending job description to API: ${jobDescription}`);
    
    fetch(`http://localhost:5001/api/candidates/filter?jobDescription=${jobDescription}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Filtered candidates from API:', data);
        setFilteredCandidates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
        setError('An error occurred during the candidate search');
        setLoading(false);
      });
  };

  return (
    <div className="cvgpt-container">
      <h2>CV GPT</h2>
      <JobDescriptionInput onSubmit={handleDescriptionSubmit} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {filteredCandidates.length > 0 && <CVList candidates={filteredCandidates} />}
    </div>
  );
}

export default CVGPT;
