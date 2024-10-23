import React, { useState } from 'react';
import './CVList.css';

function CVList({ candidates }) {
  const [visibleCVs, setVisibleCVs] = useState({});

  const toggleCVVisibility = (index) => {
    setVisibleCVs(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="CandidateList">
      <h2>Candidate List</h2>
      <ul>
        {candidates.length === 0 ? (
          <p>No candidates found.</p>
        ) : (
          candidates.map((candidate, index) => (
            <li key={index} className="candidate-item">
              <strong>{candidate.first_name} {candidate.last_name}</strong> - {candidate.city}, {candidate.country}
              <p>Email: {candidate.email}</p>
              <p>Match Percentage: {candidate.matchPercentage}%</p>
              <p>Matched Keywords: {candidate.matchedKeywords.join(', ')}</p>
              <button onClick={() => toggleCVVisibility(index)}>
                {visibleCVs[index] ? 'Hide CV' : 'Show CV'}
              </button>
              {visibleCVs[index] && <pre>{candidate.CV}</pre>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CVList;
