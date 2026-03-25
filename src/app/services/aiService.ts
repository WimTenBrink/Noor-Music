import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../../constants/instructions";

export async function generateSong(prompt: string, apiKey: string) {
  const genAI = new GoogleGenAI({ apiKey });
  const model = genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
    },
  });

  const response = await model;
  return response;
}
