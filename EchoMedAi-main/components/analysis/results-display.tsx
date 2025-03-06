"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Download, Share, AlertTriangle, CheckCircle2, Info, Play, Pause,
  FileText, Upload, Heart, Stethoscope, ArrowRight, Volume2, Calendar,
  ChevronDown, ChevronUp, Printer, Bookmark, BookmarkPlus, Clock,
  ListFilter
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart, BarChart, Bar
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type Finding = {
  id: number;
  type: "normal" | "warning" | "info";
  title: string;
  description: string;
  icon: any; // Using any for simplicity, ideally would be more specific
  iconColor: string;
  details: string;
};

export function ResultsDisplay({ recordingType = "heart" }) {
  const [activeTab, setActiveTab] = useState("waveform");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["primary", "key-findings"]);
  const [selectedFinding, setSelectedFinding] = useState<number | null>(null);
  
  // Simulated data for heart or lung analysis
  const analysisResults = recordingType === "heart" ? {
    recordingDetails: {
      date: new Date().toISOString(),
      duration: "30 seconds",
      type: "heart",
      quality: "High (20-22000Hz)",
      device: "Digital Stethoscope"
    },
    primaryCondition: {
      name: "Normal Sinus Rhythm",
      confidence: 92,
      status: "normal",
    },
    vitalSigns: {
      heartRate: 72,
      heartRateVariability: 35,
      respiration: 16,
      s1Intensity: 0.8,
      s2Intensity: 0.7
    },
    confidenceScores: [
      { name: "Normal Sinus Rhythm", value: 92 },
      { name: "Sinus Tachycardia", value: 5 },
      { name: "Sinus Bradycardia", value: 2 },
      { name: "Other", value: 1 },
    ],
    keyFindings: [
      {
        id: 1,
        type: "normal",
        title: "Regular Rhythm",
        description: "Heart rhythm is regular with consistent intervals between beats.",
        icon: CheckCircle2,
        iconColor: "text-success",
        details: "The recording shows consistent R-R intervals of 830±25ms, indicating a regular sinus rhythm. No premature beats or pauses were detected."
      },
      {
        id: 2,
        type: "info",
        title: "Heart Rate",
        description: "Heart rate is 72 BPM, which falls within the normal range for adults.",
        icon: Info,
        iconColor: "text-primary",
        details: "The average heart rate over the 30-second recording was 72 BPM (range: 70-74 BPM). This is within the normal range of 60-100 BPM for adults at rest."
      },
      {
        id: 3,
        type: "warning",
        title: "Slight S1 Variation",
        description: "Minor variation in S1 intensity detected, likely due to respiratory influence.",
        icon: AlertTriangle,
        iconColor: "text-warning",
        details: "S1 intensity varies by approximately 15% throughout the recording, which may be attributed to normal respiratory variation. This is not typically clinically significant but could warrant further monitoring if symptoms are present."
      },
    ],
    timeSeries: Array(30).fill(0).map((_, i) => ({
      time: i,
      amplitude: 100 + 20 * Math.sin(i * 0.5) + 50 * Math.sin(i * 0.1) + (Math.random() * 10)
    })),
    frequencyData: [
      { frequency: "20-40Hz", power: 25 },
      { frequency: "40-60Hz", power: 45 },
      { frequency: "60-100Hz", power: 85 },
      { frequency: "100-200Hz", power: 65 },
      { frequency: "200-400Hz", power: 35 },
      { frequency: "400-600Hz", power: 20 },
    ],
    heartCycle: [
      { phase: "S1", value: 80 },
      { phase: "Systole", value: 30 },
      { phase: "S2", value: 60 },
      { phase: "Diastole", value: 40 },
    ]
  } : {
    recordingDetails: {
      date: new Date().toISOString(),
      duration: "30 seconds",
      type: "lungs",
      quality: "High (20-22000Hz)",
      device: "Digital Stethoscope"
    },
    primaryCondition: {
      name: "Normal Breath Sounds",
      confidence: 94,
      status: "normal",
    },
    vitalSigns: {
      respirationRate: 16,
      inspirationDuration: 1.2,
      expirationDuration: 2.4,
      i_e_ratio: 0.5
    },
    confidenceScores: [
      { name: "Normal Breath Sounds", value: 94 },
      { name: "Mild Wheezing", value: 3 },
      { name: "Crackles", value: 2 },
      { name: "Other", value: 1 },
    ],
    keyFindings: [
      {
        id: 1,
        type: "normal",
        title: "Clear Lung Fields",
        description: "Breath sounds are clear throughout all lung fields.",
        icon: CheckCircle2,
        iconColor: "text-success",
        details: "All lung fields demonstrate clear vesicular breath sounds with no adventitious sounds detected. Air entry is equal bilaterally with good amplitude."
      },
      {
        id: 2,
        type: "info",
        title: "Respiration Rate",
        description: "Respiration rate is 16 breaths per minute, within normal range.",
        icon: Info,
        iconColor: "text-primary",
        details: "The measured respiration rate of 16 breaths per minute is within the normal range of 12-20 breaths per minute for adults at rest."
      },
      {
        id: 3,
        type: "info",
        title: "I:E Ratio",
        description: "Normal I:E ratio of 1:2 observed throughout the recording.",
        icon: Info,
        iconColor: "text-primary",
        details: "The inspiration to expiration ratio (I:E ratio) is approximately 1:2, which is within normal limits. Inspiration lasts 1.2 seconds and expiration 2.4 seconds on average."
      },
    ],
    timeSeries: Array(30).fill(0).map((_, i) => ({
      time: i,
      amplitude: 100 + 60 * Math.sin(i * 0.2) + (Math.random() * 10)
    })),
    frequencyData: [
      { frequency: "100-200Hz", power: 75 },
      { frequency: "200-400Hz", power: 85 },
      { frequency: "400-600Hz", power: 55 },
      { frequency: "600-800Hz", power: 35 },
      { frequency: "800-1000Hz", power: 15 },
      { frequency: "1000-1200Hz", power: 5 },
    ],
    respiratoryCycle: [
      { phase: "Inspiration", value: 65 },
      { phase: "Expiration", value: 35 },
    ]
  };
  
  const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];
  
  // Simulate playback of recording
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackPosition(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);
  
  // Toggles expanded section visibility
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fix for the i_e_ratio check
  const ieRatio = recordingType === "lungs" && 
    analysisResults.vitalSigns.i_e_ratio !== undefined ? 
    Math.round(1/analysisResults.vitalSigns.i_e_ratio) : 2;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered assessment of your {analysisResults.recordingDetails.type} recording
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setSavedToLibrary(!savedToLibrary)}>
                    {savedToLibrary ? (
                      <Bookmark className="h-4 w-4 text-primary" />
                    ) : (
                      <BookmarkPlus className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{savedToLibrary ? 'Saved to library' : 'Save to library'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Export recording</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(analysisResults.recordingDetails.date)}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            {recordingType === "heart" ? (
              <Heart className="h-3 w-3 text-destructive" />
            ) : (
              <Stethoscope className="h-3 w-3 text-primary" />
            )}
            <span>{analysisResults.recordingDetails.duration} recording</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <Accordion 
          type="multiple" 
          value={expandedSections}
          className="w-full"
        >
          <AccordionItem value="primary">
            <AccordionTrigger>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Primary Assessment</h3>
                {expandedSections.includes("primary") ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mt-2 p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {analysisResults.primaryCondition.status === "normal" ? (
                        <CheckCircle2 className="h-5 w-5 text-success mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                      )}
                      <span className="font-medium">{analysisResults.primaryCondition.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analysisResults.primaryCondition.confidence}% confidence
                    </span>
                  </div>
                  <Progress 
                    value={analysisResults.primaryCondition.confidence} 
                    className={`h-2 ${analysisResults.primaryCondition.status === "normal" ? "bg-success/20" : "bg-warning/20"}`}
                  />
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {recordingType === "heart" ? (
                        <>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">Heart Rate</span>
                            <span className="text-xl font-bold text-primary">{analysisResults.vitalSigns.heartRate}</span>
                            <span className="text-xs text-muted-foreground">BPM</span>
                          </div>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">HRV</span>
                            <span className="text-xl font-bold text-primary">{analysisResults.vitalSigns.heartRateVariability}</span>
                            <span className="text-xs text-muted-foreground">ms</span>
                          </div>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">Respiration</span>
                            <span className="text-xl font-bold text-primary">{analysisResults.vitalSigns.respiration}</span>
                            <span className="text-xs text-muted-foreground">br/min</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">Respiration Rate</span>
                            <span className="text-xl font-bold text-primary">{analysisResults.vitalSigns.respirationRate}</span>
                            <span className="text-xs text-muted-foreground">br/min</span>
                          </div>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">I:E Ratio</span>
                            <span className="text-xl font-bold text-primary">1:{ieRatio}</span>
                          </div>
                          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                            <span className="text-sm text-muted-foreground">Insp. Duration</span>
                            <span className="text-xl font-bold text-primary">{analysisResults.vitalSigns.inspirationDuration}</span>
                            <span className="text-xs text-muted-foreground">sec</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="key-findings">
            <AccordionTrigger>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Key Findings</h3>
                {expandedSections.includes("key-findings") ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 space-y-3"
              >
                {analysisResults.keyFindings.map((finding, index) => (
                  <div 
                    key={finding.id} 
                    className={`p-3 rounded-lg bg-muted border border-border transition-all duration-200 ${selectedFinding === finding.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedFinding(selectedFinding === finding.id ? null : finding.id)}
                  >
                    <div className="flex items-start gap-3">
                      <finding.icon className={`h-5 w-5 ${finding.iconColor} mt-0.5`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{finding.title}</h4>
                        <p className="text-sm text-muted-foreground">{finding.description}</p>
                        
                        <AnimatePresence>
                          {selectedFinding === finding.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 pt-2 border-t text-sm"
                            >
                              <p>{finding.details}</p>
                              <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                                Jump to relevant section in recording
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFinding(selectedFinding === finding.id ? null : finding.id);
                        }}
                      >
                        {selectedFinding === finding.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="confidence">
            <AccordionTrigger>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Confidence Analysis</h3>
                {expandedSections.includes("confidence") ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-64 mt-2"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysisResults.confidenceScores}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1000}
                      animationBegin={200}
                    >
                      {analysisResults.confidenceScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, "Confidence"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="relative mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
            <span>Recording Analysis</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <ListFilter className="h-4 w-4 mr-1" />
                {showAdvanced ? "Simple View" : "Advanced View"}
              </Button>
            </div>
          </h3>
          
          <Tabs 
            defaultValue="waveform" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="waveform">Waveform</TabsTrigger>
              <TabsTrigger value="spectrogram">Frequency</TabsTrigger>
              <TabsTrigger value="cycle">
                {recordingType === "heart" ? "Heart Cycle" : "Respiratory Cycle"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="waveform" className="mt-4">
              <div className="h-48 rounded-lg bg-muted ecg-grid overflow-hidden border border-border">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full relative"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analysisResults.timeSeries}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAmplitude" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="amplitude"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAmplitude)"
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                      {showAdvanced && (
                        <>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                          <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground)/0.5)" />
                          <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground)/0.5)" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              borderColor: "hsl(var(--border))",
                              borderRadius: "var(--radius)",
                            }}
                            formatter={(value) => [`${value}`, "Amplitude"]}
                            labelFormatter={(value) => `Time: ${value}s`}
                          />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Playback position indicator */}
                  {isPlaying && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary/70 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                      style={{ 
                        left: `${playbackPosition}%`,
                        zIndex: 10 
                      }}
                    />
                  )}
                  
                  {/* Annotations for significant features */}
                  {showAdvanced && (
                    <>
                      <div className="absolute top-10 left-[35%] bg-primary/20 text-primary text-xs py-0.5 px-1 rounded-sm border border-primary/30">
                        S1
                      </div>
                      <div className="absolute top-20 left-[60%] bg-primary/20 text-primary text-xs py-0.5 px-1 rounded-sm border border-primary/30">
                        S2
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
              
              {/* Playback controls */}
              <div className="mt-2">
                <Slider 
                  value={[playbackPosition]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => {
                    setPlaybackPosition(value[0]);
                    setIsPlaying(false);
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0s</span>
                  <span>{Math.round(playbackPosition * 0.3)}s</span>
                  <span>30s</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="spectrogram" className="mt-4">
              <div className="h-48 rounded-lg bg-muted overflow-hidden border border-border">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analysisResults.frequencyData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                      <XAxis 
                        dataKey="frequency" 
                        angle={-45} 
                        textAnchor="end" 
                        height={50} 
                        tick={{ fontSize: 10 }}
                        stroke="hsl(var(--muted-foreground)/0.5)"
                      />
                      <YAxis 
                        label={{ 
                          value: "Power", 
                          angle: -90, 
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))", fontSize: 12 }
                        }} 
                        tick={{ fontSize: 10 }}
                        stroke="hsl(var(--muted-foreground)/0.5)"
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value) => [`${value}`, "Power"]}
                      />
                      <Bar 
                        dataKey="power" 
                        fill="hsl(var(--primary))" 
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
              {showAdvanced && (
                <div className="mt-4 text-sm">
                  <h4 className="font-medium mb-2">Frequency Band Analysis</h4>
                  <p className="text-muted-foreground text-sm">
                    {recordingType === "heart" 
                      ? "Heart sounds are primarily concentrated in the 60-100Hz band, which is consistent with normal S1 and S2 sounds. The frequency distribution shows a clean pattern without anomalous peaks in other ranges."
                      : "Lung sounds show normal distribution with peak intensity in the 200-400Hz range, consistent with vesicular breath sounds. No abnormal high-frequency components were detected that would indicate wheezing or crackles."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cycle" className="mt-4">
              <div className="h-48 rounded-lg bg-muted overflow-hidden border border-border">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recordingType === "heart" ? 
                          (analysisResults.heartCycle || []) : 
                          (analysisResults.respiratoryCycle || [])
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                        animationDuration={1500}
                        animationBegin={300}
                      >
                        {(recordingType === "heart" ? 
                          (analysisResults.heartCycle || []) : 
                          (analysisResults.respiratoryCycle || [])
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 70}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
              {showAdvanced && (
                <div className="mt-4 text-sm">
                  <h4 className="font-medium mb-2">{recordingType === "heart" ? "Cardiac" : "Respiratory"} Cycle Analysis</h4>
                  <p className="text-muted-foreground text-sm">
                    {recordingType === "heart" 
                      ? "The cardiac cycle shows normal distribution of phases. S1 and S2 sounds have appropriate relative intensities. Systole represents 30% of the cardiac cycle while diastole represents 40%, which is within normal parameters."
                      : "The respiratory cycle shows a normal inspiration to expiration ratio of approximately 1:2. Inspiration represents about 35% of the total respiratory cycle, while expiration accounts for about 65%, which is physiologically normal."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {showAdvanced && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="text-md font-medium mb-2">Technical Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Recording Type</span>
                <p className="font-medium">{analysisResults.recordingDetails.type} Sounds</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration</span>
                <p className="font-medium">{analysisResults.recordingDetails.duration}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Device</span>
                <p className="font-medium">{analysisResults.recordingDetails.device}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Quality</span>
                <p className="font-medium">{analysisResults.recordingDetails.quality}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-muted-foreground text-sm">Analysis Confidence</span>
              <div className="flex items-center mt-1">
                <Progress value={analysisResults.primaryCondition.confidence} className="h-2 flex-1 mr-2" />
                <span className="text-sm font-medium">{analysisResults.primaryCondition.confidence}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t p-4 gap-2">
        <div className="text-sm text-muted-foreground">
          <p>Analysis completed on {formatDate(analysisResults.recordingDetails.date)}</p>
        </div>
        
        <Button className="w-full sm:w-auto">
          <ArrowRight className="mr-2 h-4 w-4" />
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  );
}