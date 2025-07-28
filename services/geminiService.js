import { GoogleGenAI } from "@google/genai";
import { RECOMMENDATION_RULES, NUTRIENT_FULL_NAMES } from "../constants.js";

// --- IMPORTANT ---
// To run this locally, replace "YOUR_API_KEY_HERE" with your actual Google Gemini API key.
const apiKey = "AIzaSyAex1h9OKkdDfSf79FYFLLcTqHqo0CBWnE";

if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
  console.warn(
    "API key is not set. AI features will be disabled. Please add your key to services/geminiService.js"
  );
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";

function isSoilRelatedQuestion(message) {
  const allowedKeywords = [
    "soil",
    "nutrient",
    "fertility",
    "ph",
    "nitrogen",
    "phosphorus",
    "potassium",
    "organic carbon",
    "crop rotation",
    "cover crop",
    "fertilizer",
    "compost",
    "agriculture",
    "agronomy",
    "farm",
    "land",
    "amendments",
  ];
  const lower = message.toLowerCase();
  return allowedKeywords.some((keyword) => lower.includes(keyword));
}

export async function getAiRecommendation(nutrient, value, status) {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return "AI recommendations are disabled. Please configure your API key to use this feature.";
  }

  const nutrientName = NUTRIENT_FULL_NAMES[nutrient];
  const rules = RECOMMENDATION_RULES[nutrient];
  const optimalRange = `${rules.optimum.range[0]}-${rules.optimum.range[1]} ${
    rules.optimum.unit || ""
  }`.trim();

  let promptAction;
  if (status === "low" || status === "high") {
    promptAction = `The level is currently ${status}, which is outside the optimal range. Explain concisely in a helpful tone why this is a concern for crop health. Then, suggest 2-3 specific, practical actions a farmer can take to bring the level to the optimal range. Mention common fertilizers, soil amendments, or farming practices.`;
  } else {
    promptAction = `The level is currently optimal. Briefly explain the benefit of maintaining this level. Then, suggest 2-3 sustainable practices to keep it stable for the long term (e.g., cover crops, specific crop rotation, organic matter management).`;
  }

  const prompt = `
        You are an expert agronomist and soil scientist providing advice to a farmer.
        
        **Soil Nutrient Analysis:**
        - Nutrient: ${nutrientName}
        - Predicted Value: ${value.toFixed(2)} ${rules.optimum.unit || ""}
        - Status: ${status}
        - Optimal Range: ${optimalRange}
        
        **Task:**
        ${promptAction}
        
        **Instructions:**
        - Be concise and clear. The entire recommendation should be a single paragraph (around 50-70 words).
        - Use a helpful, encouraging, and easy-to-understand tone.
        - Do not repeat the input values. Focus on the actionable advice.
    `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.95,
        topK: 40,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error fetching recommendation for ${nutrient}:`, error);
    return "Could not generate AI recommendation at this time. Please check your connection or API key and try again.";
  }
}

export async function continueChat(chatSession, message) {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return {
      chatSession: null,
      responseText:
        "Chat is disabled. Please configure your API key to use this feature.",
    };
  }

  if (!isSoilRelatedQuestion(message)) {
    return {
      chatSession: null,
      responseText:
        "Sorry, I can only answer questions related to soil nutrients, crop health, and agronomy. Please ask a soil-related question.",
    };
  }

  let session = chatSession;
  if (!session) {
    session = ai.chats.create({
      model: model,
      config: {
        systemInstruction:
          "You are a friendly and knowledgeable agronomist and soil scientist. ONLY answer questions strictly related to soil health, soil nutrients, agronomy, crop nutrition, and farm practices. Politely refuse to answer any other topic including coding, general knowledge, or non-agriculture topics.",
      },
    });
  }

  try {
    const response = await session.sendMessage({ message });

    return {
      chatSession: session,
      responseText: response.text,
    };
  } catch (error) {
    console.error("Chat failed", error);
    return {
      chatSession: session,
      responseText:
        "Sorry, I couldn't get a response. Please check your connection and try again.",
    };
  }
}
