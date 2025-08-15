"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckSquare,
  LayoutGrid,
  MessageSquare,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:pt-32">
            <motion.div
              className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mt-24 sm:mt-32 lg:mt-16">
                <motion.div
                  className="inline-flex space-x-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-500/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
                    AI-Powered
                  </span>
                  <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">
                    <span>Task Management Reimagined</span>
                  </span>
                </motion.div>
              </div>
              <motion.h1
                className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Meet TaskFusion
                <span className="block text-blue-600 dark:text-blue-400">
                  Your AI Assistant
                </span>
              </motion.h1>
              <motion.p
                className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => (window.location.href = "/tasks")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <img
                  src="/hero.png"
                  alt="TaskFusion App Preview"
                  className="w-full max-w-4xl rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mode Preview Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
              Two Powerful Modes
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Choose Your Workflow
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
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
              <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        AI Chat Mode
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Conversational task management
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-white/80 dark:bg-gray-800/80 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            AI
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            "I've organized your tasks by priority. Would you
                            like me to schedule the client meeting for
                            tomorrow?"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            You
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
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
              <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
                      <LayoutGrid className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        UI Mode
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Visual task management
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rounded-lg bg-white/80 dark:bg-gray-800/80 p-3 shadow-sm">
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Review quarterly reports
                      </span>
                      <span className="text-xs text-gray-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                        High
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg bg-white/80 dark:bg-gray-800/80 p-3 shadow-sm">
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Client meeting preparation
                      </span>
                      <span className="text-xs text-gray-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                        Medium
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg bg-white/80 dark:bg-gray-800/80 p-3 shadow-sm">
                      <CheckSquare className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-500 dark:text-gray-400 line-through">
                        Update project timeline
                      </span>
                      <span className="text-xs text-gray-400">Done</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white/50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
              Everything You Need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
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
              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  AI-Powered Suggestions
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Get intelligent task recommendations, priority suggestions,
                    and automated scheduling based on your work patterns and
                    deadlines.
                  </p>
                </dd>
              </motion.div>

              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  Smart Organization
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Automatically categorize and organize your tasks with
                    AI-driven tagging, project grouping, and deadline
                    management.
                  </p>
                </dd>
              </motion.div>

              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  Seamless Mode Switching
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Switch instantly between AI chat mode and traditional UI
                    mode without losing context or progress on your tasks.
                  </p>
                </dd>
              </motion.div>

              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-600">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  Mobile Responsive
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Access your tasks anywhere with a fully responsive design
                    that works perfectly on desktop, tablet, and mobile devices.
                  </p>
                </dd>
              </motion.div>

              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-pink-600">
                    <CheckSquare className="h-8 w-8 text-white" />
                  </div>
                  Advanced Analytics
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Track your productivity with detailed analytics, completion
                    rates, and insights into your work patterns and habits.
                  </p>
                </dd>
              </motion.div>

              <motion.div className="flex flex-col" variants={fadeInUp}>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  Natural Language
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Create and manage tasks using natural language. Just tell
                    the AI what you need to do, and it handles the rest.
                  </p>
                </dd>
              </motion.div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 sm:top-[-30rem] sm:-ml-80 lg:left-[max(14rem,calc(100%-59rem))] lg:top-[-15rem] xl:left-[max(23rem,calc(100%-71rem))]">
          <div
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-blue-400 to-purple-300 opacity-30"
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
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Productivity?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = "/tasks")}
              >
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
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
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    TaskFusion
                  </span>
                </div>
                <p className="mt-4 text-base text-gray-300 max-w-md">
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
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Links Section */}
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Product
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Integrations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        API
                      </a>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Support
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Community
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </motion.div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Press
                      </a>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Legal
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        GDPR
                      </a>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="mt-16 border-t border-gray-800 pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p className="text-sm leading-5 text-gray-400">
                © 2024 TaskFusion. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
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
