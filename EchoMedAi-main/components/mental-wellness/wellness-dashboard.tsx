"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoodTrends } from "./mood-trends";
import { MoodPatterns } from "./mood-patterns";
import { AIInsights } from "./ai-insights";
import { 
  Brain, 
  Download, 
  Zap, 
  Sun, 
  LineChart, 
  Waves,
  Moon,
  Battery,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  Activity,
  Award,
  TrendingUp,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WellnessDashboardProps {
  moodScore: number;
  anxietyLevel: number;
  sleepQuality: number;
  energyLevel: number;
  focusLevel: number;
}

export function WellnessDashboard({ 
  moodScore, 
  anxietyLevel, 
  sleepQuality, 
  energyLevel, 
  focusLevel 
}: WellnessDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [showInsightDetails, setShowInsightDetails] = useState(false);
  const [timeRangeData, setTimeRangeData] = useState({
    day: {
      totalMeditationMinutes: 30,
      journalEntries: 1,
      moodImprovement: "+5%",
      sleepAverage: "7.2 hrs",
      bestTimeOfDay: "Morning",
      restPeriod: "3 PM - 4 PM"
    },
    week: {
      totalMeditationMinutes: 120,
      journalEntries: 5,
      moodImprovement: "+15%",
      sleepAverage: "7.5 hrs",
      bestTimeOfDay: "Morning",
      restPeriod: "3 PM - 4 PM"
    },
    month: {
      totalMeditationMinutes: 480,
      journalEntries: 22,
      moodImprovement: "+25%",
      sleepAverage: "7.8 hrs",
      bestTimeOfDay: "Morning",
      restPeriod: "2 PM - 3 PM"
    }
  });

  // Calculate overall wellness score
  const getWellnessScore = () => {
    const moodWeight = 0.25;
    const anxietyWeight = 0.25;
    const sleepWeight = 0.2;
    const energyWeight = 0.15;
    const focusWeight = 0.15;
    
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

  const wellnessScore = getWellnessScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get current time range data
  const getCurrentTimeRangeData = () => {
    return timeRangeData[selectedTimeRange];
  };

  // Effect to update data when time range changes
  useEffect(() => {
    setIsRefreshing(true);
    // Simulate API call to fetch data for the selected time range
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }, [selectedTimeRange]);

  // Get achievement count based on time range
  const getAchievementCount = () => {
    switch(selectedTimeRange) {
      case 'day':
        return 2;
      case 'week':
        return 3;
      case 'month':
        return achievements.length;
      default:
        return 2;
    }
  };

  // Mock data for insights
  const dailyPatterns = {
    bestTimeOfDay: getCurrentTimeRangeData().bestTimeOfDay,
    worstTimeOfDay: "Evening",
    productivePeriod: "10 AM - 2 PM",
    restPeriod: getCurrentTimeRangeData().restPeriod
  };

  const weeklyStats = {
    totalMeditationMinutes: getCurrentTimeRangeData().totalMeditationMinutes,
    journalEntries: getCurrentTimeRangeData().journalEntries,
    moodImprovement: getCurrentTimeRangeData().moodImprovement,
    sleepAverage: getCurrentTimeRangeData().sleepAverage
  };

  const achievements = [
    { title: "Consistency King", description: "Logged mood for 7 days straight", icon: Award },
    { title: "Meditation Master", description: "Completed 10 meditation sessions", icon: Brain },
    { title: "Sleep Champion", description: "Maintained good sleep schedule", icon: Moon },
    { title: "Mood Warrior", description: "Improved mood score by 20%", icon: TrendingUp }
  ];

  // Simulate refreshing the dashboard data
  const refreshDashboard = () => {
    setIsRefreshing(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      const newData = {
        ...timeRangeData,
        [selectedTimeRange]: {
          ...timeRangeData[selectedTimeRange],
          totalMeditationMinutes: Math.floor(Math.random() * 50) + timeRangeData[selectedTimeRange].totalMeditationMinutes,
          moodImprovement: `+${Math.floor(Math.random() * 5) + parseInt(timeRangeData[selectedTimeRange].moodImprovement)}%`
        }
      };
      setTimeRangeData(newData);
      setIsRefreshing(false);
    }, 1000);
  };

  // Get time range label
  const getTimeRangeLabel = () => {
    switch(selectedTimeRange) {
      case 'day':
        return "Today's";
      case 'week':
        return "This Week's";
      case 'month':
        return "This Month's";
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            {getTimeRangeLabel()} Wellness Insights
          </h2>
          <p className="text-muted-foreground">
            Your mental health at a glance
          </p>
        </motion.div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            {(['day', 'week', 'month'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
                className={cn(
                  "rounded-none transition-colors",
                  selectedTimeRange === range && "bg-primary text-primary-foreground"
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => {
              // Handle export based on time range
              console.log(`Exporting ${selectedTimeRange} data...`);
            }}
          >
            <Download className="h-4 w-4" />
            Export {selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)}
          </Button>
          <Button 
            size="sm" 
            className={cn(
              "gap-1",
              isRefreshing && "bg-primary/90"
            )} 
            onClick={refreshDashboard} 
            disabled={isRefreshing}
          >
            <Zap className={cn(
              "h-4 w-4",
              isRefreshing && "animate-pulse"
            )} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1"
        >
          <Card className={cn(
            "h-full transition-colors",
            wellnessScore >= 80 ? "bg-green-500/5" :
            wellnessScore >= 60 ? "bg-blue-500/5" :
            wellnessScore >= 40 ? "bg-yellow-500/5" :
            "bg-red-500/5"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Overall Wellness
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {wellnessScore >= 80 && <Sparkles className="h-5 w-5 text-green-500" />}
                  {wellnessScore < 40 && <AlertCircle className="h-5 w-5 text-red-500" />}
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full py-4">
                <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor={
                          wellnessScore >= 80 ? "rgb(34, 197, 94)" :
                          wellnessScore >= 60 ? "rgb(59, 130, 246)" :
                          wellnessScore >= 40 ? "rgb(234, 179, 8)" :
                          "rgb(239, 68, 68)"
                        } />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="opacity-20"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (wellnessScore / 100) * 283 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className={cn(
                        "text-3xl font-bold",
                        getScoreColor(wellnessScore)
                      )}
                    >
                      {wellnessScore}%
                    </motion.span>
                    <span className="text-xs text-muted-foreground">Wellness Score</span>
                  </div>
                </div>
                
                <div className="w-full space-y-2 mt-4">
                  {[
                    { label: "Mood", value: moodScore * 10, icon: Sun },
                    { label: "Anxiety", value: (10 - anxietyLevel) * 10, icon: Activity },
                    { label: "Sleep", value: sleepQuality * 10, icon: Moon },
                    { label: "Energy", value: energyLevel * 10, icon: Battery },
                    { label: "Focus", value: focusLevel * 10, icon: Target }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <metric.icon className="h-3 w-3" />
                          {metric.label}
                        </span>
                        <span className={getScoreColor(metric.value)}>{metric.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={cn(
                            "h-full rounded-full",
                            getProgressColor(metric.value)
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1 lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Patterns & Insights</CardTitle>
              <CardDescription>Understanding your daily wellness rhythms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Time-based Patterns</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      key={`best-time-${selectedTimeRange}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-3 bg-blue-500/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sun className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Best Time</span>
                      </div>
                      <p className="text-2xl font-semibold text-blue-500">{dailyPatterns.bestTimeOfDay}</p>
                      <p className="text-xs text-muted-foreground">Highest energy & mood</p>
                    </motion.div>
                    <motion.div
                      key={`rest-period-${selectedTimeRange}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-3 bg-orange-500/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Moon className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Rest Period</span>
                      </div>
                      <p className="text-2xl font-semibold text-orange-500">{dailyPatterns.restPeriod}</p>
                      <p className="text-xs text-muted-foreground">Recommended break time</p>
                    </motion.div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Progress Overview</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      key={`meditation-${selectedTimeRange}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-3 bg-green-500/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Meditation</span>
                      </div>
                      <p className="text-2xl font-semibold text-green-500">{weeklyStats.totalMeditationMinutes}min</p>
                      <p className="text-xs text-muted-foreground">Total mindful minutes</p>
                    </motion.div>
                    <motion.div
                      key={`improvement-${selectedTimeRange}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-3 bg-purple-500/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Improvement</span>
                      </div>
                      <p className="text-2xl font-semibold text-purple-500">{weeklyStats.moodImprovement}</p>
                      <p className="text-xs text-muted-foreground">Mood trend this {selectedTimeRange}</p>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Recent Achievements</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowInsightDetails(!showInsightDetails)}>
                    {showInsightDetails ? "Show Less" : "Show More"}
                  </Button>
                </div>
                
                <AnimatePresence>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {achievements.slice(0, showInsightDetails ? getAchievementCount() : 2).map((achievement, index) => (
                      <motion.div
                        key={`${achievement.title}-${selectedTimeRange}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <achievement.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-sm">{achievement.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MoodTrends />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <MoodPatterns />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <AIInsights />
      </motion.div>
    </div>
  );
} 