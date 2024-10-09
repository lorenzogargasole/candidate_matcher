import React from 'react';
import './CVList.css'; // Import CSS for styling

function CVList({ candidates }) {
  return (
    <div className="CandidateList">
      <h2>Candidate List</h2>
      <ul>
        {candidates.length === 0 ? (
          <p>No candidates found.</p> // Show a message if no candidates are available
        ) : (
          candidates.map((candidate, index) => (
            <li key={index} className="candidate-item">
              <strong>{candidate.first_name} {candidate.last_name}</strong> - {candidate.city}, {candidate.country}
              <p>CV: {candidate.CV}</p>
              <p>Email: {candidate.email}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CVList;
