import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.API_KEY is expected to be available in the environment
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateWakeUpMessage = async (
  prompt: string,
  time: string
): Promise<string> => {
  if (!ai) {
    return "Rise and shine! (AI features unavailable without API Key)";
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are a creative alarm clock assistant. 
    Your goal is to wake the user up with a short, engaging message based on their request. 
    Keep it under 50 words. Be expressive.`;

    const response = await ai.models.generateContent({
      model,
      contents: `The current time is ${time}. The user's wake-up request is: "${prompt}". Generate a wake-up message.`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text || "Good morning! Time to wake up.";
  } catch (error) {
    console.error("Error generating wake-up message:", error);
    return "Good morning! It's time to start your day.";
  }
};
