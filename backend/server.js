const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection String
const mongoURI = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_v3_database?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

// Create an Express app
const app = express();
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Use JSON parser for request bodies
app.use(express.static(`${__dirname}/public`)); // Serve static files from 'public'

// Define Mongoose Schema for the candidate collection
const CandidateSchema = new mongoose.Schema({
  CV: String,
  first_name: String,
  last_name: String,
  city: String,
  country: String,
  email: String,
  phone: String
});

// Define Mongoose Model based on the schema (use exact collection name)
const Candidate = mongoose.model('cv_v3_database', CandidateSchema, 'cv_v3_database');

// API Endpoint to get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().limit(30); // Retrieve all candidates from MongoDB
    res.json(candidates); // Send the candidates to the frontend in JSON format
  } catch (err) {
    res.status(500).json({ message: 'Data fetch error', error: err });
  }
});

// API Endpoint to filter candidates based on job description
app.get('/api/candidates/filter', async (req, res) => {
  const { jobDescription } = req.query;
  console.log('Received job description:', jobDescription); 

  try {
    // Filter candidates based on the job descriptionS
    const candidates = await Candidate.find({
      CV: { $regex: new RegExp(jobDescription, 'i') } // Case-insensitive search
    });
    console.log('Filtered candidates:', candidates);
    res.json(candidates); // Send filtered candidates to the frontend
  } catch (err) {
    res.status(500).json({ message: 'Error filtering candidates', error: err });
  }
});

// Server listening on port 5001
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
