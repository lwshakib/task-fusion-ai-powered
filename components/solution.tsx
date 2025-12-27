"use client";

import React from "react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { CheckCircle2, Terminal, Cpu, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Define Your Objective",
    description:
      "Simply tell the AI what you want to achieve. No rigid structures required.",
    icon: Terminal,
  },
  {
    title: "AI Synthesis",
    description:
      "Our agents analyze your redundant tasks and merge them into a streamlined workflow.",
    icon: Cpu,
  },
  {
    title: "Optimized Action Plan",
    description:
      "Receive a prioritized list of tasks designed to maximize impact and efficiency.",
    icon: Sparkles,
  },
  {
    title: "Seamless Execution",
    description:
      "Track progress in real-time with automated updates and smart reminders.",
    icon: CheckCircle2,
  },
];

export const SolutionSection = () => {
  return (
    <section className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <TextEffect
              preset="fade-in-blur"
              as="h2"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              The Fusion Solution
            </TextEffect>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <step.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full scale-75" />
            <div className="bg-background border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/2 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-12 w-full bg-primary/5 border border-primary/10 rounded-xl flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded border border-primary/30" />
                    <div className="h-3 w-3/4 bg-primary/10 rounded-full" />
                  </div>
                  <div className="h-12 w-full bg-muted/20 border border-border rounded-xl flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded border border-border" />
                    <div className="h-3 w-1/2 bg-muted/40 rounded-full" />
                  </div>
                  <div className="h-12 w-full bg-muted/20 border border-border rounded-xl flex items-center px-4 gap-3 opacity-50">
                    <div className="w-4 h-4 rounded border border-border" />
                    <div className="h-3 w-2/3 bg-muted/40 rounded-full" />
                  </div>
                </div>
                <div className="pt-4 border-t border-dashed">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-3 w-1/4 bg-muted/60 rounded-full" />
                    <div className="h-6 w-20 bg-primary/20 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-muted/30 rounded-2xl border" />
                    <div className="h-20 bg-muted/30 rounded-2xl border" />
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <div className="absolute bottom-12 right-12 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl shadow-primary/20 flex items-center gap-2 animate-bounce">
                <Sparkles className="size-3" />
                AI Optimized
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
