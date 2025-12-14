import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateBlueprintContent = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "Error: API_KEY is missing in the environment variables. Content generation is disabled.";
  }

  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class e-commerce consultant. Your tone is Strategic, directive, and geared for executive decision-making. Provide concise, high-impact outputs.",
        temperature: 0.7,
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI. Please try again.";
  }
};