import { GoogleGenerativeAI, type Schema } from "@google/generative-ai"
import { z } from "zod";

if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key Not found");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (prompt: string, responseSchema: Schema) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (err: any) {
    // Returns an empty array string on any failure
    // so a flaky AI call never crashes the request
    return "[]";
  }
}