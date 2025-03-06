"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, Sector, 
  ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Loader2, Calendar, Clock, Info, ChevronRight, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

// Mock data for mood distribution
const moodDistributionData = [
  { name: "Excellent", value: 18, color: "#8b5cf6" },
  { name: "Good", value: 45, color: "#6366f1" },
  { name: "Neutral", value: 20, color: "#3b82f6" },
  { name: "Low", value: 12, color: "#f59e0b" },
  { name: "Very Low", value: 5, color: "#ef4444" }
];

// Mock data for time of day analysis
const timeOfDayData = [
  { name: "Morning", mood: 7.8, anxiety: 3.2, energy: 6.5 },
  { name: "Afternoon", mood: 6.9, anxiety: 4.5, energy: 5.8 },
  { name: "Evening", mood: 7.2, anxiety: 3.8, energy: 6.2 },
  { name: "Night", mood: 6.5, anxiety: 4.2, energy: 5.2 }
];

// Mock data for day of week analysis
const dayOfWeekData = [
  { name: "Mon", mood: 6.8, anxiety: 4.5, color: "#3b82f6" },
  { name: "Tue", mood: 6.5, anxiety: 4.8, color: "#6366f1" },
  { name: "Wed", mood: 6.2, anxiety: 5.2, color: "#8b5cf6" },
  { name: "Thu", mood: 6.7, anxiety: 4.6, color: "#a855f7" },
  { name: "Fri", mood: 7.5, anxiety: 3.8, color: "#d946ef" },
  { name: "Sat", mood: 8.2, anxiety: 2.6, color: "#ec4899" },
  { name: "Sun", mood: 7.8, anxiety: 3.0, color: "#f43f5e" }
];

// Mock data for mood factors
const moodFactorsData = [
  { subject: 'Sleep', A: 8.2, B: 7.1, fullMark: 10, color: "#8b5cf6" },
  { subject: 'Exercise', A: 7.5, B: 6.8, fullMark: 10, color: "#6366f1" },
  { subject: 'Social', A: 6.8, B: 7.5, fullMark: 10, color: "#3b82f6" },
  { subject: 'Nutrition', A: 5.9, B: 6.2, fullMark: 10, color: "#10b981" },
  { subject: 'Work', A: 5.2, B: 4.8, fullMark: 10, color: "#f59e0b" },
  { subject: 'Relaxation', A: 6.5, B: 5.9, fullMark: 10, color: "#ec4899" },
];

// Custom active shape for pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-lg font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="currentColor" className="text-xl font-bold">
        {`${value} days`}
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="currentColor" className="text-sm">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  
  return null;
};

