"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,  // API anahtarını .env dosyasından al
});

// Anahtar kelimeleri çıkartan fonksiyon
async function extractKeywords(userInput) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // gpt-4 kullanılabilir, ancak mevcut modele uygun olmalı
      messages: [
        { role: "system", content: "You are a helpful assistant who extracts key skills and job titles from job descriptions." },
        { role: "user", content: `Extract relevant skills, job titles, locations, and other key information from this job description: "${userInput}"` }
      ],
      max_tokens: 50,
    });

    // Yanıttan anahtar kelimeleri ayıklama
    const extractedKeywords = response.choices[0].message.content.trim().split(", ");
    return extractedKeywords;
  } catch (error) {
    console.error("OpenAI API hatası:", error);
    throw error;
  }
}

export { extractKeywords };
