
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { KurdishDialect } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This message will be logged in the console if API_KEY is not set during build/runtime.
  // The app will still load, but API calls will fail if translateText is called.
  console.warn("API_KEY environment variable is not set. Translation functionality will be unavailable.");
}

// Initialize AI client. If apiKey is undefined, methods will likely fail.
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" }); // Provide a placeholder if key is missing to avoid constructor error, but calls will fail.

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const translateText = async (
  text: string,
  sourceDialect: KurdishDialect,
  targetDialect: KurdishDialect
): Promise<string> => {
  if (!apiKey) {
    // This check prevents API calls if key is missing, providing a user-facing error.
    throw new Error("API_KEY is not configured. Cannot perform translation.");
  }
  if (!text.trim()) {
    return ""; // No need to call API for empty text
  }

  const prompt = `Translate the following text accurately from ${sourceDialect} Kurdish to ${targetDialect} Kurdish. Provide ONLY the translated text itself, without any additional explanations, introductions, or conversational phrases.\n\nOriginal Text (${sourceDialect} Kurdish):\n"${text}"\n\nTranslated Text (${targetDialect} Kurdish):`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { 
        temperature: 0.3, // Lower temperature for more deterministic and accurate translation
      }
    });
    
    const translatedText = response.text;
    if (typeof translatedText !== 'string') { // Check if text is actually a string
        throw new Error("Translation result is empty or not in the expected format.");
    }
    return translatedText.trim();
  } catch (error: any) {
    console.error("Error translating text with Gemini API:", error);
    if (error.message && error.message.includes("API_KEY_INVALID")) {
         throw new Error("Translation failed: Invalid API Key. Please check your configuration.");
    }
    throw new Error(`Translation failed: ${error.message || "An unknown error occurred with the API."}`);
  }
};
