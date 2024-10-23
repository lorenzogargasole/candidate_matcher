"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,  // API key retrieved from the .env file
});

// Function to extract keywords from the job description
async function extractKeywords(userInput) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // GPT-4 can be used, depending on your subscription plan
      messages: [
        { role: "system", content: "You are a helpful assistant that extracts relevant skills, qualifications, and responsibilities from complex job descriptions." },
        { 
          role: "user", 
          content: `Extract detailed and specific keywords such as required skills, qualifications, job titles, and responsibilities from the following job description: "${userInput}". Focus on technical skills, experience levels, qualifications, and behavioral attributes mentioned in the description. Ignore irrelevant details like company values and health & safety instructions unless they are crucial to the role.`
        }
      ],
      max_tokens: 150,  // Set a low token limit to avoid overly long outputs
    });

    // Extracting the keywords from the response
    const extractedKeywords = response.choices[0].message.content.trim().split(", ");
    return extractedKeywords;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

// Function to split long job descriptions into smaller chunks
function splitJobDescription(jobDescription, maxLength = 500) {
  const parts = [];
  for (let i = 0; i < jobDescription.length; i += maxLength) {
    parts.push(jobDescription.slice(i, i + maxLength));
  }
  return parts;
}

// Function to extract keywords from long job descriptions in multiple parts
async function extractKeywordsFromLongDescription(jobDescription) {
  const parts = splitJobDescription(jobDescription);
  let allKeywords = [];

  for (const part of parts) {
    const keywords = await extractKeywords(part);
    allKeywords = allKeywords.concat(keywords);  // Merge keywords from all parts
  }

  // Remove duplicate keywords
  return [...new Set(allKeywords)];
}

export { extractKeywords, extractKeywordsFromLongDescription };
