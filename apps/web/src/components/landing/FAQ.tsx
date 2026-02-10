"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "How does the AI Tutor work?",
		answer:
			"Our AI Tutor analyzes your learning style and current knowledge to generate personalized explanations, quizzes, and coding challenges. It's available 24/7 to answer questions and provide immediate feedback.",
	},
	{
		question: "Are the certificates recognized?",
		answer:
			"Yes, our certificates are verified on the blockchain, ensuring their authenticity. They can be easily shared on LinkedIn and included in your resume.",
	},
	{
		question: "Can I become an instructor?",
		answer:
			"Absolutely! We welcome experts to create courses. Our platform handles the technical hosting, AI integration, and payments, so you can focus on teaching.",
	},
	{
		question: "Is there a free trial?",
		answer:
			"Yes, you can access introductory lessons and the basic AI tutor features for free. We also offer a 14-day free trial for our Premium plan.",
	},
];

export function FAQ() {
	return (
		<section className="container mx-auto max-w-4xl px-4 py-24 md:px-6">
			<div className="mb-12 space-y-4 text-center">
				<h2 className="font-bold text-3xl tracking-tighter sm:text-4xl">
					Frequently <span className="text-primary">Asked Questions</span>
				</h2>
			</div>

			<Accordion className="w-full">
				{faqs.map((faq, i) => (
					<AccordionItem key={i} value={`item-${i}`}>
						<AccordionTrigger className="text-left font-medium text-lg">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
