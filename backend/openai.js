const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // OpenAI API anahtarını .env dosyasından alıyoruz
});
const openai = new OpenAIApi(configuration);

// Anahtar kelimeleri çıkartan fonksiyon
async function extractKeywords(userInput) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Extract key skills, technologies, or job titles from this sentence: "${userInput}"`,
      max_tokens: 50,
    });

    const extractedKeywords = response.data.choices[0].text.trim().split(", ");
    return extractedKeywords;
  } catch (error) {
    console.error("OpenAI API hatası:", error);
    throw error;
  }
}

module.exports = extractKeywords;


