import React, { useState } from 'react';
import CVList from './CVList';  // Candidate list component
import './FilterCVs.css';

function FilterCVs() {
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchParams, setSearchParams] = useState({ city: '', skills: '' });

  const handleFilterSubmit = () => {
    fetch(`http://localhost:5001/api/manual-filter?city=${searchParams.city}&skills=${searchParams.skills}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredCandidates(data);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  };

  return (
    <div className="filtercvs-container">
      <h2>Filter CV's</h2>
      <div className="filter-inputs">
        <input
          type="text"
          placeholder="City"
          value={searchParams.city}
          onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Skills"
          value={searchParams.skills}
          onChange={(e) => setSearchParams({ ...searchParams, skills: e.target.value })}
        />
        <button onClick={handleFilterSubmit}>Search</button>
      </div>
      {filteredCandidates.length > 0 && <CVList candidates={filteredCandidates} />}
    </div>
  );
}

export default FilterCVs;
