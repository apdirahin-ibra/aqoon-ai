"use client";

import {
    BookOpen,
    CreditCard,
    HelpCircle,
    MessageSquare,
    Search,
    Settings,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    id: string;
    title: string;
    icon: React.ElementType;
    items: FAQItem[];
}

const categories: FAQCategory[] = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: BookOpen,
        items: [
            {
                question: "How do I create an account?",
                answer:
                    'Click the "Sign Up" button in the top right corner, enter your email and create a password. You can also sign up using Google for faster registration.',
            },
            {
                question: "How do I enroll in a course?",
                answer:
                    'Browse our course catalog, click on a course you\'re interested in, and click "Enroll Now". Free courses are instantly accessible, while premium courses require payment.',
            },
            {
                question: "Can I access courses on mobile devices?",
                answer:
                    "Yes! Our platform is fully responsive and works on all devices including smartphones and tablets. You can learn anywhere, anytime.",
            },
            {
                question: "Do I need any prior knowledge to start?",
                answer:
                    "It depends on the course. Each course clearly indicates its difficulty level (Beginner, Intermediate, Advanced) and any prerequisites needed.",
            },
        ],
    },
    {
        id: "billing",
        title: "Billing & Payments",
        icon: CreditCard,
        items: [
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in some regions, local payment methods.",
            },
            {
                question: "Can I get a refund?",
                answer:
                    "Yes, we offer a 30-day money-back guarantee on all premium courses. If you're not satisfied, contact our support team for a full refund.",
            },
            {
                question: "Are there any subscription options?",
                answer:
                    "Yes! Our Pro and Business plans offer subscription access to all courses. Check our Pricing page for more details.",
            },
            {
                question: "How do I update my payment information?",
                answer:
                    'Go to your Profile Settings, click on the "Security" tab, and you\'ll find options to manage your payment methods.',
            },
        ],
    },
    {
        id: "account",
        title: "Account Management",
        icon: User,
        items: [
            {
                question: "How do I reset my password?",
                answer:
                    'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a link to reset your password.',
            },
            {
                question: "Can I change my email address?",
                answer:
                    "Yes, go to Profile Settings and update your email address. You'll need to verify the new email before the change takes effect.",
            },
            {
                question: "How do I delete my account?",
                answer:
                    "Contact our support team to request account deletion. Note that this action is irreversible and you'll lose access to all enrolled courses.",
            },
            {
                question: "Can I have multiple accounts?",
                answer:
                    "We recommend using a single account to keep all your progress in one place. However, you can create separate accounts with different email addresses.",
            },
        ],
    },
    {
        id: "courses",
        title: "Courses & Learning",
        icon: Settings,
        items: [
            {
                question: "Do courses have deadlines?",
                answer:
                    "No, once you enroll in a course, you have lifetime access to learn at your own pace.",
            },
            {
                question: "Will I get a certificate?",
                answer:
                    "Yes, upon completing a course and passing the final quiz, you'll receive a certificate of completion that you can share on LinkedIn or download as PDF.",
            },
            {
                question: "Can I download course materials?",
                answer:
                    "Some courses offer downloadable resources like PDFs, code files, or supplementary materials. Check the course details for availability.",
            },
            {
                question: "How do quizzes work?",
                answer:
                    "Most lessons include quizzes to test your understanding. You need to score at least 70% to pass. You can retake quizzes as many times as needed.",
            },
        ],
    },
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = categories
        .map((category) => ({
            ...category,
            items: category.items.filter(
                (item) =>
                    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        }))
        .filter((category) => category.items.length > 0);

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-20">
                <div className="container text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mb-6 font-bold font-display text-4xl md:text-5xl">
                        How can we <span className="text-primary">help</span>?
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
                        Find answers to frequently asked questions about our platform,
                        courses, billing, and more.
                    </p>

                    <div className="relative mx-auto max-w-xl">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search for answers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-12 text-lg"
                        />
                    </div>
                </div>
            </section>

            <div className="container py-12">
                {searchTerm && filteredCategories.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="mb-4 text-muted-foreground">
                            No results found for &quot;{searchTerm}&quot;
                        </p>
                        <Button variant="outline" onClick={() => setSearchTerm("")}>
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {(searchTerm ? filteredCategories : categories).map((category) => (
                            <div key={category.id}>
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <category.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="font-bold font-display text-2xl">
                                        {category.title}
                                    </h2>
                                </div>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {category.items.map((item, index) => (
                                        <AccordionItem
                                            key={`${category.id}-${index}`}
                                            value={`${category.id}-${index}`}
                                            className="rounded-lg border border-border px-6"
                                        >
                                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                )}

                {/* Still need help */}
                <div className="mt-16 rounded-2xl bg-muted/30 p-12 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <h2 className="mb-4 font-bold font-display text-2xl">
                        Still have questions?
                    </h2>
                    <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                        Can't find what you're looking for? Our support team is here to
                        help.
                    </p>
                    <Button asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
