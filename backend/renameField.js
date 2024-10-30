// Import the MongoDB client
import { MongoClient } from 'mongodb';

// Define an asynchronous function to handle the renaming
async function renameSkillsCorrelationField() {
  // Replace 'your_mongodb_url' with your MongoDB connection string
  const url = 'mongodb+srv://TalentDB:Aycan1234.@talentdb.kcehf.mongodb.net/cv_database?retryWrites=true&w=majority';
  // Replace 'your_database_name' with the name of your database
  const dbName = 'cv_database';
  // Create a MongoDB client
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to the database.");

    // Access the specific database and collection
    const db = client.db(dbName);
    // Replace 'your_collection_name' with the name of your collection
    const collection = db.collection('cv_data');

    // Rename the field "skills correlation" to "skills"
    const result = await collection.updateMany(
      {},  // Empty filter to target all documents
      { $rename: { "Systems and Methodologies": "Skills" } }
    );

    // Log the number of documents modified
    console.log(`${result.modifiedCount} documents were updated with the new field name.`);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error renaming field:', error);
  } finally {
    // Ensure the client is closed after the operation completes
    await client.close();
    console.log("Database connection closed.");
  }
}

// Call the function to execute the renaming operation
renameSkillsCorrelationField();
