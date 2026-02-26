"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useAction } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ASSESSMENT_QUESTIONS: Record<
  string,
  { question: string; options: string[] }[]
> = {
  coding: [
    {
      question:
        "How familiar are you with programming concepts like variables, loops, and functions?",
      options: [
        "Never heard of them",
        "Know the basics",
        "Use them regularly",
        "Expert level",
      ],
    },
    {
      question: "Have you built a complete project from scratch?",
      options: [
        "Never",
        "One small project",
        "Several projects",
        "Many complex projects",
      ],
    },
    {
      question: "How comfortable are you with debugging code?",
      options: [
        "Very uncomfortable",
        "Need lots of help",
        "Can usually figure it out",
        "Debug complex issues easily",
      ],
    },
    {
      question: "Experience with version control (Git)?",
      options: [
        "Never used it",
        "Basic commits",
        "Branching and merging",
        "Advanced workflows",
      ],
    },
    {
      question: "How do you approach learning new technologies?",
      options: [
        "Follow tutorials step by step",
        "Mix tutorials with experimentation",
        "Read docs and build projects",
        "Dive into source code",
      ],
    },
  ],
  languages: [
    {
      question: "Can you understand basic greetings and introductions?",
      options: ["Not at all", "A few words", "Basic conversations", "Fluently"],
    },
    {
      question: "How is your reading comprehension?",
      options: [
        "Cannot read",
        "Simple texts with help",
        "Most texts with dictionary",
        "Native-level",
      ],
    },
    {
      question: "Can you hold a conversation?",
      options: [
        "Cannot speak",
        "Simple phrases",
        "Daily conversations",
        "Complex discussions",
      ],
    },
  ],
  art: [
    {
      question: "How comfortable are you with basic drawing?",
      options: [
        "Never drawn",
        "Struggle with basics",
        "Can draw simple things",
        "Draw complex subjects",
      ],
    },
    {
      question: "Understanding of color theory?",
      options: [
        "No knowledge",
        "Basic color wheel",
        "Understand harmonies",
        "Expert application",
      ],
    },
    {
      question: "Experience with digital tools?",
      options: [
        "Never used",
        "Basic familiarity",
        "Regular user",
        "Advanced techniques",
      ],
    },
  ],
};

interface AssessmentResult {
  level: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const categories = [
  {
    id: "coding",
    name: "Coding",
    icon: "💻",
    description: "Programming and software development",
  },
  {
    id: "languages",
    name: "Languages",
    icon: "🌍",
    description: "Foreign language proficiency",
  },
  {
    id: "art",
    name: "Art & Design",
    icon: "🎨",
    description: "Visual arts and design skills",
  },
];

export default function SkillAssessmentPage() {
  const assessSkills = useAction(api.ai.assessSkills);

  const [category, setCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const questions = category ? ASSESSMENT_QUESTIONS[category] || [] : [];
  const progress =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: Number.parseInt(value, 10) });
  };

  const submitAssessment = async () => {
    if (!category) return;
    setLoading(true);
    setError(null);
    try {
      const questionTexts = questions.map((q) => q.question);
      const answerTexts = questions.map(
        (q, i) => q.options[answers[i] ?? 0] ?? "No answer",
      );

      const res = await assessSkills({
        category,
        questions: questionTexts,
        answers: answerTexts,
      });
      setResult(res as AssessmentResult);
    } catch (err) {
      console.error("Assessment failed:", err);
      setError("Failed to process assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Results View
  if (result) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden rounded-2xl border-2 border-primary/30 shadow-sm">
            <CardHeader className="bg-linear-to-br from-primary/5 to-transparent pb-4 text-center">
              <Badge
                className="mx-auto mb-3 w-fit"
                variant={result.level === "advanced" ? "default" : "secondary"}
              >
                {result.level.charAt(0).toUpperCase() + result.level.slice(1)}{" "}
                Level
              </Badge>
              <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
              <CardDescription className="text-xs">
                Here&apos;s your {category} skill analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="text-center">
                <div className="mb-1 bg-linear-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent">
                  {result.score}%
                </div>
                <p className="text-muted-foreground text-xs">
                  Proficiency Score
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader className="px-3 pt-3 pb-1.5">
                    <CardTitle className="flex items-center gap-1.5 text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-success/20 to-success/5">
                        <CheckCircle className="h-3 w-3 text-success" />
                      </div>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-0.5 text-xs">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader className="px-3 pt-3 pb-1.5">
                    <CardTitle className="flex items-center gap-1.5 text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-warning/20 to-warning/5">
                        <AlertCircle className="h-3 w-3 text-warning" />
                      </div>
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-0.5 text-xs">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-xl shadow-sm">
                <CardHeader className="px-3 pt-3 pb-1.5">
                  <CardTitle className="flex items-center gap-1.5 text-xs">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-primary/20 to-primary/5">
                      <TrendingUp className="h-3 w-3 text-primary" />
                    </div>
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <ul className="space-y-1 text-xs">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-primary">{i + 1}.</span>
                        <span className="text-muted-foreground">{r}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setCategory(null);
                    setResult(null);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                >
                  Retake
                </Button>
                <Button size="sm" className="flex-1 rounded-xl">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  Browse Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Category Selection
  if (!category) {
    return (
      <div className="container py-8">
        <div className="mb-5 text-center">
          <h1 className="mb-1 font-bold font-display text-2xl">
            Skill Assessment
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground text-sm">
            Discover your skill level and get personalized recommendations.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
          {categories.map((cat, i) => (
            <Card
              key={cat.id}
              className="fade-in slide-in-from-bottom-4 animate-in cursor-pointer rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: "backwards",
              }}
              onClick={() => setCategory(cat.id)}
            >
              <CardContent className="pt-5 pb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-accent/10 text-2xl">
                  {cat.icon}
                </div>
                <h3 className="mb-1 font-semibold text-sm">{cat.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {cat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Questions View
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <Badge
              variant="outline"
              className="cursor-pointer text-xs"
              onClick={() => {
                setCategory(null);
                setCurrentQuestion(0);
                setAnswers({});
              }}
            >
              Change Category
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {questions[currentQuestion]?.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={handleAnswer}
            >
              {questions[currentQuestion]?.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2.5 rounded-xl border p-2.5 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label
                    htmlFor={`option-${idx}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {error && <p className="text-destructive text-xs">{error}</p>}

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setCurrentQuestion((i) => i - 1)}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setCurrentQuestion((i) => i + 1)}
                  disabled={answers[currentQuestion] === undefined}
                >
                  Next
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={submitAssessment}
                  disabled={loading || answers[currentQuestion] === undefined}
                >
                  {loading ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                  )}
                  Get Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
