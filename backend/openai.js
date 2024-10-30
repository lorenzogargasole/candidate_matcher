"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,  // API key retrieved from the .env file
});

// Function to extract keywords from the job description
async function getMatchingScore (jobDescription, candidateCV) {
  const prompt = `
  Job Description:
  ${jobDescription}

  CV:
  ${candidateCV}
  Please provide only a numeric score (between 0 and 100) that indicates how well this CV matches the job description.
  Just respond with the score.
  `;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // GPT-4 can be used, depending on your subscription plan
      messages: [
        { role: "system", content: "You are a helpful assistant that extracts relevant skills, qualifications, and responsibilities from complex job descriptions." },
        { 
          role: "user", 
          content:  prompt 
        }
      ],
      max_tokens: 20,
      temperature:0.5,  // Set a low token limit to avoid overly long outputs
    });
    console.log("full response:",JSON.stringify(response, null, 2));
  const choices=response.choices;
  if(choices && choices.length>0){
    console.log("Message Object:", JSON.stringify(choices[0].message, null, 2));
    const message = choices[0].message;
    if(message && message.content){
      const score=parseFloat(message.content.trim());
      console.log("AI score", score); 
      return score;

    }

  }else{
    throw new Error("API response does not contain any valid choices");
  }
}catch(error){
  console.error("error with OpenAI API request:",error);
  throw new Error('API error');
  
}
    // Extracting the keywords from the response
    /*const extractedKeywords = response.choices[0].message.content.trim().split(", ");
    return extractedKeywords;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }*/
}
export { getMatchingScore };





// Function to split long job descriptions into smaller chunks
/*function splitJobDescription(jobDescription, maxLength = 500) {
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
}*/


