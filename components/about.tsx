"use client";

import React from "react";
import Link from "next/link";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Users, Star, Trophy, Target } from "lucide-react";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Tasks Fused", value: "1M+", icon: Star },
  { label: "Awards Won", value: "12", icon: Trophy },
  { label: "Focus Score", value: "98%", icon: Target },
];

export const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Task Fusion was born out of the frustration of managing fragmented
              workflows. We believe that technology should work for you, not the
              other way around.
            </p>
            <p className="text-lg text-muted-foreground">
              Our AI-first approach ensures that you spend less time organizing
              and more time creating. We're on a mission to reclaim 1 billion
              hours of human potential by 2030.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border bg-muted/50 text-center hover:border-primary/50 transition-colors group"
              >
                <stat.icon className="size-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-primary to-primary/80 dark:from-muted dark:to-muted/50 p-8 md:p-16 text-primary-foreground dark:text-foreground text-center relative overflow-hidden group border dark:border-border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mt-[-50px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto text-primary-foreground/90 dark:text-muted-foreground">
              Join thousands of individuals and teams already using Task Fusion
              to power their productivity and reclaim their time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tasks">
                <button className="w-full bg-white dark:bg-primary text-primary dark:text-primary-foreground hover:bg-white/90 dark:hover:bg-primary/90 px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-white/20 dark:hover:shadow-primary/20">
                  Get Started Now
                </button>
              </Link>
              <Link href="/tasks">
                <button className="w-full bg-primary-foreground/10 dark:bg-transparent hover:bg-primary-foreground/20 dark:hover:bg-muted border border-primary-foreground/20 dark:border-border px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm">
                  View Documentation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