export function MoodPatterns() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("distribution");
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Simulating data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mood Patterns</CardTitle>
            <CardDescription>
              Discover patterns in your mood data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="distribution" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="timeofday" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time of Day
            </TabsTrigger>
            <TabsTrigger value="dayofweek" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Day of Week
            </TabsTrigger>
            <TabsTrigger value="factors" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Factors
            </TabsTrigger>
          </TabsList>
          
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {activeTab === "distribution" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={moodDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                        >
                          {moodDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  
                  {activeTab === "timeofday" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeOfDayData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="mood" name="Mood" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="anxiety" name="Anxiety" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="energy" name="Energy" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {activeTab === "dayofweek" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dayOfWeekData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="mood" name="Mood" radius={[4, 4, 0, 0]}>
                          {dayOfWeekData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                        <Bar dataKey="anxiety" name="Anxiety" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {activeTab === "factors" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={moodFactorsData}>
                        <PolarGrid stroke="var(--muted)" strokeOpacity={0.2} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={(props) => {
                            const { x, y, payload } = props;
                            // Find the corresponding color for this subject
                            const dataItem = moodFactorsData.find(item => item.subject === payload.value);
                            const color = dataItem?.color || 'var(--foreground)';
                            
                            return (
                              <g transform={`translate(${x},${y})`}>
                                <text
                                  x={0}
                                  y={0}
                                  textAnchor="middle"
                                  fill={color}
                                  fontSize={12}
                                  fontWeight={500}
                                  dy={4}
                                >
                                  {payload.value}
                                </text>
                              </g>
                            );
                          }}
                          stroke="var(--muted)"
                          tickLine={{ stroke: 'var(--muted)' }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 10]} 
                          tick={{ 
                            fill: 'var(--foreground)',
                            fontSize: 10 
                          }}
                          stroke="var(--muted)"
                          tickCount={5}
                        />
                        <Radar
                          name="Current Month"
                          dataKey="A"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.6}
                          dot={true}
                          activeDot={{ r: 5, strokeWidth: 2 }}
                        />
                        <Radar
                          name="Previous Month"
                          dataKey="B"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.3}
                          dot={true}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Tooltip 
                          content={<CustomTooltip />} 
                          wrapperStyle={{ zIndex: 100 }}
                          formatter={(value, name) => [`${value} / 10`, name]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Tabs>
        
        <div className="bg-muted/30 rounded-lg p-4 transition-all duration-300 overflow-hidden" style={{ height: detailsExpanded ? 'auto' : '5.5rem' }}>
          <div className="flex justify-between items-start cursor-pointer" onClick={() => setDetailsExpanded(!detailsExpanded)}>
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Pattern Insights</h3>
                {activeTab === "distribution" && (
                  <p className="text-sm text-muted-foreground">Your mood distribution shows that you generally maintain a positive outlook, with 63% of your recordings in the "Good" or "Excellent" range.</p>
                )}
                {activeTab === "timeofday" && (
                  <p className="text-sm text-muted-foreground">Your mood tends to peak in the morning, drop slightly in the afternoon, and recover in the evening before declining at night.</p>
                )}
                {activeTab === "dayofweek" && (
                  <p className="text-sm text-muted-foreground">Weekend days (Saturday and Sunday) consistently show higher mood ratings, while Wednesday appears to be your most challenging day.</p>
                )}
                {activeTab === "factors" && (
                  <p className="text-sm text-muted-foreground">Sleep and exercise have the strongest positive correlation with your mood, while work-related factors show the lowest impact.</p>
                )}
              </div>
            </div>
            <motion.div
              animate={{ rotate: detailsExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </div>
          
          <AnimatePresence>
            {detailsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                {activeTab === "distribution" && (
                  <>
                    <p className="text-sm">The consistent presence of "Good" moods suggests emotional stability. However, the 17% in the "Low" or "Very Low" range indicates areas for improvement.</p>
                    <p className="text-sm">Consider tracking what factors contribute to your "Excellent" days to replicate those conditions more often.</p>
                  </>
                )}
                {activeTab === "timeofday" && (
                  <>
                    <p className="text-sm">Your anxiety levels increase in the afternoon, which corresponds with the dip in mood during the same period.</p>
                    <p className="text-sm">Energy levels follow a similar pattern to mood, suggesting that managing energy through the day could help stabilize mood.</p>
                    <p className="text-sm">Consider implementing a brief afternoon relaxation routine to counter the mid-day mood and energy dip.</p>
                  </>
                )}
                {activeTab === "dayofweek" && (
                  <>
                    <p className="text-sm">The mid-week dip (Tuesday-Thursday) is a common pattern that may relate to work stress accumulation.</p>
                    <p className="text-sm">Your anxiety levels inversely correlate with mood throughout the week, peaking on Wednesday.</p>
                    <p className="text-sm">Consider scheduling more enjoyable activities mid-week to counter this pattern.</p>
                  </>
                )}
                {activeTab === "factors" && (
                  <>
                    <p className="text-sm">Sleep quality shows the strongest correlation with positive mood, followed by regular exercise.</p>
                    <p className="text-sm">Work-related factors and nutrition show lower impact scores but still affect your overall wellbeing.</p>
                    <p className="text-sm">Focus on improving the lower-scoring areas while maintaining your strengths in sleep hygiene and exercise routine.</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
} 