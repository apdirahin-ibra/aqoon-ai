import { Check, Sparkles, Star, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic courses",
    icon: Zap,
    color: "bg-linear-to-br from-category-coding to-category-coding/70",
    features: [
      "Access to free courses",
      "Basic progress tracking",
      "Community forum access",
      "1 skill assessment/month",
      "Mobile access",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Advanced learning with AI features",
    icon: Star,
    color: "bg-linear-to-br from-accent to-accent/70",
    features: [
      "Everything in Free",
      "Unlimited course access",
      "AI-powered study plans",
      "Priority support",
      "Unlimited skill assessments",
      "Certificate downloads",
      "Offline access",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For teams and organizations",
    icon: Sparkles,
    color: "bg-linear-to-br from-category-languages to-category-languages/70",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom learning paths",
      "API access",
      "SSO integration",
      "Dedicated account manager",
      "Custom branding",
      "Analytics & reporting",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes! Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data and progress are always preserved. Some features may become limited based on your new plan, but you won't lose any learning history.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes, we offer a 50% discount for verified students. Contact our support team with your valid student ID.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-background py-24">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">
            Pricing
          </Badge>
          <h1 className="mb-5 font-bold font-display text-4xl tracking-tight sm:text-5xl">
            Simple, Transparent{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Choose the plan that fits your learning goals. Start for free and
            upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`group relative animate-fade-in-up overflow-hidden rounded-3xl border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border hover:border-transparent"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {plan.popular && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-primary to-accent" />
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-6 text-center">
                    {plan.popular && (
                      <Badge className="mb-3 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    )}
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${plan.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <plan.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold font-display text-xl">
                      {plan.name}
                    </h3>
                    <div className="mt-3">
                      <span className="font-bold font-display text-4xl">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <Separator className="mb-6" />

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    variant={plan.variant}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              FAQ
            </Badge>
            <h2 className="mb-5 font-bold font-display text-3xl md:text-4xl">
              Common{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm">
            <Accordion>
              {faqs.map((faq, index) => (
                <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
