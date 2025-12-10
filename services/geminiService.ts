import { GoogleGenAI, Type } from "@google/genai";
import { QuizItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (pairs: string[], count: number = 5): Promise<QuizItem[]> => {
  const modelId = "gemini-2.5-flash";
  const pairString = pairs.join(" and ");

  const prompt = `
    Generate ${count} distinct Chinese quiz questions for elementary school students learning Pinyin.
    Focus specifically on distinguishing between the finals: "${pairString}".
    
    The words chosen must be simple, common words suitable for children (e.g., animals, food, daily objects).
    Ensure a mix of words that end with ${pairs.map(p => `"${p}"`).join(" or ")}.
    
    Return a JSON array where each object has:
    - character: The Chinese character(s) (Hanzi).
    - pinyin: The full pinyin with tone marks.
    - definition: A simple English definition (1-3 words).
    - correctFinal: The correct final sound (one of: ${pairString}).
    - options: An array of 2 strings containing the correct final and the confusing counterpart.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              character: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              definition: { type: Type.STRING },
              correctFinal: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["character", "pinyin", "definition", "correctFinal", "options"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as QuizItem[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
