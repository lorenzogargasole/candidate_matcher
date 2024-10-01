const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Bağlantısı
const mongoURI = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_v3_database?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.log('MongoDB bağlantısı başarısız:', err));

// Express Uygulama Ayarı
const app = express();
app.use(cors());
app.use(express.json());

// Mongoose Şema Tanımı
const CandidateSchema = new mongoose.Schema({
  CV: String,
  first_name: String,
  last_name: String,
  city: String,
  country: String,
  skills: String,
  email: String,
  phone: String
});
const Candidate = mongoose.model('cv_v3_database', CandidateSchema);

// API Endpoint Tanımı
app.get('/api/candidates', async (req, res) => {
    try {
      const candidates = await Candidate.find();  // MongoDB'den tüm verileri çekiyoruz
      console.log('Fetched candidates:', candidates);  // Verileri terminale yazdır
      res.json(candidates);  // Verileri frontend'e gönderiyoruz
    } catch (err) {
      console.log('Veri çekme hatası:', err);  // Hata olursa terminale yazdır
      res.status(500).send('Veri çekme hatası:', err);
    }
  });
  

// Sunucu Ayarı
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend sunucu http://localhost:${PORT} adresinde çalışıyor!`);
});
