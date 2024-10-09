import React, { useState } from 'react';

function JobDescriptionInput({ onSubmit }) {
  const [jobDescription, setJobDescription] = useState(''); // State to store job description input

  // Handle the form submission and call parent component function
  const handleSubmit = () => {
    onSubmit(jobDescription); // Pass job description to parent component
    setJobDescription(''); // Clear the input field
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
