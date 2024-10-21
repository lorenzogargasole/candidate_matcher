
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { extractKeywords } from './openai.js'; // OpenAI anahtar kelime çıkarma fonksiyonunu içe aktardık


// .env dosyasından API anahtarlarını okumak için

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(new URL('.', import.meta.url).pathname, '..', 'build')));

// MongoDB bağlantısı
const mongoURI = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_v3_database?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection is successfull!'))
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
app.get('/test', (req,res)=>{
  res.send("API is working");
});

const Candidate = mongoose.model('cv_v3_database', CandidateSchema, 'cv_v3_database');

// OpenAI ile anahtar kelime çıkarma ve MongoDB'den filtreleme işlemi
app.get('/api/candidates', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const candidates = await Candidate.aggregate([{ $sample: { size: limit } }]);
    res.json(candidates); 
  } catch (err) {
    res.status(500).json({ message: 'Rastgele veri getirme hatası', error: err });
  }
});

app.get('/api/candidates/filter', async (req, res) => {
  const { jobDescription } = req.query;
  console.log('Job description received:', jobDescription);

  try {
    // OpenAI ile anahtar kelimeleri çıkarıyoruz
    const keywords = await extractKeywords(jobDescription);  // OpenAI ile iş tanımını işliyoruz
    console.log('Anahtar kelimeler:', keywords);

    // Tüm veritabanında anahtar kelimelere göre arama yapıyoruz ve skora göre sıralıyoruz
    const candidates = await Candidate.aggregate([
      {
        $search: {
          "text": {
            "query": keywords.join(" "),  // AI tarafından çıkarılan anahtar kelimelerle tüm veritabanında arama yapılıyor
            "path": "CV",  // Sadece "CV" alanında arama yapıyoruz
            "score": { "boost": { "value": 1 } }  // Skora dayalı sıralama
          }
        }
      },
      {
        $addFields: {
          score: { $meta: "searchScore" }  // Arama skoru ekleniyor
        }
      },
      {
        $sort: { score: -1 }  // Skora göre sıralama (en yüksekten düşüğe)
      },
      {
        $limit: 20  // En uyumlu 20 sonucu getiriyoruz
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

