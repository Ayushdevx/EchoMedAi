"use client";

import { useState } from 'react';
import { AnalysisHeader } from '@/components/analysis/analysis-header';
import { RecordingInterface } from '@/components/analysis/recording-interface';
import { AIProcessingVisualizer } from '@/components/analysis/ai-processing-visualizer';
import { ResultsDisplay } from '@/components/analysis/results-display';
import { RecommendationsPanel } from '@/components/analysis/recommendations-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Stethoscope } from "lucide-react";

export default function AnalysisPage() {
  const [recordingType, setRecordingType] = useState<"heart" | "lungs">("heart");
  const [showResults, setShowResults] = useState(false);
  
  // This function will be passed to the RecordingInterface component
  // to handle when analysis is complete
  const handleAnalysisComplete = () => {
    setShowResults(true);
  };
  
  // Reset the analysis and go back to recording
  const handleNewRecording = () => {
    setShowResults(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisHeader />
      
      <Tabs 
        value={recordingType} 
        onValueChange={(value) => setRecordingType(value as "heart" | "lungs")}
        className="mt-6"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="heart" className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" />
              Heart Sounds
            </TabsTrigger>
            <TabsTrigger value="lungs" className="flex items-center justify-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Lung Sounds
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="space-y-8">
          {!showResults ? (
            <>
              <RecordingInterface />
              <AIProcessingVisualizer />
            </>
          ) : null}
        </div>
        <div className="space-y-8">
          {showResults ? (
            <>
              <ResultsDisplay />
              <RecommendationsPanel />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}