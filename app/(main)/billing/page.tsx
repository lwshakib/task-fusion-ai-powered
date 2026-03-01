'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/tasks/user-nav';
import { authClient } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UsageText } from '@/components/tasks/usage-text';

/**
 * Subscription Plans Data
 * Defines the features, pricing, and availability for different user tiers.
 */
const plans = [
  {
    name: 'Standard',
    price: '$0',
    description: 'Perfect for getting started with AI-powered task management.',
    features: [
      '10 AI messages per day',
      'Unlimited tasks',
      'Basic context fusion',
      'Community support',
    ],
    isCurrent: true, // Mark as default current plan
    available: true,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For power users who need more context and higher limits.',
    features: [
      'Unlimited AI messages',
      'Advanced context fusion',
      'Priority agent response',
      'Multi-device sync',
    ],
    isCurrent: false,
    available: false, // Feature flag: Not yet implemented
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large teams and organizations.',
    features: [
      'Custom AI models',
      'Dedicated success manager',
      'SSO & Advanced security',
      'Early access to features',
    ],
    isCurrent: false,
    available: false, // Feature flag: Not yet implemented
  },
];

/**
 * BillingPage Component
 * Displays current subscription status and available upgrade options.
 */
export default function BillingPage() {
  // Authentication session data
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const router = useRouter();

  // Show loading spinner while session is being verified
  if (isSessionPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to sign-in if the user is not authenticated
  if (!session) {
    router.replace('/sign-in');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between px-6 bg-background/95 backdrop-blur-md border-b z-20">
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to tasks</span>
        </Link>
        <div className="flex items-center gap-4">
          <UsageText />
          <ModeToggle />
          <UserNav />
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Page Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Billing & Plans
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription and explore available plans.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col relative overflow-hidden ${plan.isCurrent ? 'border-primary ring-1 ring-primary/20' : 'border-border/50'}`}
              >
                {/* Visual indicator for the user's active plan */}
                {plan.isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg">
                    Current Plan
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <CardDescription className="pt-2 min-h-[60px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="h-px bg-border/50 w-full" />
                  {/* Feature List */}
                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {/* Upgrade Action (Currently disabled for future tiers) */}
                  {plan.available ? (
                    <Button
                      className="w-full"
                      variant={plan.isCurrent ? 'outline' : 'default'}
                      disabled={plan.isCurrent}
                    >
                      {plan.isCurrent ? 'Active' : 'Upgrade'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full grayscale opacity-50"
                      variant="outline"
                      disabled
                    >
                      Not available right now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Marketing/Future Updates Callout */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Need more messages?</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  We are working on bringing more powerful features and higher
                  limits soon. Stay tuned for our upcoming Pro and Enterprise
                  releases!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
