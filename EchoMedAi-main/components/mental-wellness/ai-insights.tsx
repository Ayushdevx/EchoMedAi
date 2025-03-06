"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Moon, 
  Sun, 
  Sparkles, 
  CloudLightning, 
  ArrowRight, 
  ChevronRight, 
  Coffee, 
  Timer,
  Dumbbell,
  Utensils,
  Users,
  BookOpenCheck
} from "lucide-react";

// Mock data for AI insights
const insightCategories = [
  {
    id: "patterns",
    name: "Mood Patterns",
    icon: TrendingUp,
    insights: [
      {
        title: "Weekend Elevation",
        description: "Your mood consistently improves by 28% on weekends compared to weekdays. This suggests work-related stress might be affecting your wellbeing.",
        severity: "info",
        impact: 70,
        iconColor: "text-blue-500",
        icon: Sun,
        recommendations: [
          "Try to incorporate more weekend-like activities into your weekday routine",
          "Practice transitioning techniques on Sunday evenings to reduce Monday anxiety",
          "Consider discussing workload management with your supervisor"
        ]
      },
      {
        title: "Morning Brightness",
        description: "Morning recordings show 32% higher mood scores than evening ones, indicating potential energy depletion throughout the day.",
        severity: "info",
        impact: 65,
        iconColor: "text-amber-500",
        icon: Coffee,
        recommendations: [
          "Implement an afternoon energy-boosting routine",
          "Schedule demanding tasks in the morning when your mood is highest",
          "Consider your evening routine to improve recovery for the next day"
        ]
      }
    ]
  },
  {
    id: "triggers",
    name: "Mood Triggers",
    icon: CloudLightning,
    insights: [
      {
        title: "Sleep Quality Correlation",
        description: "Poor sleep quality strongly correlates with lower mood the following day (83% correlation). Your sleep logs show irregular patterns.",
        severity: "warning",
        impact: 85,
        iconColor: "text-purple-500",
        icon: Moon,
        recommendations: [
          "Establish a consistent sleep schedule, even on weekends",
          "Create a relaxing pre-sleep routine to improve sleep quality",
          "Try to reduce screen time 1 hour before bed"
        ]
      },
      {
        title: "Exercise Impact",
        description: "Days with recorded exercise show a 41% improvement in mood scores, with effects lasting up to 48 hours after activity.",
        severity: "success",
        impact: 75,
        iconColor: "text-green-500",
        icon: Dumbbell,
        recommendations: [
          "Aim for at least 30 minutes of moderate exercise 3-4 times per week",
          "Schedule workouts during your typical energy dips to maximize benefits",
          "Try morning exercise for all-day mood benefits"
        ]
      }
    ]
  },
  {
    id: "risks",
    name: "Potential Risks",
    icon: TrendingDown,
    insights: [
      {
        title: "Consecutive Low Days",
        description: "You've experienced 3+ consecutive days of below-average mood scores twice in the past month, which may indicate developing patterns of low mood.",
        severity: "warning",
        impact: 60,
        iconColor: "text-orange-500",
        icon: TrendingDown,
        recommendations: [
          "Consider scheduling a check-in with a mental health professional",
          "Implement daily mood-boosting activities during these periods",
          "Track potential external factors that might be contributing"
        ]
      },
      {
        title: "Social Isolation Correlation",
        description: "Days with no recorded social interactions show a 37% decrease in mood scores, suggesting social connection is important for your wellbeing.",
        severity: "warning",
        impact: 65,
        iconColor: "text-blue-500",
        icon: Users,
        recommendations: [
          "Schedule regular social connections, even brief ones",
          "Consider joining group activities aligned with your interests",
          "Prioritize quality social interactions during challenging periods"
        ]
      }
    ]
  },
  {
    id: "opportunities",
    name: "Growth Opportunities",
    icon: Sparkles,
    insights: [
      {
        title: "Mindfulness Benefits",
        description: "Days following meditation/mindfulness practice show a 45% reduction in anxiety scores and 29% improvement in focus.",
        severity: "success",
        impact: 80,
        iconColor: "text-indigo-500",
        icon: Brain,
        recommendations: [
          "Establish a consistent daily mindfulness practice, even if brief",
          "Try guided meditation focused on anxiety reduction",
          "Consider mindful moments throughout the day, not just dedicated sessions"
        ]
      },
      {
        title: "Learning Engagement",
        description: "Journal entries mentioning learning new skills or knowledge are associated with 33% higher mood and energy scores.",
        severity: "success",
        impact: 70,
        iconColor: "text-emerald-500",
        icon: BookOpenCheck,
        recommendations: [
          "Schedule regular learning activities that interest you",
          "Try learning something new when feeling stagnant",
          "Consider both creative and intellectual learning experiences"
        ]
      }
    ]
  }
];

// Badge variants based on severity
const getSeverityVariant = (severity: string) => {
  switch(severity) {
    case "warning": return "destructive";
    case "success": return "secondary";
    case "info": return "secondary";
    default: return "outline";
  }
};

// Progress bar colors based on severity
const getProgressColor = (severity: string) => {
  switch(severity) {
    case "warning": return "bg-destructive";
    case "success": return "bg-green-500";
    case "info": return "bg-blue-500";
    default: return "";
  }
};

export function AIInsights() {
  const [activeCategory, setActiveCategory] = useState("patterns");
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Handle insight expansion
  const toggleInsightExpansion = (insightTitle: string) => {
    if (expandedInsight === insightTitle) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(insightTitle);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Wellness Insights
            </CardTitle>
            <CardDescription>
              Personalized analysis of your mental wellbeing data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Zap className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {insightCategories.map((category) => (
            <Button 
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="h-[350px] flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Brain className="h-10 w-10 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground">Analyzing your wellness data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {insightCategories.find(c => c.id === activeCategory)?.insights.map((insight, index) => (
                    <motion.div 
                      key={insight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => toggleInsightExpansion(insight.title)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start gap-3">
                            <div className={`h-9 w-9 rounded-full ${insight.iconColor} bg-opacity-10 flex items-center justify-center`}>
                              <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{insight.title}</h3>
                                <Badge variant={getSeverityVariant(insight.severity)} className="text-xs">
                                  {insight.severity === "warning" ? "Attention" : 
                                   insight.severity === "success" ? "Positive" : "Insight"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedInsight === insight.title ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </motion.div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1 text-xs">
                            <span>Impact Level</span>
                            <span className="font-medium">{insight.impact}%</span>
                          </div>
                          <Progress 
                            value={insight.impact} 
                            className={`h-1.5 ${getProgressColor(insight.severity)}`}
                          />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedInsight === insight.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-4 pb-4 border-t pt-3">
                              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                              <ul className="space-y-2">
                                {insight.recommendations.map((rec, i) => (
                                  <motion.li 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ 
                                      opacity: 1, 
                                      x: 0,
                                      transition: { delay: i * 0.1 + 0.2 }
                                    }}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <span>{rec}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
} 