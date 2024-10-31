import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CVList from './CVList'; // Candidate list component
import './FilterCVs.css';

function FilterCVs() {
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchParams, setSearchParams] = useState({ city: '', skills: '', jobTitle: '', country: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); 
  const navigate = useNavigate();


  //Filter submit
  const handleFilterSubmit = async () => {
    console.log('Filter submit function called'); 
    setLoading(true);
    setError(null);
    setSearched(true);

    //Filtering Query
    const query = new URLSearchParams({
      city: searchParams.city,
      skills: searchParams.skills, 
      jobTitle: searchParams.jobTitle,         
      country: searchParams.country
    }).toString();

    console.log(`Sending filter query to API: ${query}`);

    // Fetch candidates
    fetch(`http://localhost:5001/api/candidates/filterCV?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Filtered candidates from API:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from the server');
        }

      // Apply filter
      setFilteredCandidates(data);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
        setError('Error fetching candidates. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="filtercvs-container">
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
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
        <input
          type="text"
          placeholder="Job Title"
          value={searchParams.jobTitle}
          onChange={(e) => setSearchParams({ ...searchParams, jobTitle: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={searchParams.country}
          onChange={(e) => setSearchParams({ ...searchParams, country: e.target.value })}
        />
        <button onClick={handleFilterSubmit} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {filteredCandidates.length > 0 && <CVList candidates={filteredCandidates} />}
      {error && <div className="error-message">{error}</div>}
      {/*Displaying errors*/}
      {!error && searched && filteredCandidates.length === 0 && !loading && <p>No candidates found</p>}
    </div>
  );
}

export default FilterCVs;
