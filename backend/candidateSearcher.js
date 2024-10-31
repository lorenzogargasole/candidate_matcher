// Importa il client MongoDB
import { MongoClient } from 'mongodb';

// Funzione asincrona per cercare candidati per nome e cognome
async function findCandidateByName(firstName, lastName) {
  // URL di connessione MongoDB
  const url = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_database?retryWrites=true&w=majority';
  const dbName = 'cv_database'; // Nome del database
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connessione al server MongoDB
    await client.connect();
    console.log("Connesso al database.");

    // Accesso al database specifico e alla collezione
    const db = client.db(dbName);
    const collection = db.collection('cv_data'); // Nome della collezione

    // Esegue la ricerca per nome e cognome
    const candidates = await collection.find({ FirstName: firstName, LastName: lastName }).toArray();

    // Stampa i risultati della ricerca nel log
    console.log("Risultati della ricerca:", candidates);
  } catch (error) {
    // Gestione degli errori
    console.error('Errore durante la ricerca del candidato:', error);
  } finally {
    // Chiusura della connessione al database
    await client.close();
    console.log("Connessione al database chiusa.");
  }
}

// Chiamata alla funzione con i nomi desiderati
findCandidateByName("Luca", "De Pandis");