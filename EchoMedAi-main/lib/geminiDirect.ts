/**
 * Direct Gemini API Integration
 * Simple, focused implementation with proper error handling
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateFallbackResponse } from "./fallbackResponses";

// Use API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || "";

// Healthcare system prompt - simplified version
const SYSTEM_PROMPT = `
You are Dr. Echo, an AI healthcare assistant. Provide helpful, accurate health information.
Always clarify you're not a replacement for professional medical care.
For emergencies, advise seeking immediate medical attention.
Base your responses on medical evidence and best practices.
`;

/**
 * A simple, direct function to generate a response using Gemini API
 * This uses the most basic pattern possible for reliability
 */
export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    console.log("📡 Sending request to Gemini API...");
    
    // Check if API key is available
    if (!API_KEY) {
      console.warn("⚠️ No API key found. Using fallback response.");
      return generateFallbackResponse(userMessage);
    }
    
    // Full prompt combining system instructions and user message
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser query: ${userMessage}\n\nYour response:`;
    
    // Initialize the Gemini API with API key from environment variables
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Get the generative model - simplest configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
    
    // Generate content with error handling
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("✅ Received response from Gemini API");
      return text;
    } catch (apiError) {
      console.error("❌ API Error:", apiError);
      // Use fallback response based on user message
      return generateFallbackResponse(userMessage);
    }
  } catch (error) {
    console.error("❌ Error in getAIResponse:", error);
    return generateFallbackResponse(userMessage);
  }
}

/**
 * Streaming version of the API call
 * Updates the UI as chunks of the response arrive
 */
export async function getStreamingAIResponse(
  userMessage: string,
  onUpdate: (text: string) => void
): Promise<string> {
  try {
    console.log("📡 Sending streaming request to Gemini API...");
    
    // Check if API key is available
    if (!API_KEY) {
      console.warn("⚠️ No API key found. Using fallback response.");
      const fallbackResponse = generateFallbackResponse(userMessage);
      onUpdate(fallbackResponse);
      return fallbackResponse;
    }
    
    // Full prompt combining system instructions and user message
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser query: ${userMessage}\n\nYour response:`;
    
    // Initialize the Gemini API with API key from environment variables
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Get the generative model - simplest configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
    
    // Generate streaming content with error handling
    try {
      const result = await model.generateContentStream(fullPrompt);
      
      let fullResponse = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onUpdate(fullResponse);
      }
      
      console.log("✅ Completed streaming response");
      return fullResponse;
    } catch (streamError) {
      console.error("❌ API Streaming Error:", streamError);
      // Use a fallback response specific to the user's message
      const fallbackResponse = generateFallbackResponse(userMessage);
      onUpdate(fallbackResponse);
      return fallbackResponse;
    }
  } catch (error) {
    console.error("❌ Error in getStreamingAIResponse:", error);
    const fallbackResponse = generateFallbackResponse(userMessage);
    onUpdate(fallbackResponse);
    return fallbackResponse;
  }
} 