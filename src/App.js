import React, { useState } from 'react';
import './App.css';
import CVList from './components/CVList';  // Aday listesi bileşeni
import JobDescriptionInput from './components/JobDescriptionInput';  // İş tanımı girişi bileşeni

function App() {
  const [filteredCandidates, setFilteredCandidates] = useState([]);  // Filtrelenmiş adayları tutan state
  const [loading, setLoading] = useState(false);  // Yüklenme durumunu takip etmek için state
  const [error, setError] = useState(null);  // Hata durumunu takip etmek için state

  // İş tanımını backend'e göndermek ve adayları filtrelemek için fonksiyon
  const handleDescriptionSubmit = (jobDescription) => {
    setLoading(true);  // Arama işlemi başladığında yükleniyor olarak işaretle
    setError(null);  // Hata mesajını sıfırla
    setFilteredCandidates([]);  // Yeni bir arama başladığında eski sonuçları sıfırla
    fetch(`http://localhost:5001/api/candidates/filter?jobDescription=${jobDescription}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Filtered candidates from API:', data);
        setFilteredCandidates(data);  // Adayları state'e yerleştir
        setLoading(false);  // Yüklenme durumunu kapat
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
        setError('Kişi arama sırasında bir hata oluştu');  // Hata mesajını set et
        setLoading(false);  // Yüklenme durumunu kapat
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CV Matching App</h1>
      </header>

      {/* İş tanımı girişi */}
      <JobDescriptionInput onSubmit={handleDescriptionSubmit} />
      
      {/* Yükleniyor veya hata mesajı gösterimi */}
      {loading && <p>Yükleniyor...</p>}
      {error && <p>{error}</p>}

      {/* Eğer adaylar varsa listeyi göster, aksi halde boş kalacak */}
      {filteredCandidates.length > 0 && <CVList candidates={filteredCandidates} />}
    </div>
  );
}

export default App;
