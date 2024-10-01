import React, { useState, useEffect } from 'react';
import './App.css';
import JobDescriptionInput from './components/JobDescriptionInput';
import CVList from './components/CVList';

function App() {
  const [candidates, setCandidates] = useState([]);  // Adayları tutmak için state
  const [description, setDescription] = useState('');  // İş tanımını tutmak için state
  const [filteredCandidates, setFilteredCandidates] = useState([]);  // Filtrelenmiş adaylar

  // MongoDB'deki aday verilerini çekmek için useEffect
  useEffect(() => {
    fetch('http://localhost:5001/api/candidates')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);  // Verileri console'da görüntüleyin
        setCandidates(data);
        setFilteredCandidates(data);
      })
      .catch((error) => console.error('Error fetching candidates:', error));
  }, []);
  
  // İş tanımı gönderildiğinde filtreleme fonksiyonu
  const handleDescriptionSubmit = (jobDescription) => {
    setDescription(jobDescription);  // İş tanımını güncelle
    console.log('Job Description Submitted:', jobDescription);

    // İş tanımına göre adayları filtreleme
    const filtered = candidates.filter((candidate) =>
      candidate.skills.toLowerCase().includes(jobDescription.toLowerCase())
    );
    setFilteredCandidates(filtered);  // Filtrelenmiş adayları güncelle
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CV Matching App</h1>
      </header>
      {/* İş tanımını girmek için JobDescriptionInput bileşeni */}
      <JobDescriptionInput onSubmit={handleDescriptionSubmit} />
      {/* Filtrelenmiş adayları göstermek için CVList bileşeni */}
      <CVList candidates={filteredCandidates} />
    </div>
  );
}

export default App;
