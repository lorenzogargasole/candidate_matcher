import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { getMatchingScore } from './openai.js';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
// Connecting to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection is successful!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

// Define MongoDB Schema
const CandidateSchema = new mongoose.Schema({
  CV: String,
  FirstName: String,
  LastName: String,
  City: String,
  Country: String,
  Mail: String,
  Skills: String,
  JobTitle: String 
}).index({ First_name: 1, Last_name: 1 })
  .index({ Mail: 1 })
  .index({ CV: 'text' });

const Candidate = mongoose.model('cv_database', CandidateSchema, 'cv_data');

// Filter GPT API
app.get('/api/candidates/filterGPT', async (req, res) => {
  const { jobDescription } = req.query;
  console.log('Job description received:', jobDescription);
  try {
    const searchKeywords = jobDescription.split(' ');
    let candidates = await Candidate.aggregate([
      {
        $search: {
          "text": {
            "query": searchKeywords.join(" "),
            "path": ["CV", "Skills", "JobTitle"]
          }
        }
      },
      {
        $limit: 100
      }
    ]);
    
    const scoredCandidates = await Promise.all(candidates.map(async (candidate) => {
      const score = await getMatchingScore(jobDescription, candidate.CV);
      return { ...candidate, score };
    }));

    // Filter duplicates by 'CV'
    const uniqueCandidates = [];
    const seenCVs = new Set();
    
    scoredCandidates.sort((a, b) => b.score - a.score).forEach(candidate => {
      if (!seenCVs.has(candidate.CV)) {
        seenCVs.add(candidate.CV);
        uniqueCandidates.push(candidate);
      }
    });

    res.json(uniqueCandidates.slice(0, 20));
  } catch (err) {
    console.error('Error during candidate search:', err);  
    res.status(500).json({ message: 'Candidate search error', error: err });
  }
});

// Filter by city, skills, jobTitle, country API
app.get('/api/candidates/filterCV', async (req, res) => {
  const { city, skills, jobTitle, country } = req.query;
  console.log('Job Parameters received:', { city, skills, jobTitle, country });
  try {
    const filterConditions = {};
    if (city) { filterConditions.City = { $regex: `^${city}$`, $options: 'i' }; }
    if (country) { filterConditions.Country = country; }
    if (skills) { filterConditions.Skills = { $regex: skills, $options: 'i' }; }
    if (jobTitle) { filterConditions.JobTitle = { $regex: jobTitle, $options: 'i' }; }

    let candidates = await Candidate.find(filterConditions).limit(100);
    console.log('Candidates found: ', candidates.length);

    const uniqueCandidates = [];
    const seenCVs = new Set();
    
    candidates.forEach(candidate => {
      if (!seenCVs.has(candidate.CV)) {
        seenCVs.add(candidate.CV);
        uniqueCandidates.push(candidate);
      }
    });

    if (uniqueCandidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found' });
    }
    
    res.json(uniqueCandidates);
  } catch (err) {
    console.error('Error during candidate search:', err);  
    res.status(500).json({ message: 'Candidate search error', error: err });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});