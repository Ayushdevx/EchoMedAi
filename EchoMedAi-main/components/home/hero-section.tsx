"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeartPulse, Stethoscope, Smartphone, Brain } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                AI-Powered Healthcare
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Transform Your Phone Into a{" "}
              <span className="text-primary">Medical Device</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-lg"
            >
              EchoMed uses advanced AI to turn your smartphone into a powerful diagnostic tool, 
              providing real-time analysis of heart and lung sounds with clinical-grade accuracy.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/learning-center">
                  Learn More
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="pt-4 flex items-center space-x-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center">
                <HeartPulse className="mr-1 h-4 w-4 text-primary" />
                <span>99.2% Accuracy</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="mr-1 h-4 w-4 text-primary" />
                <span>Works on Any Phone</span>
              </div>
              <div className="flex items-center">
                <Brain className="mr-1 h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-md">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-2 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-background/95 p-4 backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      <span className="font-semibold">Heart Analysis</span>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-32 w-full rounded-lg bg-muted ecg-grid overflow-hidden">
                      <svg className="waveform-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        <path
                          d="M0,100 Q50,100 100,100 T200,100 T300,100 T400,20 T450,180 T500,100 T600,100 T700,100 T800,100 T900,100 T1000,100"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground mb-1">Heart Rate</div>
                        <div className="text-xl font-semibold">72 BPM</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                        <div className="text-xl font-semibold">98.7%</div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-xs text-muted-foreground mb-1">AI Assessment</div>
                      <div className="text-sm font-medium">Normal sinus rhythm detected</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-primary/20 backdrop-blur-md" />
              <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-primary/20 backdrop-blur-md" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}