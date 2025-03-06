"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Define a type for mood values
type MoodType = 'excellent' | 'good' | 'neutral' | 'low' | 'very-low';

// Define an interface for the mood data
interface MoodData {
  date: string;
  mood: MoodType;
  activities: string[];
  notes: string;
}

// Sample mood data - in a real app this would come from your database
const moodData: MoodData[] = [
  { date: '2023-06-01', mood: 'excellent', activities: ['Exercise', 'Meditation'], notes: 'Felt great today!' },
  { date: '2023-06-02', mood: 'good', activities: ['Reading'], notes: 'Productive day' },
  { date: '2023-06-03', mood: 'neutral', activities: ['Work'], notes: 'Average day' },
  { date: '2023-06-04', mood: 'low', activities: ['Work'], notes: 'Stressed with deadlines' },
  { date: '2023-06-05', mood: 'very-low', activities: ['None'], notes: 'Feeling down' },
  { date: '2023-06-06', mood: 'low', activities: ['Walking'], notes: 'Slightly better' },
  { date: '2023-06-07', mood: 'neutral', activities: ['Friends'], notes: 'Social time helped' },
  { date: '2023-06-08', mood: 'good', activities: ['Exercise', 'Reading'], notes: 'Good balance today' },
  { date: '2023-06-09', mood: 'excellent', activities: ['Meditation', 'Family'], notes: 'Wonderful day' },
  { date: '2023-06-10', mood: 'good', activities: ['Hiking'], notes: 'Nature was refreshing' },
];

// Mood colors
const moodColors: Record<MoodType, string> = {
  "excellent": "#8b5cf6", // Purple
  "good": "#6366f1", // Indigo
  "neutral": "#3b82f6", // Blue
  "low": "#f59e0b", // Amber
  "very-low": "#ef4444", // Red
};

// Define props interface for MoodSphere
interface MoodSphereProps {
  position: [number, number, number];
  mood: MoodType;
  date: string;
  notes: string;
  scale?: number;
}

// A single mood sphere component
function MoodSphere({ position, mood, date, notes, scale = 1 }: MoodSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  // Make the sphere float and rotate slightly
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.1;
      sphereRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={position}>
      <Sphere 
        ref={sphereRef} 
        args={[scale * 0.3, 16, 16]} 
        onPointerOver={() => {
          setHovered(true);
          setTooltipVisible(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setTooltipVisible(false);
        }}
      >
        <meshStandardMaterial 
          color={moodColors[mood]} 
          emissive={moodColors[mood]}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3} 
          metalness={0.8}
        />
        
        {tooltipVisible && (
          <Html distanceFactor={10} position={[0, 0.5, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-background/90 backdrop-blur-sm border text-xs p-2 rounded-lg shadow-md w-40">
              <p className="font-medium">{new Date(date).toLocaleDateString()}</p>
              <p className="capitalize">{mood.replace('-', ' ')}</p>
              <p className="text-muted-foreground text-[10px] truncate">{notes}</p>
            </div>
          </Html>
        )}
      </Sphere>
    </group>
  );
}

export function MoodScene() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      
      <group position={[0, 0, 0]}>
        {moodData.map((data, i) => {
          // Calculate position in a spiral pattern
          const angle = i * 0.6;
          const radius = 1.5 + i * 0.1;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (i - moodData.length / 2) * 0.2;
          
          let scale = 1;
          switch(data.mood) {
            case 'excellent': scale = 1.3; break;
            case 'good': scale = 1.15; break;
            case 'neutral': scale = 1; break;
            case 'low': scale = 0.9; break;
            case 'very-low': scale = 0.8; break;
          }
          
          return (
            <MoodSphere 
              key={data.date}
              position={[x, y, z]} 
              mood={data.mood}
              date={data.date}
              notes={data.notes}
              scale={scale}
            />
          );
        })}
      </group>
      
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
} 