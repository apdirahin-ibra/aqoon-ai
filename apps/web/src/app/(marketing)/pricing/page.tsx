import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        description: "Perfect for getting started",
        price: 0,
        period: "forever",
        icon: Zap,
        features: [
            "Access to all free courses",
            "Basic progress tracking",
            "Community forum access",
            "AI-generated quizzes (5/month)",
            "Email support",
        ],
        cta: "Start Free",
        href: "/auth?tab=signup",
        highlighted: false,
    },
    {
        name: "Pro",
        description: "Best for serious learners",
        price: 19,
        period: "/month",
        icon: Sparkles,
        features: [
            "Everything in Free, plus:",
            "Access to ALL premium courses",
            "Unlimited AI quizzes & feedback",
            "Personalized learning paths",
            "Certificate of completion",
            "Priority support",
            "Offline course access",
        ],
        cta: "Start Pro Trial",
        href: "/auth?tab=signup&plan=pro",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        name: "Business",
        description: "For teams and organizations",
        price: 49,
        period: "/user/month",
        icon: Crown,
        features: [
            "Everything in Pro, plus:",
            "Team management dashboard",
            "Custom learning paths",
            "Advanced analytics",
            "SSO integration",
            "Dedicated success manager",
            "API access",
            "Custom branding",
        ],
        cta: "Contact Sales",
        href: "/contact?inquiry=business",
        highlighted: false,
    },
];

const faqs = [
    {
        question: "Can I switch plans anytime?",
        answer:
            "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        question: "Is there a free trial?",
        answer:
            "Yes, Pro plan comes with a 7-day free trial. No credit card required to start.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
    },
    {
        question: "Can I get a refund?",
        answer:
            "We offer a 30-day money-back guarantee if you're not satisfied with your subscription.",
    },
];

export default function PricingPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-20 text-white">
                <div className="container text-center">
                    <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 font-semibold text-sm text-white">
                        Simple, Transparent Pricing
                    </span>
                    <h1 className="mb-6 font-bold font-display text-4xl md:text-5xl lg:text-6xl">
                        Invest in Your Future
                    </h1>
                    <p className="mx-auto max-w-2xl text-white/80 text-xl">
                        Choose the plan that fits your learning goals. Start free, upgrade
                        when you're ready.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="-mt-10 py-20">
                <div className="container">
                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={cn(
                                    "relative flex flex-col rounded-3xl p-8",
                                    plan.highlighted
                                        ? "z-10 scale-105 bg-gradient-to-br from-primary to-primary/90 text-white shadow-2xl"
                                        : "border border-border bg-card shadow-lg",
                                )}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-amber-400 px-4 py-1.5 font-semibold text-sm text-amber-950 shadow-lg">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div
                                        className={cn(
                                            "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                                            plan.highlighted ? "bg-white/20" : "bg-primary/10",
                                        )}
                                    >
                                        <plan.icon
                                            className={cn(
                                                "h-6 w-6",
                                                plan.highlighted ? "text-white" : "text-primary",
                                            )}
                                        />
                                    </div>
                                    <h3 className="font-bold font-display text-2xl">
                                        {plan.name}
                                    </h3>
                                    <p
                                        className={cn(
                                            "text-sm",
                                            plan.highlighted
                                                ? "text-white/70"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="font-bold text-5xl">${plan.price}</span>
                                    <span
                                        className={cn(
                                            "text-lg",
                                            plan.highlighted
                                                ? "text-white/70"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {plan.period}
                                    </span>
                                </div>

                                <ul className="mb-8 flex-1 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check
                                                className={cn(
                                                    "mt-0.5 h-5 w-5 shrink-0",
                                                    plan.highlighted
                                                        ? "text-amber-300"
                                                        : "text-green-500",
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm",
                                                    plan.highlighted
                                                        ? "text-white/90"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full"
                                    variant={plan.highlighted ? "secondary" : "outline"}
                                >
                                    <Link href={plan.href as any}>
                                        {plan.cta}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-muted/30 py-20">
                <div className="container max-w-3xl">
                    <h2 className="mb-12 text-center font-bold font-display text-3xl md:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <div
                                key={faq.question}
                                className="rounded-2xl border border-border bg-card p-6"
                            >
                                <h3 className="mb-2 font-semibold text-lg">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-20 text-white">
                <div className="container text-center">
                    <h2 className="mb-4 font-bold font-display text-3xl md:text-4xl">
                        Ready to Start Learning?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
                        Join thousands of learners who have transformed their skills with
                        Aqoon AI.
                    </p>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/auth?tab=signup">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
