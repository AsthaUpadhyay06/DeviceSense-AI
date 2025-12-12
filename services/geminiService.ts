import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, HealthReport } from "../types";

const parseReport = (text: string): HealthReport => {
  try {
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as HealthReport;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Failed to generate a valid report. Please try again.");
  }
};

export const generateHealthReport = async (input: UserInput): Promise<HealthReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are DeviceSense AI — a friendly and helpful PC health assistant.
    Analyze the following user PC statistics and provide a JSON response.
    
    User Input:
    - C Drive Total Size: ${input.totalStorage} GB
    - C Drive Free Space: ${input.freeStorage} GB
    - Top Folder Sizes: ${input.heavyFolders || "Not provided"}
    - Task Manager Description: ${input.taskManagerDesc || "Not provided"}
    - Battery Percentage: ${input.batteryPercent}%

    Your task is to analyze these inputs and return a strictly structured JSON object.
    
    Tone: Friendly, simple English, extremely actionable.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          storageSummary: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER, description: "Total storage in GB" },
              free: { type: Type.NUMBER, description: "Free storage in GB" },
              percentUsed: { type: Type.NUMBER, description: "Percentage used (0-100)" },
              message: { type: Type.STRING, description: "A brief summary of storage status" }
            },
            required: ["total", "free", "percentUsed", "message"]
          },
          safeToDelete: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of safe-to-delete items (temp, cache, recycle bin, logs, installers)"
          },
          heavyFolders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                size: { type: Type.STRING },
                action: { type: Type.STRING, description: "Recommended action: delete, move, or compress" }
              }
            },
            description: "Top heavy folders analysis"
          },
          compression: {
            type: Type.OBJECT,
            properties: {
              shouldCompress: { type: Type.BOOLEAN },
              estimatedRecovery: { type: Type.STRING },
              details: { type: Type.STRING }
            },
            required: ["shouldCompress", "estimatedRecovery", "details"]
          },
          ramCpuOptimizations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 quick steps for optimization"
          },
          overheatFixes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 quick actions for overheating"
          },
          batteryTips: {
            type: Type.OBJECT,
            properties: {
              wearEstimate: { type: Type.STRING },
              chargingAdvice: { type: Type.STRING }
            },
            required: ["wearEstimate", "chargingAdvice"]
          },
          powershellCommand: {
            type: Type.STRING,
            description: "One combined, safe, one-click PowerShell command for cleanup. Ensure it is valid syntax."
          },
          safetyScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "0 to 100 integer" },
              advice: { type: Type.STRING }
            },
            required: ["score", "advice"]
          }
        },
        required: [
          "storageSummary", 
          "safeToDelete", 
          "heavyFolders", 
          "compression", 
          "ramCpuOptimizations", 
          "overheatFixes", 
          "batteryTips", 
          "powershellCommand", 
          "safetyScore"
        ]
      }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from AI");
  }

  return parseReport(response.text);
};