"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Calendar, 
  Clock, 
  Download, 
  Heart, 
  Moon, 
  Play, 
  PauseCircle,
  RefreshCw, 
  Save, 
  Sun, 
  Volume2,
  Waves,
  Check,
  CalendarDays,
  AlertCircle,
  Sparkles,
  ScrollText,
  Trash2,
  Edit2,
  Archive,
  Cloud,
  Trees,
  Bird,
  Wind,
  Trophy,
  Flame,
  Activity,
  Target,
  Share2,
  Zap,
  Plus,
  LineChart
} from "lucide-react";
import { useGeminiAssistant } from "@/components/ai-assistant/gemini-assistant-provider";
import { generateMentalWellnessResponse } from "@/lib/mentalWellnessRecommendations";
import { MoodTrends } from "@/components/mental-wellness/mood-trends";
import { MoodPatterns } from "@/components/mental-wellness/mood-patterns";
import { AIInsights } from "@/components/mental-wellness/ai-insights";
import { WellnessDashboard } from "@/components/mental-wellness/wellness-dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Badge } from "@/components/ui/badge";

// Define mood tags array once to avoid duplication
const moodTagsData = [
  // Positive emotions - blues & purples (primary colors in the app)
  { name: "Happy", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
  { name: "Joyful", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-950/60" },
  { name: "Calm", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-950/60" },
  { name: "Relaxed", color: "bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-200 dark:hover:bg-sky-950/60" },
  { name: "Peaceful", color: "bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-200 dark:hover:bg-cyan-950/60" },
  
  // Neutral emotions - teals & greens
  { name: "Content", color: "bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-200 dark:hover:bg-teal-950/60" },
  { name: "Hopeful", color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-950/60" },
  { name: "Grateful", color: "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-950/60" },
  { name: "Inspired", color: "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800 hover:bg-violet-200 dark:hover:bg-violet-950/60" },
  
  // Energetic emotions - warm colors
  { name: "Energetic", color: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-950/60" },
  { name: "Motivated", color: "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-950/60" },
  { name: "Excited", color: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-950/60" },
  
  // Negative emotions - reds & pinks
  { name: "Anxious", color: "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-950/60" },
  { name: "Nervous", color: "bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border-pink-200 dark:border-pink-800 hover:bg-pink-200 dark:hover:bg-pink-950/60" },
  { name: "Stressed", color: "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-950/60" },
  { name: "Overwhelmed", color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-950/60" },
  { name: "Frustrated", color: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-950/60" },
  
  // Sad emotions - blues & indigos
  { name: "Sad", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-950/60" },
  { name: "Gloomy", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-950/60" },
  
  // Low energy emotions - grays & slates
  { name: "Tired", color: "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800" },
  { name: "Exhausted", color: "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" },
  
  // Confusion emotions - neutrals
  { name: "Confused", color: "bg-stone-100 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800" },
  { name: "Uncertain", color: "bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800" }
];

type JournalEntry = {
  id: string;
  date: Date;
  text: string;
  mood: string[];
  timeOfDay: "morning" | "afternoon" | "night";
  emoji: string | null;
};

// Add new type and state at the top of the component
type WellnessEntry = {
  id: string;
  date: Date;
  moodScore: number;
  anxietyLevel: number;
  sleepQuality: number;
  energyLevel: number;
  focusLevel: number;
  wellnessScore: number;
};

export default function MentalWellnessPage() {
  const { openAssistant, sendMessage } = useGeminiAssistant();
  const [activeTab, setActiveTab] = useState("assessment");
  const [moodScore, setMoodScore] = useState<number>(7);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [energyLevel, setEnergyLevel] = useState<number>(6);
  const [focusLevel, setFocusLevel] = useState<number>(7);
  const [journalEntry, setJournalEntry] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(300);
  const [selectedSound, setSelectedSound] = useState("rain");
  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([]);
  const [journalCharCount, setJournalCharCount] = useState(0);
  const [journalSentiment, setJournalSentiment] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "night">("morning");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: "entry-1",
      date: new Date(Date.now() - 86400000), // Yesterday
      text: "Today was a productive day at work. I managed to complete all my tasks ahead of schedule and had a great team meeting. Feeling accomplished!",
      mood: ["Calm", "Content"],
      timeOfDay: "night",
      emoji: "😌"
    },
    {
      id: "entry-2",
      date: new Date(Date.now() - 5 * 86400000), // 5 days ago
      text: "Feeling a bit nervous about the presentation today. I hope it goes well. I've practiced several times but still feel unprepared.",
      mood: ["Anxious", "Nervous"],
      timeOfDay: "morning",
      emoji: "😰"
    },
    {
      id: "entry-3",
      date: new Date(Date.now() - 7 * 86400000), // 7 days ago
      text: "Had a wonderful dinner with friends. We talked about our future plans and reminisced about college days. It's been ages since we all got together!",
      mood: ["Happy", "Joyful"],
      timeOfDay: "night",
      emoji: "😊"
    }
  ]);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [entryAnimation, setEntryAnimation] = useState<'saving' | 'editing' | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("calm");
  const [volume, setVolume] = useState(50);
  const [showGuidedContent, setShowGuidedContent] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [wellnessHistory, setWellnessHistory] = useState<WellnessEntry[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [demoData] = useState(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map((date) => {
      const dayOfWeek = date.getDay();
      let baseMood = 7;
      if (dayOfWeek === 0 || dayOfWeek === 6) baseMood = 8;
      if (dayOfWeek === 2 || dayOfWeek === 3) baseMood = 6;
      
      const mood = Math.max(1, Math.min(10, baseMood + (Math.random() * 4 - 2)));
      
      return {
        date: date.toISOString().split('T')[0],
        formattedDate: `${date.getDate()}/${date.getMonth() + 1}`,
        value: parseFloat(mood.toFixed(1)),
        weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
      };
    });
  });
  
  const moodLabels = {
    1: "Very Low",
    3: "Low",
    5: "Neutral",
    7: "Good",
    9: "Excellent"
  };
  
  const anxietyLabels = {
    1: "None",
    3: "Mild",
    5: "Moderate",
    7: "High",
    9: "Severe"
  };
  
  const sleepLabels = {
    1: "Poor",
    3: "Fair",
    5: "Average",
    7: "Good",
    9: "Excellent"
  };
  
  const energyLabels = {
    1: "Exhausted",
    3: "Tired",
    5: "Neutral",
    7: "Energetic",
    9: "Very Energetic"
  };
  
  const focusLabels = {
    1: "Distracted",
    3: "Somewhat Focused",
    5: "Moderately Focused",
    7: "Focused",
    9: "Highly Focused"
  };
  
  const getWellnessScore = () => {
    // Calculate overall wellness score (0-100)
    const moodWeight = 0.25;
    const anxietyWeight = 0.25;
    const sleepWeight = 0.2;
    const energyWeight = 0.15;
    const focusWeight = 0.15;
    
    // Normalize anxiety (lower is better)
    const normalizedAnxiety = 10 - anxietyLevel;
    
    const score = (
      (moodScore * moodWeight) +
      (normalizedAnxiety * anxietyWeight) +
      (sleepQuality * sleepWeight) +
      (energyLevel * energyWeight) +
      (focusLevel * focusWeight)
    ) * 10;
    
    return Math.round(score);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      // Simulate countdown
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return meditationTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const resetMeditation = () => {
    setIsPlaying(false);
    setRemainingTime(meditationTime);
  };
  
  const setMeditationDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setMeditationTime(seconds);
    setRemainingTime(seconds);
  };
  
  const handleConsultAI = () => {
    // Prepare the message for the AI assistant
    const message = `
I'd like some mental wellness advice based on my current state:

Mood: ${moodScore}/10 (${Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'})
Anxiety Level: ${anxietyLevel}/10 (${Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'})
Sleep Quality: ${sleepQuality}/10 (${Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'})
Energy Level: ${energyLevel}/10 (${Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'})
Focus Level: ${focusLevel}/10 (${Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'})

Journal Entry: ${journalEntry || 'No journal entry provided'}

Based on this information, could you provide some personalized mental wellness recommendations?
`;
    
    // Open the assistant first
    openAssistant();
    
    // Then send the message directly using the provider's sendMessage function
    // This bypasses the DOM manipulation which could be causing issues
    setTimeout(() => {
      sendMessage(message);
    }, 300);
  };
  
  const wellnessScore = getWellnessScore();
  
  const toggleMoodTag = (tagName: string) => {
    if (selectedMoodTags.includes(tagName)) {
      setSelectedMoodTags(selectedMoodTags.filter(tag => tag !== tagName));
    } else {
      setSelectedMoodTags([...selectedMoodTags, tagName]);
    }
  };
  
  const analyzeSentiment = (text: string, tags: string[]) => {
    const positiveWords = ['happy', 'joy', 'great', 'excellent', 'amazing', 'good', 'wonderful', 'love', 'enjoy', 'grateful'];
    const negativeWords = ['sad', 'upset', 'anxious', 'worried', 'stressed', 'angry', 'frustrated', 'tired', 'bad', 'hard'];
    
    // Count occurrences of positive/negative words
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Check text content
    const lowerText = text.toLowerCase();
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    // Factor in mood tags
    const positiveTags = ['Happy', 'Joyful', 'Calm', 'Relaxed', 'Peaceful', 'Content', 'Hopeful', 'Grateful', 'Inspired', 'Energetic', 'Motivated', 'Excited'];
    const negativeTags = ['Anxious', 'Nervous', 'Stressed', 'Overwhelmed', 'Frustrated', 'Sad', 'Gloomy', 'Tired', 'Exhausted', 'Confused', 'Uncertain'];
    
    tags.forEach(tag => {
      if (positiveTags.includes(tag)) positiveCount += 2;
      if (negativeTags.includes(tag)) negativeCount += 2;
    });
    
    // Determine overall sentiment
    if (positiveCount > negativeCount + 2) return 'positive';
    if (negativeCount > positiveCount + 2) return 'negative';
    return 'neutral';
  };
  
  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalEntry(text);
    setJournalCharCount(text.length);
    
    // Only analyze sentiment if we have enough text
    if (text.length > 10) {
      setJournalSentiment(analyzeSentiment(text, selectedMoodTags));
    } else {
      setJournalSentiment('neutral');
    }
  };
  
  const handleSaveEntry = () => {
    setSaveAnimation(true);
    
    // Only save if there's actual content
    if (journalEntry.trim().length > 0) {
      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        date: new Date(),
        text: journalEntry,
        mood: selectedMoodTags,
        timeOfDay: timeOfDay,
        emoji: selectedEmoji
      };
      
      // Add the new entry to the beginning of the array
      setJournalEntries(prev => [newEntry, ...prev]);
      setEntryAnimation('saving');
      
      // Trigger confetti effect
      setShowConfetti(true);
      
      // Clear the form after saving
      setTimeout(() => {
        setSaveAnimation(false);
        setJournalEntry("");
        setSelectedMoodTags([]);
        if (selectedEmoji) setSelectedEmoji(null);
        setEntryAnimation(null);
      }, 1500);
    } else {
      // If no content, just reset the animation
      setTimeout(() => {
        setSaveAnimation(false);
      }, 1500);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };
  
  const getTimeOfDayInfo = () => {
    switch(timeOfDay) {
      case "morning":
        return { icon: <Sun className="h-5 w-5 text-warning" />, label: "Morning", emoji: "🌅" };
      case "afternoon":
        return { icon: <Sun className="h-5 w-5 text-orange-500" />, label: "Afternoon", emoji: "☀️" };
      case "night":
        return { icon: <Moon className="h-5 w-5 text-blue-500" />, label: "Night", emoji: "🌙" };
    }
  };
  
  const formatJournalDate = (date: Date) => {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 86400000).toDateString();
    const dateString = date.toDateString();
    
    if (dateString === today) return "Today";
    if (dateString === yesterday) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);
  
  const handleEditEntry = (entryId: string) => {
    // Find the entry
    const entryToEdit = journalEntries.find(entry => entry.id === entryId);
    if (!entryToEdit) return;
    
    // Set the entry for editing
    setJournalEntry(entryToEdit.text);
    setSelectedMoodTags(entryToEdit.mood);
    setTimeOfDay(entryToEdit.timeOfDay);
    if (entryToEdit.emoji) setSelectedEmoji(entryToEdit.emoji);
    
    // Set animation state
    setEntryAnimation('editing');
    
    // Switch to journal tab
    setActiveTab("journal");
    
    // Show a short animation
    setTimeout(() => {
      setEntryAnimation(null);
    }, 1500);
  };
  
  const handleDeleteEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
  };
  
  const handleSaveChanges = () => {
    const newEntry: WellnessEntry = {
      id: `entry-${Date.now()}`,
      date: new Date(),
      moodScore,
      anxietyLevel,
      sleepQuality,
      energyLevel,
      focusLevel,
      wellnessScore: getWellnessScore()
    };
    
    setWellnessHistory(prev => [newEntry, ...prev]);
    setLastSavedTime(new Date());
    setShowSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };
  
  const formatHistoryDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium">{`${data.weekday}, ${data.date}`}</p>
          <p style={{ color: 'var(--primary)' }}>
            Wellness Score: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Mental Wellness</h1>
        <p className="text-muted-foreground mb-8">
          Track, assess, and improve your mental wellbeing
        </p>
      </motion.div>
      
      <Tabs defaultValue="assessment" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="assessment" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Mood Journal
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-1">
            <Waves className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: -30, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Brain className="h-6 w-6 text-primary" />
                    </motion.div>
                    Daily Wellness Check-in
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Track your mental wellbeing journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Mood Slider with Enhanced UI */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        Mood
                      </Label>
                      <motion.span 
                        key={moodScore}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          moodScore >= 7 ? "bg-green-500/10 text-green-500" :
                          moodScore >= 4 ? "bg-blue-500/10 text-blue-500" :
                          "bg-red-500/10 text-red-500"
                        )}
                      >
                        {Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[moodScore]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setMoodScore(value[0])}
                        className="py-4"
                      />
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span className="text-red-400">Very Low</span>
                        <span className="text-blue-400">Neutral</span>
                        <span className="text-green-400">Excellent</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Anxiety Slider with Enhanced UI */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        Anxiety Level
                      </Label>
                      <motion.span 
                        key={anxietyLevel}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          anxietyLevel <= 3 ? "bg-green-500/10 text-green-500" :
                          anxietyLevel <= 6 ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-red-500/10 text-red-500"
                        )}
                      >
                        {Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[anxietyLevel]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setAnxietyLevel(value[0])}
                        className="py-4"
                      />
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span className="text-green-400">Calm</span>
                        <span className="text-yellow-400">Moderate</span>
                        <span className="text-red-400">High</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sleep Quality with Enhanced UI */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-500" />
                        Sleep Quality
                      </Label>
                      <motion.span 
                        key={sleepQuality}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          sleepQuality >= 7 ? "bg-green-500/10 text-green-500" :
                          sleepQuality >= 4 ? "bg-blue-500/10 text-blue-500" :
                          "bg-red-500/10 text-red-500"
                        )}
                      >
                        {Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[sleepQuality]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setSleepQuality(value[0])}
                        className="py-4"
                      />
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span className="text-red-400">Poor</span>
                        <span className="text-blue-400">Fair</span>
                        <span className="text-green-400">Excellent</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Energy Level with Enhanced UI */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Energy Level
                      </Label>
                      <motion.span 
                        key={energyLevel}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          energyLevel >= 7 ? "bg-green-500/10 text-green-500" :
                          energyLevel >= 4 ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-red-500/10 text-red-500"
                        )}
                      >
                        {Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[energyLevel]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setEnergyLevel(value[0])}
                        className="py-4"
                      />
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span className="text-red-400">Exhausted</span>
                        <span className="text-yellow-400">Moderate</span>
                        <span className="text-green-400">Energetic</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Focus Level with Enhanced UI */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-indigo-500" />
                        Focus Level
                      </Label>
                      <motion.span 
                        key={focusLevel}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          focusLevel >= 7 ? "bg-green-500/10 text-green-500" :
                          focusLevel >= 4 ? "bg-indigo-500/10 text-indigo-500" :
                          "bg-red-500/10 text-red-500"
                        )}
                      >
                        {Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[focusLevel]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setFocusLevel(value[0])}
                        className="py-4"
                      />
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span className="text-red-400">Distracted</span>
                        <span className="text-indigo-400">Moderate</span>
                        <span className="text-green-400">Highly Focused</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Overall Wellness Score */}
                  <motion.div 
                    className="mt-8 p-4 rounded-lg border bg-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Overall Wellness Score</h3>
                      <motion.div
                        key={wellnessScore}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "text-2xl font-bold",
                          wellnessScore >= 80 ? "text-green-500" :
                          wellnessScore >= 60 ? "text-blue-500" :
                          wellnessScore >= 40 ? "text-yellow-500" :
                          "text-red-500"
                        )}
                      >
                        {wellnessScore}%
                      </motion.div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${wellnessScore}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={cn(
                          "h-full rounded-full",
                          wellnessScore >= 80 ? "bg-green-500" :
                          wellnessScore >= 60 ? "bg-blue-500" :
                          wellnessScore >= 40 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {wellnessScore >= 80 ? "Excellent - Keep up the great work!" : 
                       wellnessScore >= 60 ? "Good - You're doing well" : 
                       wellnessScore >= 40 ? "Fair - Room for improvement" : 
                       "Needs attention - Consider seeking support"}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Button 
                      onClick={handleConsultAI} 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <motion.div
                        className="flex items-center justify-center w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </motion.div>
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowHistoryDialog(true)}>
                        <LineChart className="mr-2 h-4 w-4" />
                        View History
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                    {showSaveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-center text-green-500 flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Changes saved successfully
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Score</CardTitle>
                  <CardDescription>
                    Your overall mental wellness rating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold">{wellnessScore}</div>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={wellnessScore >= 80 ? "hsl(var(--success))" : wellnessScore >= 60 ? "hsl(var(--primary))" : wellnessScore >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                          strokeWidth="10"
                          strokeDasharray={`${(wellnessScore / 100) * 283} 283`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {wellnessScore >= 80 ? "Excellent" : 
                       wellnessScore >= 60 ? "Good" : 
                       wellnessScore >= 40 ? "Fair" : 
                       "Needs Attention"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last check-in</span>
                      <span className="font-medium">Today, 9:41 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>7-day trend</span>
                      <span className="font-medium text-success">+5 points</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleConsultAI} className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Get AI Recommendations
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("meditation")}>
                    <Waves className="mr-2 h-4 w-4" />
                    Start Meditation
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("journal")}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Write in Journal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Therapy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="journal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={false}
                animate={entryAnimation === 'editing' ? { 
                  y: [0, -10, 0],
                  scale: [1, 1.01, 1]
                } : {}}
                transition={{ duration: 1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="relative pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Mood Journal</CardTitle>
                        <CardDescription>
                          Express your thoughts and feelings to track your emotional wellbeing
                        </CardDescription>
                      </div>
                      {selectedEmoji && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                          transition={{ duration: 0.5, type: "spring" }}
                          className="text-3xl"
                        >
                          {selectedEmoji}
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-transparent to-transparent">
                      {journalSentiment === 'positive' && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="h-full bg-gradient-to-r from-transparent via-green-500/30 to-green-500"
                        />
                      )}
                      {journalSentiment === 'negative' && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="h-full bg-gradient-to-r from-transparent via-red-500/30 to-red-500"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="flex items-center gap-1 border rounded-full overflow-hidden"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Button 
                              variant={timeOfDay === "morning" ? "default" : "ghost"}
                              size="sm" 
                              className={`px-3 rounded-none ${timeOfDay === "morning" ? "" : "hover:bg-muted"}`}
                              onClick={() => setTimeOfDay("morning")}
                            >
                              <Sun className="h-4 w-4 mr-1 text-warning" />
                              <span className="text-xs">Morning</span>
                            </Button>
                            <Button 
                              variant={timeOfDay === "afternoon" ? "default" : "ghost"}
                              size="sm" 
                              className={`px-3 rounded-none ${timeOfDay === "afternoon" ? "" : "hover:bg-muted"}`}
                              onClick={() => setTimeOfDay("afternoon")}
                            >
                              <Sun className="h-4 w-4 mr-1 text-orange-500" />
                              <span className="text-xs">Afternoon</span>
                            </Button>
                            <Button 
                              variant={timeOfDay === "night" ? "default" : "ghost"}
                              size="sm" 
                              className={`px-3 rounded-none ${timeOfDay === "night" ? "" : "hover:bg-muted"}`}
                              onClick={() => setTimeOfDay("night")}
                            >
                              <Moon className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="text-xs">Night</span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 ml-1"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <span className="text-lg">😊</span>
                            </Button>
                          </motion.div>
                          
                          <AnimatePresence>
                            {showEmojiPicker && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute mt-8 ml-10 z-50 bg-background shadow-lg rounded-lg border p-2"
                              >
                                <div className="grid grid-cols-5 gap-1">
                                  {["😊", "😂", "🥰", "😌", "🤔", "😢", "😡", "😴", "🥳", "😎"].map(emoji => (
                                    <motion.button 
                                      key={emoji}
                                      className="text-xl hover:bg-muted p-1 rounded"
                                      onClick={() => handleEmojiSelect(emoji)}
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      {emoji}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="relative">
                        <motion.div 
                          initial={false}
                          animate={
                            entryAnimation === 'saving' 
                              ? { y: [0, -5, 0], opacity: [1, 0.7, 1] } 
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                        >
                          <Textarea 
                            ref={textareaRef}
                            placeholder="Write about your thoughts, feelings, and experiences..." 
                            className="min-h-[200px] pr-16 transition-all duration-300 border-primary/20 focus-visible:border-primary/50"
                            value={journalEntry}
                            onChange={handleJournalChange}
                          />
                        </motion.div>
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                          {journalCharCount} chars
                        </div>
                        {journalSentiment === 'positive' && journalEntry.length > 10 && (
                          <div className="absolute top-2 right-2">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <Sparkles className="h-5 w-5 text-green-500 opacity-70" />
                            </motion.div>
                          </div>
                        )}
                        {journalSentiment === 'negative' && journalEntry.length > 10 && (
                          <div className="absolute top-2 right-2">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <AlertCircle className="h-5 w-5 text-red-500 opacity-70" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Mood Tags</Label>
                      <motion.div 
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                      >
                        {moodTagsData.map((tag, index) => {
                          const isSelected = selectedMoodTags.includes(tag.name);
                          return (
                            <motion.div
                              key={tag.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              whileHover={{ 
                                scale: 1.05, 
                                y: -2,
                                transition: { duration: 0.2 } 
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`rounded-full ${tag.color} border ${isSelected ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                                onClick={() => toggleMoodTag(tag.name)}
                              >
                                {tag.name}
                                {isSelected && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="ml-1"
                                  >
                                    ✓
                                  </motion.span>
                                )}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedMoodTags.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="mt-3 p-3 bg-muted/20 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-medium">Selected Feelings:</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setSelectedMoodTags([])}
                            >
                              Clear All
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <AnimatePresence>
                              {selectedMoodTags.map(tagName => {
                                const tagInfo = moodTagsData.find(t => t.name === tagName);
                                
                                return (
                                  <motion.div 
                                    key={tagName}
                                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${tagInfo?.color || ""}`}
                                  >
                                    {tagName}
                                    <motion.button 
                                      onClick={() => toggleMoodTag(tagName)} 
                                      className="ml-1 rounded-full hover:bg-foreground/10 p-0.5"
                                      whileHover={{ rotate: 90 }}
                                      whileTap={{ scale: 0.8 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                      </svg>
                                    </motion.button>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex justify-end space-x-2">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button variant="outline">
                          <Save className="mr-2 h-4 w-4" />
                          Save Draft
                        </Button>
                      </motion.div>
                      <AnimatePresence>
                        {!saveAnimation ? (
                          <motion.div 
                            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }} 
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button onClick={handleSaveEntry}>
                              <Download className="mr-2 h-4 w-4" />
                              Save Entry
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ width: 100 }}
                            animate={{ width: 40 }}
                            exit={{ width: 100 }}
                            className="relative"
                          >
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0 }}
                              transition={{ delay: 0.5 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Button className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Save Entry
                              </Button>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.3 }}
                              animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
                              transition={{ delay: 0.3, type: "spring" }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center">
                                <Check className="h-5 w-5" />
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5" />
                    Journal History
                  </CardTitle>
                  <CardDescription>
                    Your recent journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {journalEntries.slice(0, 3).map((entry, index) => (
                      <motion.div 
                        key={entry.id} 
                        className="border-b pb-4 last:border-0 last:pb-0 relative group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ 
                          x: 5,
                          backgroundColor: "rgba(var(--card), 0.5)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="font-medium text-sm">{formatJournalDate(entry.date)}</div>
                            <div className="text-xs text-muted-foreground">
                              {entry.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm bg-muted px-2 py-0.5 rounded-full">
                              {entry.mood[0] || "Neutral"}
                            </span>
                            <span className="text-lg">{entry.emoji || ""}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.text}</p>
                        
                        <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            className="p-1 bg-background rounded-full shadow-sm mb-1 border"
                            onClick={() => handleEditEntry(entry.id)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 className="h-3 w-3 text-blue-500" />
                          </motion.button>
                          <motion.button
                            className="p-1 bg-background rounded-full shadow-sm border"
                            onClick={() => handleDeleteEntry(entry.id)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAllEntries(true)}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      View All Entries {journalEntries.length > 0 && `(${journalEntries.length})`}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meditation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className={cn(
                "overflow-hidden transition-colors duration-500",
                selectedTheme === "calm" && "bg-gradient-to-br from-blue-500/5 via-green-500/5 to-teal-500/5 dark:from-blue-500/10 dark:via-green-500/10 dark:to-teal-500/10",
                selectedTheme === "focus" && "bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:via-blue-500/10 dark:to-indigo-500/10",
                selectedTheme === "sleep" && "bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10",
                selectedTheme === "energy" && "bg-gradient-to-br from-orange-500/5 via-yellow-500/5 to-red-500/5 dark:from-orange-500/10 dark:via-yellow-500/10 dark:to-red-500/10"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-6 w-6 text-primary" />
                    {showGuidedContent ? "Guided Meditation" : "Meditation Timer"}
                  </CardTitle>
                  <CardDescription>
                    {showGuidedContent 
                      ? "Follow along with our guided meditation session" 
                      : "Take a moment to relax and focus on your breathing"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="relative h-64 w-64">
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center z-10"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={cn(
                          "text-4xl font-bold",
                          selectedTheme === "calm" && "text-blue-500 dark:text-blue-400",
                          selectedTheme === "focus" && "text-purple-500 dark:text-purple-400",
                          selectedTheme === "sleep" && "text-indigo-500 dark:text-indigo-400",
                          selectedTheme === "energy" && "text-orange-500 dark:text-orange-400"
                        )}>
                          {formatTime(remainingTime)}
                        </div>
                      </motion.div>

                      <svg className="h-full w-full -rotate-90">
                        <defs>
                          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--secondary))" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8%"
                          className="opacity-20"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="url(#timerGradient)"
                          strokeWidth="8%"
                          strokeDasharray="283"
                          strokeDashoffset={`${(1 - remainingTime / meditationTime) * 283}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>

                      {/* Enhanced breathing animation */}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <motion.div
                              animate={{ 
                                scale: remainingTime % 8 < 4 ? [1, 1.4] : [1.4, 1],
                                opacity: remainingTime % 8 < 4 ? [0.3, 0.6] : [0.6, 0.3]
                              }}
                              transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                              }}
                            >
                              <div className="absolute inset-0 animate-ping-slow rounded-full bg-primary/10" />
                              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
                              <div className="h-32 w-32 rounded-full bg-primary/5 backdrop-blur-sm" />
                            </motion.div>
                            {!showGuidedContent && (
                              <motion.div 
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[150%] text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className={cn(
                                  "px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm",
                                  selectedTheme === "calm" && "bg-blue-500/10 text-blue-500",
                                  selectedTheme === "focus" && "bg-purple-500/10 text-purple-500",
                                  selectedTheme === "sleep" && "bg-indigo-500/10 text-indigo-500",
                                  selectedTheme === "energy" && "bg-orange-500/10 text-orange-500"
                                )}>
                                  {remainingTime % 8 < 4 ? "Inhale" : "Exhale"}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" onClick={resetMeditation}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button size="lg" onClick={toggleMeditation} className="min-w-[120px] bg-primary/90 hover:bg-primary">
                      {isPlaying ? (
                        <>
                          <PauseCircle className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setShowGuidedContent(!showGuidedContent)}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showGuidedContent && (
                    <div className="space-y-4 text-center animate-fade-in">
                      <p className="text-lg font-medium text-primary">
                        {remainingTime > meditationTime - 10 && "Find a comfortable position..."}
                        {remainingTime <= meditationTime - 10 && remainingTime > meditationTime - 20 && "Take a deep breath in..."}
                        {remainingTime <= meditationTime - 20 && remainingTime > meditationTime - 30 && "Focus on your breathing..."}
                        {/* Add more guided content based on time */}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Duration</Label>
                      <span className="text-sm text-muted-foreground">{meditationTime / 60} minutes</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      {[1, 3, 5, 10, 15, 20].map((minutes) => (
                        <Button 
                          key={minutes} 
                          variant={meditationTime === minutes * 60 ? "default" : "outline"}
                          onClick={() => setMeditationDuration(minutes)}
                          className={cn(
                            "flex-1",
                            meditationTime === minutes * 60 && "bg-primary/90 hover:bg-primary"
                          )}
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Theme</Label>
                      <span className="text-sm text-muted-foreground capitalize">{selectedTheme}</span>
                    </div>
                    <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-2 gap-4">
                      {[
                        { id: "calm", icon: Waves, label: "Calm & Relaxed" },
                        { id: "focus", icon: Brain, label: "Deep Focus" },
                        { id: "sleep", icon: Moon, label: "Better Sleep" },
                        { id: "energy", icon: Sun, label: "Energy Boost" }
                      ].map((theme) => (
                        <div key={theme.id}>
                          <RadioGroupItem value={theme.id} id={theme.id} className="peer sr-only" />
                          <Label
                            htmlFor={theme.id}
                            className={cn(
                              "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                              selectedTheme === theme.id && "border-primary bg-primary/5"
                            )}
                          >
                            <theme.icon className="mb-3 h-6 w-6" />
                            {theme.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Ambient Sound</Label>
                      <span className="text-sm text-muted-foreground capitalize">{selectedSound}</span>
                    </div>
                    <RadioGroup value={selectedSound} onValueChange={setSelectedSound} className="grid grid-cols-3 gap-4">
                      {[
                        { id: "rain", icon: Cloud, label: "Rain" },
                        { id: "forest", icon: Trees, label: "Forest" },
                        { id: "ocean", icon: Waves, label: "Ocean" },
                        { id: "white-noise", icon: Volume2, label: "White Noise" },
                        { id: "birds", icon: Bird, label: "Birds" },
                        { id: "wind", icon: Wind, label: "Wind" }
                      ].map((sound) => (
                        <div key={sound.id}>
                          <RadioGroupItem value={sound.id} id={sound.id} className="peer sr-only" />
                          <Label
                            htmlFor={sound.id}
                            className={cn(
                              "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                              selectedSound === sound.id && "border-primary bg-primary/5"
                            )}
                          >
                            <sound.icon className="mb-3 h-6 w-6" />
                            {sound.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Volume</Label>
                        <span className="text-sm text-muted-foreground">{volume}%</span>
                      </div>
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setVolume(value[0])}
                        className="py-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Meditation Stats
                  </CardTitle>
                  <CardDescription>
                    Your meditation journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold text-primary">24</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">This Week</p>
                      <p className="text-2xl font-bold text-primary">3</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Minutes</p>
                      <p className="text-2xl font-bold text-primary">187</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
                      <p className="text-2xl font-bold text-primary">5 days</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-background/80 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>Current streak</span>
                      </div>
                      <span className="font-medium text-primary">2 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/80 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>Last session</span>
                      </div>
                      <span className="font-medium text-primary">Yesterday</span>
                    </div>
                  </div>
                  
                  {achievement && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-primary/10 rounded-lg p-4 text-center"
                    >
                      <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="font-medium text-primary">{achievement}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommended Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      title: "Stress Relief",
                      description: "Gentle guidance to release tension",
                      duration: "10 min",
                      type: "Guided",
                      theme: "calm"
                    },
                    { 
                      title: "Better Sleep",
                      description: "Peaceful transition to restful sleep",
                      duration: "15 min",
                      type: "Guided",
                      theme: "sleep"
                    },
                    { 
                      title: "Focus & Concentration",
                      description: "Enhance mental clarity and focus",
                      duration: "5 min",
                      type: "Unguided",
                      theme: "focus"
                    },
                    { 
                      title: "Morning Energy",
                      description: "Start your day with vitality",
                      duration: "10 min",
                      type: "Guided",
                      theme: "energy"
                    }
                  ].map((session, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "rounded-lg border p-4 transition-colors hover:bg-accent",
                        session.theme === selectedTheme && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{session.duration}</span>
                            <span className="mx-2">•</span>
                            <span>{session.type}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedTheme(session.theme);
                            setMeditationDuration(parseInt(session.duration));
                            setShowGuidedContent(session.type === "Guided");
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <WellnessDashboard 
            moodScore={moodScore}
            anxietyLevel={anxietyLevel}
            sleepQuality={sleepQuality}
            energyLevel={energyLevel}
            focusLevel={focusLevel}
          />
        </TabsContent>
      </Tabs>
      {showAllEntries && (
        <Dialog open={showAllEntries} onOpenChange={setShowAllEntries}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Journal History
              </DialogTitle>
              <DialogDescription>
                All your saved journal entries
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 pt-2">
                {journalEntries.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: [10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Archive className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p>No journal entries yet. Start writing to track your mood journey!</p>
                    </motion.div>
                  </div>
                ) : (
                  journalEntries.map((entry, index) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        backgroundColor: "var(--background)",
                        borderColor: "var(--primary)"
                      }}
                      className="border rounded-lg p-4 space-y-3 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatJournalDate(entry.date)}</span>
                            <span className="text-sm text-muted-foreground">
                              {entry.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {entry.timeOfDay === "morning" && <Sun className="h-4 w-4 text-warning" />}
                            {entry.timeOfDay === "afternoon" && <Sun className="h-4 w-4 text-orange-500" />}
                            {entry.timeOfDay === "night" && <Moon className="h-4 w-4 text-blue-500" />}
                            <span className="text-sm capitalize">{entry.timeOfDay}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.emoji && (
                            <motion.span 
                              className="text-xl"
                              whileHover={{ scale: 1.3, rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              {entry.emoji}
                            </motion.span>
                          )}
                        </div>
                      </div>
                      
                      {entry.mood.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.mood.map((tag, tagIndex) => {
                            const tagInfo = moodTagsData.find(t => t.name === tag);
                            return (
                              <motion.span 
                                key={tag} 
                                className={`px-2 py-0.5 rounded-full text-xs ${tagInfo?.color || ""}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: tagIndex * 0.05 + 0.1 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                {tag}
                              </motion.span>
                            );
                          })}
                        </div>
                      )}
                      
                      <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                      
                      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <motion.button
                          className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          onClick={() => {
                            handleEditEntry(entry.id);
                            setShowAllEntries(false);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </motion.button>
                        <motion.button
                          className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          onClick={() => handleDeleteEntry(entry.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Wellness History
            </DialogTitle>
            <DialogDescription>
              Your wellness check-in history
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-4 p-4">
              {wellnessHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LineChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No wellness entries yet. Start by saving your first check-in!</p>
                </div>
              ) : (
                wellnessHistory.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{formatHistoryDate(entry.date)}</p>
                        <p className="text-sm text-muted-foreground">Wellness Score: {entry.wellnessScore}%</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        entry.wellnessScore >= 80 ? "bg-green-500/10 text-green-500" :
                        entry.wellnessScore >= 60 ? "bg-blue-500/10 text-blue-500" :
                        entry.wellnessScore >= 40 ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      )}>
                        {entry.wellnessScore >= 80 ? "Excellent" :
                         entry.wellnessScore >= 60 ? "Good" :
                         entry.wellnessScore >= 40 ? "Fair" :
                         "Needs Attention"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Sun className="h-4 w-4" />
                          Mood
                        </div>
                        <p className="font-medium">{entry.moodScore}/10</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          Anxiety
                        </div>
                        <p className="font-medium">{entry.anxietyLevel}/10</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Moon className="h-4 w-4" />
                          Sleep
                        </div>
                        <p className="font-medium">{entry.sleepQuality}/10</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          Energy
                        </div>
                        <p className="font-medium">{entry.energyLevel}/10</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          Focus
                        </div>
                        <p className="font-medium">{entry.focusLevel}/10</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Ready to Record</CardTitle>
          <CardDescription>Track your daily wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="formattedDate" 
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickCount={5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#gradientArea)"
                    dot={{
                      r: 4,
                      fill: "var(--background)",
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--background)",
                      strokeWidth: 2
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-primary">3 days</p>
              </div>
              <Button onClick={handleSaveChanges} className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Record Today
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}