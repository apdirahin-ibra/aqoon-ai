"use client";

import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
	{
		icon: Mail,
		label: "Email",
		value: "support@aqoon.ai",
		href: "mailto:support@aqoon.ai",
		color: "bg-linear-to-br from-accent to-accent/70",
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+252 61 234 5678",
		href: "tel:+252612345678",
		color: "bg-linear-to-br from-category-coding to-category-coding/70",
	},
	{
		icon: MapPin,
		label: "Address",
		value: "Mogadishu, Somalia",
		href: null,
		color: "bg-linear-to-br from-category-languages to-category-languages/70",
	},
	{
		icon: Clock,
		label: "Hours",
		value: "Mon-Fri, 9am - 6pm EAT",
		href: null,
		color: "bg-linear-to-br from-success to-success/70",
	},
];

const faqs = [
	{
		question: "How do I create an account?",
		answer:
			"Click 'Sign Up' on the top right corner and fill in your details. You can also sign up using your Google or GitHub account.",
	},
	{
		question: "How do I enroll in a course?",
		answer:
			"Browse our course catalog, click on a course that interests you, and click the 'Enroll' button. Free courses can be accessed immediately.",
	},
	{
		question: "Can I become a tutor?",
		answer:
			"Yes! Any registered user can apply to become a tutor. Go to your profile settings and click 'Apply as Tutor'. Our team will review your application.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept credit/debit cards, PayPal, and mobile money (EVC Plus, Zaad, and Sahal).",
	},
	{
		question: "How do I get a refund?",
		answer:
			"We offer a 30-day money-back guarantee on all paid courses. Contact our support team with your order details to request a refund.",
	},
];

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert("Message sent! We will get back to you shortly.");
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	return (
		<div>
			{/* Hero */}
			<section className="bg-linear-to-b from-primary/5 to-background py-24">
				<div className="container text-center">
					<Badge variant="secondary" className="mb-4 px-4 py-1">
						Contact
					</Badge>
					<h1 className="mb-5 font-bold font-display text-4xl tracking-tight sm:text-5xl">
						Get in{" "}
						<span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
							Touch
						</span>
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
						Have questions? We&apos;d love to hear from you. Send us a message
						and we&apos;ll respond as soon as possible.
					</p>
				</div>
			</section>

			<section className="py-16">
				<div className="container">
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Contact Form */}
						<div className="lg:col-span-2">
							<div className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
								<h2 className="mb-6 font-bold font-display text-xl">
									Send a Message
								</h2>
								<form onSubmit={handleSubmit} className="space-y-5">
									<div className="grid gap-5 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) =>
													setFormData((p) => ({
														...p,
														name: e.target.value,
													}))
												}
												placeholder="Your name"
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) =>
													setFormData((p) => ({
														...p,
														email: e.target.value,
													}))
												}
												placeholder="your@email.com"
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="subject">Subject</Label>
										<Input
											id="subject"
											value={formData.subject}
											onChange={(e) =>
												setFormData((p) => ({
													...p,
													subject: e.target.value,
												}))
											}
											placeholder="What can we help with?"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											value={formData.message}
											onChange={(e) =>
												setFormData((p) => ({
													...p,
													message: e.target.value,
												}))
											}
											placeholder="Tell us more..."
											rows={5}
											required
										/>
									</div>
									<Button
										type="submit"
										className="rounded-xl px-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
									>
										<Send className="mr-2 h-4 w-4" />
										Send Message
									</Button>
								</form>
							</div>
						</div>

						{/* Contact Info */}
						<div className="space-y-6">
							<div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
								<h2 className="mb-5 font-bold font-display text-lg">
									Contact Information
								</h2>
								<div className="space-y-5">
									{contactInfo.map((info) => (
										<div
											key={info.label}
											className="group flex items-start gap-4"
										>
											<div
												className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${info.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
											>
												<info.icon className="h-5 w-5 text-white" />
											</div>
											<div>
												<p className="font-semibold text-sm">{info.label}</p>
												{info.href ? (
													<a
														href={info.href}
														className="text-muted-foreground text-sm transition-colors hover:text-primary"
													>
														{info.value}
													</a>
												) : (
													<p className="text-muted-foreground text-sm">
														{info.value}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
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
							Frequently Asked{" "}
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
