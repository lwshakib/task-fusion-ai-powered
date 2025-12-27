import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with You
          </h1>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card className="flex flex-col border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-medium text-xl">Standard</CardTitle>
              <span className="my-3 block text-3xl font-bold">
                $0
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </span>
              <CardDescription className="text-sm">
                For individuals getting started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "100 AI Task Syntheses",
                  "Basic Agent Chat",
                  "Single Device Sync",
                  "Community Support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/tasks">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative border-primary/50 shadow-xl shadow-primary/5 bg-background scale-105 z-10">
            <span className="bg-linear-to-br from-primary to-primary/80 absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground ring-1 ring-inset ring-white/20">
              Most Popular
            </span>

            <div className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="font-medium text-xl">Pro</CardTitle>
                <span className="my-3 block text-3xl font-bold">
                  $19
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </span>
                <CardDescription className="text-sm">
                  For high-performance professionals
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Unlimited AI Task Synthesis",
                    "Advanced Context Fusion (Email/Slack)",
                    "Priority Agent Response",
                    "Multi-device Real-time Sync",
                    "Smart Energy-based Priority",
                    "Custom AI Prompting",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  asChild
                  className="w-full rounded-xl shadow-lg shadow-primary/20"
                >
                  <Link href="/tasks">Upgrade Now</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>

          <Card className="flex flex-col border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-medium text-xl">Enterprise</CardTitle>
              <span className="my-3 block text-3xl font-bold">
                $49
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </span>
              <CardDescription className="text-sm">
                For teams and organizations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro",
                  "Team Collaboration Tools",
                  "Admin Analytics Dashboard",
                  "Dedicated Success Manager",
                  "SSO & Advanced Security",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/tasks">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
