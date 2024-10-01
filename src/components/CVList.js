import React from 'react';
import './CVList.css';  // Stillerin olduğu CSS dosyasını ekleyin

function CVList({ candidates }) {
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
              <p>Skills: {candidate.skills}</p>
              <p>Email: {candidate.email}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CVList;
