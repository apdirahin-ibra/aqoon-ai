"use client";

import {
    Building,
    Clock,
    HelpCircle,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
    { icon: Mail, label: "Email", value: "support@aqoon-ai.com" },
    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
    {
        icon: MapPin,
        label: "Address",
        value: "123 Learning Street, Education City, EC 12345",
    },
    { icon: Clock, label: "Hours", value: "Mon-Fri: 9AM-6PM EST" },
];

const quickFaqs = [
    {
        question: "How do I get started?",
        answer:
            "Simply create an account, browse our courses, and enroll in any course that interests you.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit cards, PayPal, and bank transfers for premium courses.",
    },
    {
        question: "Can I get a refund?",
        answer:
            "Yes, we offer a 30-day money-back guarantee on all premium courses.",
    },
];

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSending(false);
    };

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-20">
                <div className="container text-center">
                    <h1 className="mb-6 font-bold font-display text-4xl md:text-5xl">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
                        Have questions? We'd love to hear from you. Send us a message and
                        we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <div className="container py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Send us a Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name">Your Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject</Label>
                                        <Select
                                            value={formData.subject}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, subject: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">
                                                    General Inquiry
                                                </SelectItem>
                                                <SelectItem value="support">
                                                    Technical Support
                                                </SelectItem>
                                                <SelectItem value="billing">
                                                    Billing Question
                                                </SelectItem>
                                                <SelectItem value="partnership">
                                                    Partnership
                                                </SelectItem>
                                                <SelectItem value="feedback">Feedback</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            placeholder="How can we help you?"
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full sm:w-auto"
                                    >
                                        {sending ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{item.label}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5" />
                                    Quick Answers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {quickFaqs.map((faq) => (
                                    <div key={faq.question}>
                                        <p className="mb-1 font-medium text-sm">{faq.question}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
