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
              <strong> {candidate.FirstName} {candidate.LastName}</strong> - {candidate.City}, {candidate.Country}
              <br />
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