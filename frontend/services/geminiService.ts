import { GoogleGenAI, Type } from "@google/genai";
import { CareerPath } from "../types";

// Initialize client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractSkillsFromResume = async (
  base64Data: string,
  mimeType: string
): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Analyze this resume/document. Extract a list of professional skills found.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];
  try {
    const json = JSON.parse(text);
    return json.skills || [];
  } catch (e) {
    console.error("Failed to parse skills JSON", e);
    return [];
  }
};

export const recommendCareers = async (
  skills: string[]
): Promise<CareerPath[]> => {
  const prompt = `
    Based on these skills: ${skills.join(", ")}.
    Suggest 4 distinct career paths.
    For each career, estimate a match percentage based on the provided skills vs required skills.
    Return only the market salary range for [Role] in India strictly in the format: ₹XXL - ₹XXL PA
    Ensure the 'description' is a single, concise, punchy sentence.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                matchPercentage: { type: Type.NUMBER },
                requiredSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                salaryRange: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];
  try {
    const json = JSON.parse(text);
    return json.careers || [];
  } catch (e) {
    console.error("Failed to parse careers JSON", e);
    return [];
  }
};

export const getDetailedCareerPlan = async (
  careerTitle: string,
  userSkills: string[]
): Promise<{
  roadmap: any[];
  resources: any[];
  roleOverview: string[];
  salaryRange: string;
}> => {
  const prompt = `
    Analyze the career path: "${careerTitle}" for a user with these existing skills: ${userSkills.join(
    ", "
  )}.

    1. Provide 3 short, distinct, and punchy bullet points (max 15 words each) describing the key daily activities and reality of this role. Focus on action.
    2. Return only the market salary range for [Role] in India strictly in the format: ₹XXL - ₹XXL PA
    3. Identify critical missing skills.
    4. Create a learning roadmap specifically designed as a "bridge" to teach the *missing* skills required for this role. Do not include basic steps for skills the user already possesses.
    5. Provide learning resources specifically for these missing skills.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roleOverview: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          salaryRange: { type: Type.STRING },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
              },
            },
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                type: { type: Type.STRING },
                duration: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text)
    return { roadmap: [], resources: [], roleOverview: [], salaryRange: "" };
  try {
    const json = JSON.parse(text);
    return {
      roadmap: json.roadmap || [],
      resources: json.resources || [],
      roleOverview: json.roleOverview || [],
      salaryRange: json.salaryRange || "",
    };
  } catch (e) {
    console.error("Failed to parse details JSON", e);
    return { roadmap: [], resources: [], roleOverview: [], salaryRange: "" };
  }
};
