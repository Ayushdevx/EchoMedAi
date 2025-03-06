"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, StopCircle, Play, Loader2, Heart, Stethoscope, 
  InfoIcon, Volume2, VolumeX, Settings, BarChart3,
  AlertTriangle, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RecordingInterface() {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded" | "analyzing" | "analyzed">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceType, setDeviceType] = useState<"stethoscope" | "microphone">("stethoscope");
  const [recordingType, setRecordingType] = useState<"heart" | "lungs">("heart");
  const [instantAnalysis, setInstantAnalysis] = useState<{ type: "normal" | "warning" | "info", message: string } | null>(null);
  const [beatRate, setBeatRate] = useState<number | null>(null);
  const animationRef = useRef<any>(null);
  
  const generateRandomBeatRate = () => {
    // Simulate heart rate changes during recording
    if (recordingType === "heart") {
      return Math.floor(Math.random() * 15) + 65; // 65-80 bpm
    } else {
      return Math.floor(Math.random() * 5) + 15; // 15-20 breaths per minute
    }
  };
  
  const startRecording = () => {
    setRecordingState("recording");
    setRecordingTime(0);
    setBeatRate(generateRandomBeatRate());
    
    // Simulate recording time progress
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          clearInterval(interval);
          setRecordingState("recorded");
          return 30;
        }
        
        // Occasionally show instant analysis during recording
        if (prev % 5 === 0 && prev > 0) {
          const analyses = [
            { type: "normal" as const, message: `${recordingType === "heart" ? "Heart" : "Breathing"} rhythm appears consistent` },
            { type: "info" as const, message: `Good recording quality detected` },
            { type: "warning" as const, message: `Try to reduce background noise` }
          ];
          setInstantAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
          // Update beat rate occasionally
          setBeatRate(generateRandomBeatRate());
          
          // Clear analysis message after 3 seconds
          setTimeout(() => {
            setInstantAnalysis(null);
          }, 3000);
        }
        
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    setRecordingState("recorded");
  };
  
  const analyzeRecording = () => {
    setRecordingState("analyzing");
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRecordingState("analyzed");
          return 100;
        }
        return prev + 2;
      });
    }, 120);
  };
  
  const resetRecording = () => {
    setRecordingState("idle");
    setRecordingTime(0);
    setProgress(0);
    setBeatRate(null);
    setInstantAnalysis(null);
  };
  
  // Animation helpers for audio visualization
  useEffect(() => {
    if (recordingState === "recording") {
      const simulateAmplitude = () => {
        const paths = document.querySelectorAll('.vital-path');
        paths.forEach(path => {
          // Add subtle animation to make the path more dynamic during recording
          const originalD = path.getAttribute('d');
          if (originalD) {
            // Slightly modify the y-values for a natural recording effect
            const newD = originalD.replace(/C(\d+),(\d+)/g, (match, x, y) => {
              const newY = parseInt(y) + (Math.random() * 10 - 5);
              return `C${x},${newY}`;
            });
            path.setAttribute('d', newD);
          }
        });
        animationRef.current = requestAnimationFrame(simulateAmplitude);
      };
      
      animationRef.current = requestAnimationFrame(simulateAmplitude);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [recordingState]);
  
  // Event handler for when View Results button is clicked
  const handleViewResults = () => {
    // In a real app, you would navigate or update the parent component
    // For now we'll just log this action
    console.log("View results clicked");
    
    // Transition back to idle state after viewing results
    resetRecording();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Record Health Sounds</CardTitle>
          <CardDescription>
            Capture {recordingType === "heart" ? "heart" : "lung"} sounds for AI analysis
          </CardDescription>
        </div>
        
        <Tabs
          value={recordingType}
          onValueChange={(value) => setRecordingType(value as "heart" | "lungs")}
          className="w-[300px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heart" className="flex items-center justify-center">
              <Heart className="h-4 w-4 mr-2" />
              Heart
            </TabsTrigger>
            <TabsTrigger value="lungs" className="flex items-center justify-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              Lungs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="h-48 rounded-lg bg-muted ecg-grid flex items-center justify-center relative overflow-hidden">
          <AnimatePresence>
            {recordingState === "idle" && (
              <motion.div
                key="idle-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center relative w-full h-full"
              >
                <div className="absolute inset-0">
                  <svg className="wave-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path
                      className="wave-path"
                      d="M0,100 
                         h60 l20,-20 l20,20 
                         h80 l20,-80 l20,160 l20,-80 
                         h80 l20,-20 l20,20 
                         h60 l20,-20 l20,20 
                         h80 l20,-80 l20,160 l20,-80 
                         h80 l20,-20 l20,20 
                         h60"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      className="wave-path"
                      d="M-500,100 
                         h60 l20,-20 l20,20 
                         h80 l20,-80 l20,160 l20,-80 
                         h80 l20,-20 l20,20 
                         h60"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.05 }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                    className="text-center"
                  >
                    <div className="text-2xl font-semibold mb-2 text-primary">Ready to Record</div>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      {recordingType === "heart" 
                        ? "Position the device on your chest between the 4th and 5th rib" 
                        : "Position the device on your back or side of chest"
                      }
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {recordingState === "recording" && (
              <motion.div
                key="recording-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center pulse-animation">
                    <div className="h-12 w-12 rounded-full bg-destructive/30 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
                        <Mic className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <svg className="vital-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <pattern id="vital-pattern" x="0" y="0" width="100" height="200" patternUnits="userSpaceOnUse">
                      <path
                        className="vital-path"
                        d="M0,100 
                           C10,100 15,100 20,100
                           C25,100 30,85 35,85
                           C40,85 45,100 50,140
                           C55,180 60,40 65,40
                           C70,40 75,100 80,100
                           C85,100 90,100 100,100"
                        vectorEffect="non-scaling-stroke"
                      />
                    </pattern>
                  </defs>
                  <rect className="vital-pattern-rect" x="0" y="0" width="100%" height="100%" fill="url(#vital-pattern)" />
                </svg>
                
                {instantAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-4 right-4 p-2 rounded-lg bg-background/90 backdrop-blur-sm shadow-sm border border-border flex items-center"
                  >
                    {instantAnalysis.type === "normal" && <CheckCircle2 className="h-4 w-4 text-success mr-2" />}
                    {instantAnalysis.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning mr-2" />}
                    {instantAnalysis.type === "info" && <InfoIcon className="h-4 w-4 text-primary mr-2" />}
                    <span className="text-xs">{instantAnalysis.message}</span>
                  </motion.div>
                )}
                
                {beatRate && (
                  <div className="absolute top-4 left-4 p-2 rounded-lg bg-background/90 backdrop-blur-sm shadow-sm border border-border">
                    <div className="flex items-center">
                      {recordingType === "heart" ? (
                        <Heart className="h-4 w-4 text-destructive mr-2 animate-pulse" />
                      ) : (
                        <Stethoscope className="h-4 w-4 text-primary mr-2 animate-pulse" />
                      )}
                      <span className="text-sm font-semibold">{beatRate} {recordingType === "heart" ? "BPM" : "br/min"}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {recordingState === "recorded" && (
              <motion.div
                key="recorded-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <svg className="vital-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <pattern id="vital-pattern-recorded" x="0" y="0" width="100" height="200" patternUnits="userSpaceOnUse">
                      <path
                        className="vital-path"
                        d="M0,100 
                           C10,100 15,100 20,100
                           C25,100 30,85 35,85
                           C40,85 45,100 50,140
                           C55,180 60,40 65,40
                           C70,40 75,100 80,100
                           C85,100 90,100 100,100"
                        vectorEffect="non-scaling-stroke"
                      />
                    </pattern>
                  </defs>
                  <rect className="vital-pattern-rect" x="0" y="0" width="100%" height="100%" fill="url(#vital-pattern)" />
                </svg>
                
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-sm flex items-center">
                  <Play className="h-3 w-3 mr-1" />
                  <span>30 seconds</span>
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="absolute bottom-4 right-4 w-32">
                  <Slider 
                    value={[volume]} 
                    min={0} 
                    max={100} 
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0]);
                      if (value[0] === 0) {
                        setIsMuted(true);
                      } else if (isMuted) {
                        setIsMuted(false);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
            
            {recordingState === "analyzing" && (
              <motion.div
                key="analyzing-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-2" />
                <p className="text-muted-foreground">Analyzing recording...</p>
                <div className="max-w-xs mx-auto mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress > 40 ? 1 : 0 }}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  {progress > 40 && progress < 75 && "Identifying acoustic patterns..."}
                  {progress >= 75 && "Generating insights..."}
                </motion.div>
              </motion.div>
            )}
            
            {recordingState === "analyzed" && (
              <motion.div
                key="analyzed-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto bg-success/20 rounded-full w-20 h-20 flex items-center justify-center mb-2"
                  >
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Analysis Complete</h3>
                  <p className="text-sm text-muted-foreground">Your recording has been successfully analyzed</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={resetRecording}>
                    Record Again
                  </Button>
                  <Button onClick={handleViewResults}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="space-y-3">
          {recordingState === "idle" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Device Type</label>
                <Select 
                  value={deviceType}
                  onValueChange={(value) => setDeviceType(value as "stethoscope" | "microphone")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stethoscope">Digital Stethoscope</SelectItem>
                    <SelectItem value="microphone">Smartphone Microphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Audio Quality</label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (20-1000Hz)</SelectItem>
                    <SelectItem value="medium">Medium (20-4000Hz)</SelectItem>
                    <SelectItem value="high">High (20-22000Hz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              {recordingState === "recording" && (
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse mr-2" />
                  <span className="text-sm font-medium">Recording: {recordingTime}s</span>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                          <InfoIcon className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Optimal recording time: 30 seconds</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              
              {recordingState === "recorded" && (
                <Badge variant="outline" className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-success" />
                  <span className="text-xs">30s {recordingType === "heart" ? "heart" : "lung"} recording</span>
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              {recordingState === "idle" && (
                <Button onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              )}
              
              {recordingState === "recording" && (
                <Button variant="destructive" onClick={stopRecording}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
              
              {recordingState === "recorded" && (
                <>
                  <Button variant="outline" onClick={resetRecording}>
                    Reset
                  </Button>
                  <Button onClick={analyzeRecording}>
                    Analyze Recording
                  </Button>
                </>
              )}
              
              {recordingState === "analyzing" && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </Button>
              )}
              
              {recordingState === "analyzed" && (
                <Button variant="outline" onClick={resetRecording}>
                  New Recording
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}