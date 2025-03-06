/**
 * Emergency direct implementation of Gemini API
 * This file provides a simplified approach to using the Gemini API
 * with minimal complexity and dependencies.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// The API key is directly included here for simplicity
const API_KEY = "AIzaSyCYqDftrAIuVJXkMnwpD55CfdSmGN7eAW0";

/**
 * Simple function to generate a response to a given prompt
 * This uses the most basic form of the API call possible
 */
export async function generateDirectResponse(prompt: string): Promise<string> {
  try {
    console.log("DIRECT API: Generating response for prompt:", prompt.substring(0, 50) + "...");
    
    // Initialize the API with the key
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Get a simple model instance
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Make a direct prompt request - simplest possible approach
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("DIRECT API: Received response, length:", text.length);
    return text;
  } catch (error) {
    console.error("DIRECT API ERROR:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Stack trace:", error.stack);
    }
    
    return "I'm sorry, I encountered an error. Please check the console for details.";
  }
}

/**
 * Simple streaming function that uses a callback to update the UI
 */
export async function generateDirectStreamingResponse(
  prompt: string,
  onUpdate: (text: string) => void
): Promise<string> {
  try {
    console.log("DIRECT STREAMING API: Starting with prompt:", prompt.substring(0, 50) + "...");
    
    // Initialize the API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate streaming content
    const result = await model.generateContentStream(prompt);
    
    let fullResponse = "";
    
    // Process the stream chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onUpdate(fullResponse);
      console.log("DIRECT STREAMING: Received chunk, current length:", fullResponse.length);
    }
    
    console.log("DIRECT STREAMING: Complete, final length:", fullResponse.length);
    return fullResponse;
  } catch (error) {
    console.error("DIRECT STREAMING ERROR:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Stack trace:", error.stack);
    }
    
    const errorMessage = "I'm sorry, I encountered an error processing your request. Please try again later.";
    onUpdate(errorMessage);
    return errorMessage;
  }
} 