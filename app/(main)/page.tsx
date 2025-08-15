"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckSquare,
  Clock,
  Github,
  LayoutGrid,
  Linkedin,
  Mail,
  MessageSquare,
  Play,
  Smartphone,
  Sparkles,
  Star,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header with Mode Toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative h-8 w-8">
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/dark_logo.svg"
                    : "/light_logo.svg"
                }
                alt="TaskFusion Logo"
                width={32}
                height={32}
                className="transition-opacity duration-200"
                priority
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              TaskFusion
            </span>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:pt-32">
            <motion.div
              className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
              {...slideInLeft}
            >
              <div className="mt-24 sm:mt-32 lg:mt-16">
                <motion.div
                  className="inline-flex items-center space-x-4"
                  {...scaleIn}
                  transition={{ delay: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Task Management Reimagined</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.h1
                className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Meet TaskFusion
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Your AI Assistant
                </span>
              </motion.h1>

              <motion.p
                className="mt-6 text-lg leading-8 text-muted-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Experience the future of task management with AI-powered
                suggestions, intelligent organization, and seamless switching
                between chat and visual modes. Get more done with less effort.
              </motion.p>

              <motion.div
                className="mt-10 flex items-center gap-x-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => (window.location.href = "/tasks")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-accent transition-all duration-300"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          Interactive Demo
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          See TaskFusion in action with our interactive demo.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-12 flex items-center space-x-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    10K+ Users
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    1M+ Tasks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">24/7 AI</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
              {...slideInRight}
              transition={{ delay: 0.4 }}
            >
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-30" />
                  <img
                    src="/hero.png"
                    alt="TaskFusion App Preview"
                    className="relative w-full max-w-4xl rounded-2xl shadow-2xl ring-1 ring-border/50"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mode Preview Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
            <Badge variant="outline" className="mb-4">
              Two Powerful Modes
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Choose Your Workflow
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Switch seamlessly between AI chat assistance and traditional task
              management interface
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        AI Chat Mode
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Conversational task management
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-card/80 p-4 shadow-sm border">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-semibold">
                            AI
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            "I've organized your tasks by priority. Would you
                            like me to schedule the client meeting for
                            tomorrow?"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-muted-foreground flex items-center justify-center">
                          <span className="text-background text-sm font-semibold">
                            You
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            "Yes, and remind me to prepare the presentation
                            slides"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:scale-110 transition-transform duration-300">
                      <LayoutGrid className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        UI Mode
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Visual task management
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rounded-lg bg-card/80 p-3 shadow-sm border">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        Review quarterly reports
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        High
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg bg-card/80 p-3 shadow-sm border">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        Client meeting preparation
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1 text-sm text-muted-foreground line-through">
                        Update project timeline
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Done
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
            <Badge variant="outline" className="mb-4">
              Everything You Need
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Advanced AI capabilities combined with intuitive design for
              maximum productivity
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Suggestions",
                  description:
                    "Get intelligent task recommendations, priority suggestions, and automated scheduling based on your work patterns and deadlines.",
                  color: "bg-primary",
                },
                {
                  icon: Sparkles,
                  title: "Smart Organization",
                  description:
                    "Automatically categorize and organize your tasks with AI-driven tagging, project grouping, and deadline management.",
                  color: "bg-secondary",
                },
                {
                  icon: Zap,
                  title: "Seamless Mode Switching",
                  description:
                    "Switch instantly between AI chat mode and traditional UI mode without losing context or progress on your tasks.",
                  color: "bg-purple-500",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Responsive",
                  description:
                    "Access your tasks anywhere with a fully responsive design that works perfectly on desktop, tablet, and mobile devices.",
                  color: "bg-orange-500",
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics",
                  description:
                    "Track your productivity with detailed analytics, completion rates, and insights into your work patterns and habits.",
                  color: "bg-pink-500",
                },
                {
                  icon: MessageSquare,
                  title: "Natural Language",
                  description:
                    "Create and manage tasks using natural language. Just tell the AI what you need to do, and it handles the rest.",
                  color: "bg-indigo-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col group"
                  variants={fadeInUp}
                >
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: Users, value: "10K+", label: "Active Users" },
              { icon: CheckSquare, value: "1M+", label: "Tasks Completed" },
              { icon: Clock, value: "99.9%", label: "Uptime" },
              { icon: Star, value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-primary py-24 sm:py-32">
        <div className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 sm:top-[-30rem] sm:-ml-80 lg:left-[max(14rem,calc(100%-59rem))] lg:top-[-15rem] xl:left-[max(23rem,calc(100%-71rem))]">
          <div
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Transform Your Productivity?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
              Join thousands of users who have revolutionized their task
              management with AI-powered assistance.
            </p>
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = "/tasks")}
              >
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Brand Section */}
            <div className="space-y-8 xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    TaskFusion
                  </span>
                </div>
                <p className="mt-4 text-base text-muted-foreground max-w-md">
                  Revolutionizing task management with AI-powered assistance.
                  Get more done with intelligent organization and seamless
                  workflows.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex space-x-6"
              >
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "#", label: "Email" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">{social.label}</span>
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Links Section */}
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                {[
                  {
                    title: "Product",
                    links: ["Features", "Pricing", "Integrations", "API"],
                  },
                  {
                    title: "Support",
                    links: [
                      "Documentation",
                      "Help Center",
                      "Community",
                      "Contact Us",
                    ],
                  },
                ].map((section, sectionIndex) => (
                  <motion.div
                    key={sectionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + sectionIndex * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-sm font-semibold leading-6 text-foreground">
                      {section.title}
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href="#"
                            className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8">
                {[
                  {
                    title: "Company",
                    links: ["About", "Blog", "Careers", "Press"],
                  },
                  {
                    title: "Legal",
                    links: [
                      "Privacy Policy",
                      "Terms of Service",
                      "Cookie Policy",
                      "GDPR",
                    ],
                  },
                ].map((section, sectionIndex) => (
                  <motion.div
                    key={sectionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + sectionIndex * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-sm font-semibold leading-6 text-foreground">
                      {section.title}
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href="#"
                            className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mt-16" />

          {/* Bottom Section */}
          <motion.div
            className="mt-8 pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p className="text-sm leading-5 text-muted-foreground">
                © 2024 TaskFusion. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>Made with ❤️ for productivity</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
