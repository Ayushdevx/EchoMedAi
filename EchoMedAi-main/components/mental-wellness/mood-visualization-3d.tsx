"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Camera } from "lucide-react";
import dynamic from "next/dynamic";

// Mood colors
const moodColors = {
  "excellent": "#8b5cf6", // Purple
  "good": "#6366f1", // Indigo
  "neutral": "#3b82f6", // Blue
  "low": "#f59e0b", // Amber
  "very-low": "#ef4444", // Red
};

// Dynamically import Three.js components with no SSR
const DynamicCanvas = dynamic(
  () => import('@react-three/fiber').then(mod => mod.Canvas),
  { ssr: false }
);

const DynamicMoodScene = dynamic(
  () => import('./mood-visualization-scene').then(mod => mod.MoodScene),
  { ssr: false }
);

export function MoodVisualization3D() {
  const [isLoading, setIsLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted on client side only
  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setRegenerating(false);
    }, 800);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>3D Mood Visualization</CardTitle>
            <CardDescription>
              Interactive visualization of your mood patterns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleRegenerate}
              disabled={isLoading || regenerating || !mounted}
            >
              {regenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              {regenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-background/80 to-muted/30 relative">
          {!mounted || isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Preparing 3D visualization...</p>
            </div>
          ) : (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full relative"
            >
              <DynamicCanvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <DynamicMoodScene />
              </DynamicCanvas>
              
              <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-background/80 backdrop-blur-sm p-2 rounded-lg border text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors.excellent }} />
                  <span>Excellent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors.good }} />
                  <span>Good</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors.neutral }} />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors.low }} />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors["very-low"] }} />
                  <span>Very Low</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border text-xs flex items-center gap-1">
                <Camera className="h-3 w-3" />
                <span>Drag to rotate | Hover to inspect</span>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 