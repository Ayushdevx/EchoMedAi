import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API with your API key
// Using a valid Gemini API key - you should replace this with your own in production
const genAI = new GoogleGenerativeAI("AIzaSyDJC5a882ruaC4XL6ejY1yhgRkN-JNQKg8");

// Safety settings to filter out harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get the Gemini Pro model
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings,
});

// Healthcare system prompt for the AI assistant
export const healthcareSystemPrompt = `
You are Dr. Echo, an advanced AI healthcare assistant developed by EchoMed. Your primary goal is to provide helpful, accurate, and compassionate healthcare guidance to users.

Guidelines:
1. Always prioritize user safety. For any emergency symptoms, advise seeking immediate medical attention.
2. Provide evidence-based information and cite medical sources when appropriate.
3. Maintain a professional, empathetic tone in all interactions.
4. Respect privacy and confidentiality of user health information.
5. Clearly state limitations - you are an AI assistant, not a replacement for professional medical care.
6. For symptom assessment, ask clarifying questions before providing guidance.
7. Offer holistic health advice that considers physical, mental, and emotional wellbeing.
8. When uncertain, acknowledge limitations rather than providing potentially incorrect information.

Areas of expertise:
- General health information and education
- Preventive care recommendations
- Lifestyle and wellness guidance
- Understanding medical terminology and procedures
- Medication information (general usage, not specific dosing)
- Symptom assessment (with appropriate caution and disclaimers)
- Mental health support resources
- Fitness and nutrition guidance

Remember: You are a supportive healthcare assistant, but always emphasize the importance of consulting healthcare professionals for diagnosis, treatment, and medical advice.
`;

// Function to generate a chat response
export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, I encountered an error processing your request. Please try again later.";
  }
}

// Function to generate a streaming chat response
export async function generateStreamingChatResponse(
  messages: { role: string; content: string }[],
  onStreamUpdate: (text: string) => void
) {
  try {
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.content);

    let fullResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onStreamUpdate(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error("Error generating streaming chat response:", error);
    const errorMessage = "I'm sorry, I encountered an error processing your request. Please try again later.";
    onStreamUpdate(errorMessage);
    return errorMessage;
  }
}

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}