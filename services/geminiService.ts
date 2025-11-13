
import { GoogleGenAI } from "@google/genai";
import { WasteType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const classifyWaste = async (base64Image: string, mimeType: string): Promise<WasteType> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: "Identify the type of waste in the image. Respond with only one word: Plastic, Glass, Metal, or Organic. If you cannot identify it, respond with 'Unknown'. Do not add explanations or extra text."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    const classification = response.text.trim();

    switch (classification.toLowerCase()) {
      case 'plastic':
        return WasteType.PLASTIC;
      case 'glass':
        return WasteType.GLASS;
      case 'metal':
        return WasteType.METAL;
      case 'organic':
        return WasteType.ORGANIC;
      default:
        return WasteType.UNKNOWN;
    }
  } catch (error) {
    console.error("Error classifying waste:", error);
    return WasteType.UNKNOWN;
  }
};
