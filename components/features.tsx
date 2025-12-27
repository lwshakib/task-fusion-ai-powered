"use client";

import React from "react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";
import { Brain, Zap, Layers, MessageSquare, Shield, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "AI Task Decomposition",
    description:
      "Give our AI a goal, and watch it break it down into actionable, manageable tasks in seconds.",
    icon: Brain,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Smart Context Fusion",
    description:
      "Seamlessly merge tasks from your email, calendar, and Slack into one unified, intelligent workspace.",
    icon: Layers,
    color: "from-purple-500 to-pink-400",
  },
  {
    title: "Real-time Agent Chat",
    description:
      "Interact with your task manager using natural language. No more complex menus or forms.",
    icon: MessageSquare,
    color: "from-orange-500 to-yellow-400",
  },
  {
    title: "Instant Prioritization",
    description:
      "Our AI analyzes deadlines, importance, and your energy levels to suggest the best next step.",
    icon: Zap,
    color: "from-green-500 to-emerald-400",
  },
  {
    title: "Enterprise Security",
    description:
      "Your data is encrypted and handled with the highest standards of privacy and security protocols.",
    icon: Shield,
    color: "from-red-500 to-orange-400",
  },
  {
    title: "Global Sync",
    description:
      "Access your intelligent workspace from any device, anywhere in the world, perfectly synced.",
    icon: Globe,
    color: "from-indigo-500 to-blue-400",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 px-4">
          <TextEffect
            preset="fade-in-blur"
            as="h2"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Engineered for Excellence
          </TextEffect>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", bounce: 0.3 },
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden border-t-2 border-t-transparent hover:border-t-primary/50"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/5`}
                >
                  <feature.icon className="text-white size-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base line-clamp-3 group-hover:text-foreground transition-colors">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
};
