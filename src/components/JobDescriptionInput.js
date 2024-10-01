import React, { useState } from 'react';

function JobDescriptionInput({ onSubmit }) {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(jobDescription);  // Üst bileşene iş tanımını gönder
    setJobDescription('');  // Metin kutusunu temizle
  };

  return (
    <div className="JobDescription">
      <h2>Enter Job Description</h2>
      <textarea
        rows="5"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Type the job description here..."
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default JobDescriptionInput;
