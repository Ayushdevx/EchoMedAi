"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { healthcareSystemPrompt } from "@/lib/gemini";
import { generateDirectStreamingResponse } from "@/lib/directGemini";
import { generateFallbackStreamingResponse } from "@/lib/fallbackResponses";
import { generateFitnessResponse } from "@/lib/fitnessRecommendations";
import { generateMentalWellnessResponse } from "@/lib/mentalWellnessRecommendations";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

type GeminiAssistantContextType = {
  isOpen: boolean;
  messages: Message[];
  openAssistant: () => void;
  closeAssistant: () => void;
  sendMessage: (message: string) => void;
  isTyping: boolean;
  clearMessages: () => void;
  currentResponse: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  setTranscript: (text: string) => void;
  copyToClipboard: (text: string) => void;
  downloadChatAsPDF: () => void;
  isCopied: boolean;
};

const GeminiAssistantContext = createContext<GeminiAssistantContextType | undefined>(undefined);

export function GeminiAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "system",
      content: healthcareSystemPrompt,
      timestamp: new Date(),
    },
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Dr. Echo, your EchoMed AI health assistant. How can I help you with your health today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Test the API connection when the component mounts
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing direct Gemini API connection...");
        const testPrompt = "Hello, this is a test. Please respond with a short greeting.";
        
        try {
          // Try the direct API first
          const directResponse = await generateDirectStreamingResponse(
            testPrompt, 
            () => {} // Empty callback since we don't need to update UI
          );
          console.log("API test successful with direct response:", directResponse.substring(0, 50) + "...");
        } catch (apiError) {
          console.error("Direct API test failed:", apiError);
          
          // Test fallback system
          console.log("Testing fallback response system...");
          const fallbackResponse = await generateFallbackStreamingResponse(
            "hi", 
            () => {}
          );
          console.log("Fallback system test successful:", fallbackResponse.substring(0, 50) + "...");
          
          // Add a note to the chat that we're using fallback responses
          setMessages(prev => [
            ...prev,
            {
              id: uuidv4(),
              role: "assistant",
              content: "Note: The AI service connection is currently unavailable. I'll be using a limited set of pre-programmed responses until the connection is restored.",
              timestamp: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error("All API tests failed:", error);
      }
    };
    
    testAPI();
  }, []);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("geminiMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Ensure the system prompt is always present
        if (!parsedMessages.some((msg: Message) => msg.role === "system")) {
          parsedMessages.unshift({
            id: "system-1",
            role: "system",
            content: healthcareSystemPrompt,
            timestamp: new Date(),
          });
        }
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    // Don't save if we only have the system message and welcome message
    if (messages.length > 2) {
      localStorage.setItem("geminiMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      console.error('Speech recognition not supported');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);

  const clearMessages = () => {
    setMessages([
      {
        id: "system-1",
        role: "system",
        content: healthcareSystemPrompt,
        timestamp: new Date(),
      },
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm Dr. Echo, your EchoMed AI health assistant. How can I help you with your health today?",
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem("geminiMessages");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const downloadChatAsPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("EchoMed AI Health Assistant Chat", 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add messages
    doc.setFontSize(10);
    let yPosition = 40;
    
    // Filter out system messages
    const chatMessages = messages.filter(msg => msg.role !== "system");
    
    chatMessages.forEach((message, index) => {
      const role = message.role === "assistant" ? "Dr. Echo" : "You";
      const timestamp = new Date(message.timestamp).toLocaleString();
      
      // Add role and timestamp
      doc.setFont("helvetica", "bold");
      doc.text(`${role} (${timestamp})`, 20, yPosition);
      yPosition += 5;
      
      // Add message content with word wrapping
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(message.content, 170);
      doc.text(splitText, 20, yPosition);
      
      // Update y position for next message
      yPosition += splitText.length * 5 + 10;
      
      // Add new page if needed
      if (yPosition > 280 && index < chatMessages.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Save the PDF
    doc.save("echomed-chat.pdf");
  };

  const sendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setCurrentResponse("");
    
    try {
      // Check if this is a fitness data query
      if (message.includes("fitness data") && message.includes("goal")) {
        console.log("Detected fitness data query, using specialized fitness response generator");
        const fitnessResponse = generateFitnessResponse(message);
        
        // Simulate streaming for better UX
        let currentText = "";
        const words = fitnessResponse.split(" ");
        
        for (let i = 0; i < words.length; i++) {
          currentText += (i === 0 ? "" : " ") + words[i];
          setCurrentResponse(currentText);
          await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for streaming effect
        }
        
        // Add the final message
        const aiMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: fitnessResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }
      
      // Check if this is a mental wellness query
      if (message.includes("mental wellness advice") && message.includes("current state")) {
        console.log("Detected mental wellness query, using specialized mental wellness response generator");
        const wellnessResponse = generateMentalWellnessResponse(message);
        
        // Simulate streaming for better UX
        let currentText = "";
        const words = wellnessResponse.split(" ");
        
        for (let i = 0; i < words.length; i++) {
          currentText += (i === 0 ? "" : " ") + words[i];
          setCurrentResponse(currentText);
          await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for streaming effect
        }
        
        // Add the final message
        const aiMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: wellnessResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }
      
      console.log("Attempting to use direct API implementation...");
      
      // Format a simple prompt with the system message and user's message
      const systemPrompt = "You are Dr. Echo, an EchoMed AI health assistant. Answer the following health question helpfully and accurately.";
      const fullPrompt = `${systemPrompt}\n\nUser's question: ${message}`;
      
      let apiSucceeded = false;
      let finalResponse = "";
      
      try {
        // Try the direct API implementation first
        finalResponse = await generateDirectStreamingResponse(
          fullPrompt,
          (text) => {
            setCurrentResponse(text);
          }
        );
        apiSucceeded = true;
        console.log("Direct API response successful");
      } catch (apiError) {
        console.error("Direct API failed, falling back to local responses:", apiError);
        
        // Fall back to local responses if the API fails
        finalResponse = await generateFallbackStreamingResponse(
          message,
          (text) => {
            setCurrentResponse(text);
          }
        );
        console.log("Using fallback response system");
      }
      
      // When streaming is complete, add the final message
      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: finalResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <GeminiAssistantContext.Provider
      value={{
        isOpen,
        messages,
        openAssistant,
        closeAssistant,
        sendMessage,
        isTyping,
        clearMessages,
        currentResponse,
        isListening,
        startListening,
        stopListening,
        transcript,
        setTranscript,
        copyToClipboard,
        downloadChatAsPDF,
        isCopied
      }}
    >
      {children}
      {isOpen && <GeminiAssistantDialog />}
    </GeminiAssistantContext.Provider>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Trash2, Mic, MicOff, Copy, Download, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function GeminiAssistantDialog() {
  const { 
    closeAssistant, 
    messages, 
    sendMessage, 
    isTyping, 
    currentResponse, 
    clearMessages,
    isListening,
    startListening,
    stopListening,
    transcript,
    setTranscript,
    copyToClipboard,
    downloadChatAsPDF,
    isCopied
  } = useGeminiAssistant();
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = isListening ? transcript : inputValue;
    if (messageToSend.trim()) {
      sendMessage(messageToSend);
      setInputValue("");
      setTranscript("");
      if (isListening) {
        stopListening();
      }
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentResponse]);

  React.useEffect(() => {
    if (isListening) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  // Focus input when assistant opens
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Filter out system messages for display
  const displayMessages = messages.filter(msg => msg.role !== "system");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col h-[600px] bg-background border border-border">
          <motion.div 
            className="flex items-center justify-between p-4 bg-primary text-primary-foreground"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-medium">Dr. Echo</h3>
                <p className="text-xs opacity-80">EchoMed AI Health Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary-foreground opacity-80 hover:opacity-100" onClick={downloadChatAsPDF}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download chat as PDF</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground opacity-80 hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear conversation history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your conversation history with Dr. Echo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearMessages}>Clear history</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="ghost" size="icon" onClick={closeAssistant} className="text-primary-foreground opacity-80 hover:opacity-100">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {displayMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="relative">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        
                        {message.role === "assistant" && (
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => copyToClipboard(message.content)}
                              className="opacity-70 hover:opacity-100 transition-opacity"
                              aria-label="Copy to clipboard"
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted shadow-sm">
                    {currentResponse ? (
                      <div>
                        <p className="text-sm whitespace-pre-wrap">{currentResponse}</p>
                        <div className="h-3 w-3 mt-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce mr-0.5" style={{ animationDelay: "0ms" }}></span>
                          <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce mr-0.5" style={{ animationDelay: "150ms" }}></span>
                          <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "600ms" }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          </ScrollArea>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t bg-background"
          >
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={isListening ? transcript : inputValue}
                  onChange={(e) => isListening ? setTranscript(e.target.value) : setInputValue(e.target.value)}
                  placeholder="Type your health question..."
                  className={`pr-10 ${isListening ? 'border-primary' : ''}`}
                  disabled={isTyping}
                />
                {isListening && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant={isListening ? "destructive" : "outline"}
                      onClick={isListening ? stopListening : startListening}
                      disabled={isTyping}
                      className={isListening ? "animate-pulse" : ""}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isListening ? "Stop voice input" : "Start voice input"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                type="submit" 
                size="icon" 
                disabled={isTyping || (!inputValue.trim() && !transcript.trim())}
                className="bg-primary hover:bg-primary/90"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            <div className="mt-2 text-xs text-center text-muted-foreground">
              <p>Ask me about your health, symptoms, or wellness recommendations</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useGeminiAssistant() {
  const context = useContext(GeminiAssistantContext);
  if (context === undefined) {
    throw new Error("useGeminiAssistant must be used within a GeminiAssistantProvider");
  }
  return context;
}