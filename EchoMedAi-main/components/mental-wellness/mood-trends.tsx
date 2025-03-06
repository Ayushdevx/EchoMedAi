"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Mock data for mood trends over time
const generateMockData = () => {
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  return last30Days.map((date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Make mood somewhat predictable but with randomness
    // Weekends are typically better, mid-week has more variance
    let baseMood = 7;
    if (dayOfWeek === 0 || dayOfWeek === 6) baseMood = 8; // Weekends
    if (dayOfWeek === 2 || dayOfWeek === 3) baseMood = 6; // Tues/Wed
    
    // Add randomness
    const mood = Math.max(1, Math.min(10, baseMood + (Math.random() * 4 - 2)));
    const anxiety = Math.max(1, Math.min(10, 11 - mood + (Math.random() * 2 - 1)));
    const energy = Math.max(1, Math.min(10, mood - 0.5 + (Math.random() * 3 - 1.5)));
    const sleep = Math.max(1, Math.min(10, 6 + (Math.random() * 4 - 2)));
    
    return {
      date: date.toISOString().split('T')[0],
      formattedDate: `${date.getDate()}/${date.getMonth() + 1}`,
      mood: parseFloat(mood.toFixed(1)),
      anxiety: parseFloat(anxiety.toFixed(1)),
      energy: parseFloat(energy.toFixed(1)),
      sleep: parseFloat(sleep.toFixed(1)),
      focus: parseFloat((mood * 0.7 + energy * 0.3).toFixed(1)),
      weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
    };
  });
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{`${data.weekday}, ${data.date}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  
  return null;
};

// Custom animated dot for charts
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  return (
    <motion.circle 
      cx={cx} 
      cy={cy} 
      r={4}
      stroke={props.stroke}
      strokeWidth={2}
      fill="var(--background)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }}
    />
  );
};

export function MoodTrends() {
  const [timeframe, setTimeframe] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [activeMetric, setActiveMetric] = useState("mood");
  
  // Simulating data loading
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 800);
  }, [timeframe]);
  
  // Generate color scales based on metric
  const getGradientColors = (metric: string) => {
    switch(metric) {
      case 'mood':
        return ["#3b82f6", "#6366f1", "#8b5cf6"];
      case 'anxiety':
        return ["#ef4444", "#f97316", "#f59e0b"];
      case 'sleep':
        return ["#8b5cf6", "#6366f1", "#3b82f6"];
      case 'energy':
        return ["#10b981", "#34d399", "#6ee7b7"];
      case 'focus':
        return ["#6366f1", "#8b5cf6", "#a855f7"];
      default:
        return ["#3b82f6", "#6366f1", "#8b5cf6"];
    }
  };
  
  // Get label based on metric
  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      mood: "Mood Rating",
      anxiety: "Anxiety Level",
      sleep: "Sleep Quality",
      energy: "Energy Level",
      focus: "Focus Level"
    };
    return labels[metric] || metric;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Wellness Trends</CardTitle>
            <CardDescription>
              Track your wellness metrics over time
            </CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="mood" value={activeMetric} onValueChange={setActiveMetric}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
          </TabsList>
          
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={activeMetric}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getGradientColors(activeMetric)[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={getGradientColors(activeMetric)[2]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="formattedDate" 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value, index) => {
                        // Show fewer ticks on mobile
                        return index % 5 === 0 ? value : '';
                      }}
                    />
                    <YAxis 
                      domain={[1, 10]} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickCount={5}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke={getGradientColors(activeMetric)[0]}
                      strokeWidth={3}
                      fill={`url(#gradient-${activeMetric})`}
                      activeDot={(props) => <CustomDot {...props} />}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground mb-2">About {getMetricLabel(activeMetric)}</h4>
            {activeMetric === 'mood' && (
              <p>Your mood patterns show natural fluctuations throughout the week with peaks on weekends. Try to identify activities that positively impact your mood.</p>
            )}
            {activeMetric === 'anxiety' && (
              <p>Anxiety levels tend to be higher mid-week. Consider implementing stress-reduction techniques on these days to improve overall well-being.</p>
            )}
            {activeMetric === 'sleep' && (
              <p>Your sleep quality varies significantly. Establishing a consistent bedtime routine could help stabilize your sleep patterns.</p>
            )}
            {activeMetric === 'energy' && (
              <p>Energy levels closely follow your sleep patterns. Focus on improving sleep quality to maintain consistent energy throughout the week.</p>
            )}
            {activeMetric === 'focus' && (
              <p>Focus tends to decline when mood and energy are lower. Consider scheduling important tasks during your peak focus periods.</p>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
} 