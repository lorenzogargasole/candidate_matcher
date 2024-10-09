const express = require('express'); // Import Express framework for backend
const mongoose = require('mongoose'); // Import Mongoose for MongoDB
const cors = require('cors'); // Import CORS to handle cross-origin requests

// MongoDB Connection String (Make sure it matches your credentials)
const mongoURI = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_v3_database?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

// Create an Express app
const app = express();
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Use JSON parser for request bodies

// Define Mongoose Schema for the candidate collection
const CandidateSchema = new mongoose.Schema({
  CV: String,           // Full CV text
  first_name: String,   // Candidate's first name
  last_name: String,    // Candidate's last name
  city: String,         // City of the candidate
  country: String,      // Country of the candidate
  email: String,        // Email address
  phone: String         // Phone number
});

// Define Mongoose Model based on the schema (use exact collection name)
const Candidate = mongoose.model('cv_v3_database', CandidateSchema, 'cv_v3_database');

// API Endpoint to get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find(); // Retrieve all candidates from MongoDB
    console.log('Fetched candidates:', candidates); // Log the data to see if it was fetched correctly
    res.json(candidates); // Send the candidates to the frontend
  } catch (err) {
    console.log('Data fetch error:', err);
    res.status(500).send('Data fetch error:', err);
  }
});


// Server listening on port 5001
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
