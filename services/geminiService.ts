import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get model based on task complexity
const getModel = (isImage: boolean = false) => {
  return isImage ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
};

export const getCropRecommendation = async (
  soilType: string,
  season: string,
  landSize: string,
  location: string,
  waterSource: string
): Promise<string> => {
  try {
    const prompt = `
      Act as an expert agricultural scientist (Kisan Scientist) specializing in Precision Farming.
      
      The user is an Indian farmer.
      Details:
      - Location: ${location}
      - Soil Type: ${soilType}
      - Season: ${season}
      - Land Size: ${landSize}
      - Water Source: ${waterSource}

      Task: Recommend the top 3 most profitable crops to grow using modern technology.
      
      CRITICAL: Focus on "Precision Farming" techniques inspired by Israel and Netherlands (e.g., Drip Irrigation, Fertigation, Polyhouse, Mulching) to maximize profit in ${landSize}.

      For each crop, provide:
      1. Crop Name (Hindi & English)
      2. Estimated Profit potential (in INR)
      3. Technology/Technique (Why it works like in Israel/Netherlands)
      4. Water Management Tip
      
      Output Format: Plain text, formatted with clear headings. Use Hindi/Hinglish. Tone: Professional yet encouraging.
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });

    return response.text || "माफ़ कीजिये, जानकारी प्राप्त करने में समस्या आ रही है।";
  } catch (error) {
    console.error("Crop Recommendation Error:", error);
    return "नेटवर्क समस्या। कृपया पुनः प्रयास करें।";
  }
};

export const analyzePlantDisease = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Specific model for vision
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `This is an image of a crop/plant from a farm. 
            1. Identify the disease, pest, or deficiency shown.
            2. Suggest immediate Precision Farming treatments (Targeted spraying, organic options).
            3. Provide preventative measures.
            
            Answer in Hindi (Devanagari script).`
          }
        ]
      }
    });

    return response.text || "चित्र पहचान नहीं हो पायी। कृपया साफ़ फोटो लें।";
  } catch (error) {
    console.error("Disease Analysis Error:", error);
    return "चित्र विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।";
  }
};

export const getMarketInsights = async (crop: string, location: string): Promise<string> => {
  try {
    const prompt = `
      Provide current market trends and future price predictions for "${crop}" in or near "${location}", India.
      
      Include:
      1. Current estimated Mandi price range.
      2. Best time to sell for maximum profit (Storage advice).
      3. Global factors affecting the price.
      
      Answer in Hindi.
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });

    return response.text || "बाज़ार भाव की जानकारी अभी उपलब्ध नहीं है।";
  } catch (error) {
    console.error("Market Insights Error:", error);
    return "त्रुटि। बाद में प्रयास करें।";
  }
};

export const getGovSchemes = async (): Promise<string> => {
  try {
    const prompt = `
      List 4 key Government of India agricultural schemes (Yojna) that help farmers with Precision Farming, Technology, or Insurance.
      Focus on schemes like PM-Kisan, PMKSY (Irrigation), or subsidies for Drones/Solar pumps.
      
      Format:
      - Scheme Name
      - Benefit (How much money or subsidy)
      - How to apply (One line)
      
      Answer in Hindi.
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });

    return response.text || "योजनाओं की जानकारी लोड नहीं हो सकी।";
  } catch (error) {
    console.error("Gov Schemes Error:", error);
    return "नेटवर्क त्रुटि।";
  }
};

export const chatWithKisanSahayak = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are 'Kisan Sahayak', an expert AI agriculture assistant for Indian farmers. You specialize in Precision Farming (Israel/Netherlands style). Answer briefly in Hindi/Hinglish."
            },
            history: history
        });

        const result = await chat.sendMessage({ message: message });
        return result.text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "क्षमा करें, मैं अभी उत्तर नहीं दे सकता।";
    }
}