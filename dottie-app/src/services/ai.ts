import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface UserData {
  age: string;
  cycleLength: string;
  periodDuration: string;
  flowHeaviness: string;
  painLevel: string;
  symptoms: string[];
}

export const getAIFeedback = async (userData: UserData, userMessage?: string) => {
  try {
    const userDataString = `
      Age: ${userData.age}
      Cycle Length: ${userData.cycleLength}
      Period Duration: ${userData.periodDuration}
      Flow: ${userData.flowHeaviness}
      Pain: ${userData.painLevel}
      Additional Symptoms: ${userData.symptoms.join(', ')}
    `;

    const systemPrompt = userMessage 
      ? `You are Dottie, an AI menstrual health advisor. Answer the user's question directly and specifically based on their data. Be concise and avoid generic phrases.

User Data:
${userDataString}

Question: ${userMessage}

Response:`
      : `You are Dottie, an AI menstrual health advisor. Provide a concise, personalized analysis of the user's menstrual health data. Focus on specific observations and actionable advice.

User Data:
${userDataString}

Response:`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "text/plain"
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Validate response
    if (!aiResponse || 
        aiResponse.includes("Thank you for your question") || 
        aiResponse.includes("Based on your assessment results") ||
        aiResponse.includes("Remember that everyone's body is different") ||
        aiResponse.includes("I understand your concern") ||
        aiResponse.includes("It's important to note") ||
        aiResponse.includes("Please consult with your healthcare provider")) {
      throw new Error("Invalid AI response");
    }

    return aiResponse;
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    throw error;
  }
}; 