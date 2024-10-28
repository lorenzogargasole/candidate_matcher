import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { getMatchingScore } from './openai.js';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection is successful!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

const CandidateSchema = new mongoose.Schema({
  CV: String,
  first_name: String,
  last_name: String,
  city: String,
  country: String,  
  email: String,
  phone: String
});

CandidateSchema.index({ first_name: 1, last_name: 1 });
CandidateSchema.index({ email: 1 });
CandidateSchema.index({ CV: 'text' });

const Candidate = mongoose.model('cv_v3_database', CandidateSchema, 'cv_v3_database');

// Yeni /api/candidates/filter rotası 
app.get('/api/candidates/filter', async (req, res) => {
  const { jobDescription } = req.query;
  console.log('Job description received:', jobDescription);

  try {
    // MongoDB text araması ile ilk filtreleme
    const searchKeywords = jobDescription.split(' ');
    let candidates = await Candidate.aggregate([
      {
        $search: {
          "text": {
            "query": searchKeywords.join(" "), 
            "path": ["CV", "first_name", "last_name", "city"]
          }
        }
      },
      {
        $limit: 100
      }
    ]);

    // AI algoritması ile skor hesaplama
    const scoredCandidates = await Promise.all(candidates.map(async (candidate) => {
      const score = await getMatchingScore(jobDescription, candidate.CV);
      return { ...candidate, score };
    }));

    // Skora göre sıralama ve ilk 20 sonucu döndürme
    scoredCandidates.sort((a, b) => b.score - a.score);
    res.json(scoredCandidates.slice(0, 20));
  } catch (err) {
    console.error('Error during candidate search:', err);  
    res.status(500).json({ message: 'Candidate search error', error: err });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
