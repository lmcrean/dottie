import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const hasApiKey = !!API_KEY;

interface UserData {
  age: string;
  cycleLength: string;
  periodDuration: string;
  flowHeaviness: string;
  painLevel: string;
  symptoms: string[];
}

// Mock response generator for local development without API key
const getMockFeedback = (userData: UserData, userMessage?: string): string => {
  // Generate a baseline response
  let response = "Based on your information, here are some insights:\n\n";
  
  // Age-based feedback
  if (userData.age && parseInt(userData.age) > 0) {
    const age = parseInt(userData.age);
    if (age < 18) {
      response += "• Your cycle is still establishing itself, which is normal for your age. Irregularity is common.\n";
    } else if (age > 40) {
      response += "• As you approach perimenopause, cycle changes may become more noticeable.\n";
    } else {
      response += "• Your cycle should be relatively stable at your age, though some variation is normal.\n";
    }
  }
  
  // Cycle length feedback
  if (userData.cycleLength) {
    const cycleLength = parseInt(userData.cycleLength);
    if (cycleLength < 21) {
      response += "• Your cycle is shorter than average. While this can be normal for you, tracking consistency is helpful.\n";
    } else if (cycleLength > 35) {
      response += "• Your cycle is longer than average. If this is a recent change, consider discussing with your healthcare provider.\n";
    } else {
      response += "• Your cycle length falls within the typical range of 21-35 days.\n";
    }
  }
  
  // Period duration feedback
  if (userData.periodDuration) {
    const duration = parseInt(userData.periodDuration);
    if (duration > 7) {
      response += "• Your period duration is longer than average. Consider discussing with your healthcare provider.\n";
    } else {
      response += "• Your period duration is within the normal range.\n";
    }
  }
  
  // Flow heaviness feedback
  if (userData.flowHeaviness) {
    if (userData.flowHeaviness.toLowerCase().includes('heavy')) {
      response += "• For heavy flow, ensure you're getting enough iron-rich foods and staying hydrated.\n";
    }
  }
  
  // Pain level feedback
  if (userData.painLevel && userData.painLevel.toLowerCase().includes('severe')) {
    response += "• Severe pain that interferes with daily activities should be evaluated by a healthcare provider.\n";
  }
  
  // Add general advice
  response += "\nRemember to stay hydrated, maintain a balanced diet, and get regular exercise. If you have concerns about your cycle, consulting with a healthcare provider is always recommended.\n";
  
  // Handle follow-up questions
  if (userMessage) {
    response += "\nRegarding your question: ";
    
    if (userMessage.toLowerCase().includes('pain') || userMessage.toLowerCase().includes('cramp')) {
      response += "For menstrual pain, some find relief with over-the-counter pain relievers, heating pads, or gentle yoga. If pain is severe or disruptive to daily life, it's important to consult with a healthcare provider.";
    } else if (userMessage.toLowerCase().includes('pms') || userMessage.toLowerCase().includes('mood')) {
      response += "Mood changes before your period are common due to hormonal fluctuations. Regular exercise, adequate sleep, and stress management techniques may help. Severe mood changes that affect your quality of life should be discussed with a healthcare provider.";
    } else {
      response += "I recommend tracking your symptoms consistently to identify patterns. This information can be valuable when discussing with healthcare providers.";
    }
  }
  
  return response;
};

export const getAIFeedback = async (userData: UserData, userMessage?: string) => {
  try {
    // Use mock response if API key is missing
    if (!hasApiKey) {
      console.info('Using mock AI feedback (no API key available)');
      return getMockFeedback(userData, userMessage);
    }
    
    const userDataString = `
      Age: ${userData.age}
      Cycle Length: ${userData.cycleLength}
      Period Duration: ${userData.periodDuration}
      Flow: ${userData.flowHeaviness}
      Pain: ${userData.painLevel}
      Additional Symptoms: ${userData.symptoms.join(', ')}
    `;

    const systemPrompt = userMessage 
      ? `You are Dottie, an AI menstrual health advisor. You've already provided initial recommendations based on the user's data. Now, engage in a friendly, supportive conversation to answer their follow-up question. Use a warm, approachable tone while maintaining medical accuracy.

User Data:
${userDataString}

User's Question: ${userMessage}

Your Response:`
      : `System Instructions (Dottie Advisor)
You are Dottie, an AI menstrual health advisor. Analyze the user's responses and provide feedback based on ACOG guidelines. Use a supportive, non-alarming tone. Always:
Acknowledge their input.
Highlight key observations.
Suggest actionable steps.
Encourage professional consultation if needed.

Current User Input:
${userDataString}

Your Feedback:`;

    try {
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
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain"
          }
        }
      );
  
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      // Fall back to mock response on API error
      console.error('Error with Gemini API, using mock response:', error);
      return getMockFeedback(userData, userMessage);
    }
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    throw error;
  }
}; 