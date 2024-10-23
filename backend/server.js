import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { extractKeywordsFromLongDescription } from './openai.js';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;  // Use your .env MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection is successful!'))
  .catch((err) => console.log('MongoDB connection failed:', err));

// Mongoose schema definition
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

// Function to calculate match percentage and matched keywords
function calculateMatchPercentageAndMatchedKeywords(keywords, candidateCV) {
  let matchedKeywords = [];
  let totalScore = 0;
  let maxScore = keywords.length * 10;  // Assume each keyword is worth 10 points

  // Check for each keyword in the candidate's CV
  keywords.forEach(keyword => {
    if (candidateCV.toLowerCase().includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);  // Collect matched keywords
      totalScore += 10;  // Add 10 points for each match
    }
  });

  // Calculate match percentage based on total score
  const matchPercentage = (totalScore / maxScore) * 100;
  return {
    matchPercentage: Math.round(matchPercentage),
    matchedKeywords
  };
}

// Route to filter candidates based on job description
app.get('/api/candidates/filter', async (req, res) => {
  const { jobDescription } = req.query;

  if (jobDescription.length > 2000) {  
    return res.status(400).json({ message: 'Job description is too long. Please shorten it.' });
  }

  const startTime = Date.now();

  try {
    // Extract keywords using the long description handler
    const keywords = await extractKeywordsFromLongDescription(jobDescription);
    
    // Search candidates based on extracted keywords
    const candidates = await Candidate.aggregate([
      {
        $search: {
          "text": {
            "query": keywords.join(" "),  // Join keywords into a query string
            "path": "CV",  // Search in the CV field
            "score": { "boost": { "value": 1 } }  // Sorting based on score
          }
        }
      },
      { $addFields: { score: { $meta: "searchScore" } } },  // Add search score to the result
      { $sort: { score: -1 } },  // Sort candidates by search score in descending order
      { $limit: 20 }  // Limit to top 20 results
    ]);

    // Add match percentage and matched keywords
    const candidatesWithMatch = candidates.map(candidate => {
      const { matchPercentage, matchedKeywords } = calculateMatchPercentageAndMatchedKeywords(keywords, candidate.CV);

      // Only return candidates with a match percentage greater than 0
      if (matchPercentage > 0) {
        return { 
          ...candidate, 
          matchPercentage,
          matchedKeywords
        };
      }
      return null;
    }).filter(candidate => candidate !== null);  // Filter out candidates with 0% match

    res.json(candidatesWithMatch);
  } catch (err) {
    console.error('Error during candidate search:', err);  
    res.status(500).json({ message: 'Candidate search error', error: err });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
