import { GoogleGenAI } from "@google/genai";

const createClient = () => {
  const apiKey = process.env.API_KEY as string | undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const editImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  const ai = createClient();
  if (!ai) {
    console.warn('Gemini client not initialized — missing API_KEY. Skipping image edit.');
    return null;
  }

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
         }
       }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};