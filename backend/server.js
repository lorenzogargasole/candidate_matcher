const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
  const extractKeywords = require('./openai');  // OpenAI anahtar kelime çıkarma fonksiyonunu ekledik
require('dotenv').config();  // .env dosyasından API anahtarlarını okumak için

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'build')));

// MongoDB bağlantısı
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kendi_mongodb_uri';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.log('MongoDB bağlantısı başarısız:', err));

// Mongoose şeması
const CandidateSchema = new mongoose.Schema({
  CV: String,
  first_name: String,
  last_name: String,
  city: String,
  country: String,
  email: String,
  phone: String
});

const Candidate = mongoose.model('cv_v3_database', CandidateSchema, 'cv_v3_database');

// OpenAI ile anahtar kelime çıkarma ve MongoDB'den filtreleme işlemi
app.get('/api/candidates/filter', async (req, res) => {
  const { jobDescription } = req.query;
  console.log('İş tanımı alındı:', jobDescription);

  try {
    // OpenAI ile anahtar kelimeleri çıkarıyoruz
    const keywords = await extractKeywords(jobDescription);  // OpenAI ile iş tanımını işliyoruz
    console.log('Anahtar kelimeler:', keywords);

    // MongoDB Atlas Search ile sadece "CV" alanında anahtar kelimelerle arama yapıyoruz
    const candidates = await Candidate.aggregate([
      {
        $search: {
          "text": {
            "query": keywords.join(" "),  // AI tarafından çıkarılan anahtar kelimelerle arama yapılıyor
            "path": "CV"  // Sadece "CV" alanında arama yapıyoruz, manuel filtreleme yok
          }
        }
      },
      {
        $limit: 50  // İlk 50 sonucu getiriyoruz
      }
    ]);

    res.json(candidates);  // Filtrelenmiş sonuçları frontend'e döndürüyoruz
  } catch (err) {
    res.status(500).json({ message: 'Kişi arama hatası', error: err });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
