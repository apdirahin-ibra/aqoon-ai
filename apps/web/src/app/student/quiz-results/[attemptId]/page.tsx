"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizAttempt {
  id: string;
  score: number;
  answers: Record<string, number>;
  quiz: {
    id: string;
    title: string;
    questions: Question[];
    lesson: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
}

const mockAttempt: QuizAttempt = {
  id: "1",
  score: 75,
  answers: { 0: 1, 1: 1, 2: 2, 3: 3 },
  quiz: {
    id: "q1",
    title: "Python Basics Quiz",
    questions: [
      {
        question: "What is the correct way to create a variable in Python?",
        options: ["var x = 5", "x = 5", "let x = 5", "int x = 5"],
        correctAnswer: 1,
      },
      {
        question: "Which data type is used to store text in Python?",
        options: ["int", "str", "char", "text"],
        correctAnswer: 1,
      },
      {
        question: "What is the output of print(2 + 3)?",
        options: ["5", "23", "2 + 3", "Error"],
        correctAnswer: 0,
      },
      {
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "func", "define"],
        correctAnswer: 1,
      },
    ],
    lesson: {
      id: "l1",
      title: "Python Basics",
      course: {
        id: "c1",
        title: "Introduction to Python Programming",
      },
    },
  },
};

export default function QuizResultsPage() {
  const [attempt] = useState<QuizAttempt | null>(mockAttempt);
  const [loading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const generateAIFeedback = () => {
    setLoadingFeedback(true);
    setTimeout(() => {
      setAiFeedback(
        "Great job! You have a solid understanding of Python basics. Focus on practicing more with functions and data types to improve further.",
      );
      setLoadingFeedback(false);
    }, 2000);
  };

  if (loading || !attempt) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const questions = attempt.quiz.questions;
  const answers = attempt.answers;
  const correctCount = Math.round((attempt.score / 100) * questions.length);
  const scoreLevel =
    attempt.score >= 80
      ? "excellent"
      : attempt.score >= 60
        ? "good"
        : "needs_work";

  return (
    <div className="container py-8">
      <div className="mb-5">
        <div className="mb-1 flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{attempt.quiz.lesson.course.title}</span>
          <span>/</span>
          <span>{attempt.quiz.lesson.title}</span>
        </div>
        <h1 className="font-bold font-display text-2xl">
          {attempt.quiz.title} — Results
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Score Card */}
          <Card
            className={`overflow-hidden rounded-2xl border-2 shadow-sm ${
              scoreLevel === "excellent"
                ? "border-success/30 bg-linear-to-br from-success/5 to-transparent"
                : scoreLevel === "good"
                  ? "border-primary/30 bg-linear-to-br from-primary/5 to-transparent"
                  : "border-warning/30 bg-linear-to-br from-warning/5 to-transparent"
            }`}
          >
            <CardContent className="pt-4 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Trophy
                      className={`h-6 w-6 ${
                        scoreLevel === "excellent"
                          ? "text-success"
                          : scoreLevel === "good"
                            ? "text-primary"
                            : "text-warning"
                      }`}
                    />
                    <span className="font-bold text-3xl">{attempt.score}%</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {correctCount} of {questions.length} correct
                  </p>
                </div>
                <Badge
                  variant={scoreLevel === "excellent" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {scoreLevel === "excellent"
                    ? "Excellent!"
                    : scoreLevel === "good"
                      ? "Good Job!"
                      : "Keep Practicing"}
                </Badge>
              </div>
              <Progress value={attempt.score} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Breakdown */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                Question Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {questions.map((question, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 ${
                      isCorrect
                        ? "border-success/20 bg-success/5"
                        : "border-destructive/20 bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 text-destructive" />
                      )}
                      <div className="flex-1">
                        <p className="mb-1 font-medium text-xs">
                          Q{idx + 1}: {question.question}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          Your answer:{" "}
                          <span
                            className={
                              isCorrect ? "text-success" : "text-destructive"
                            }
                          >
                            {question.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="mt-0.5 text-success text-[10px]">
                            Correct: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiFeedback ? (
                <p className="whitespace-pre-wrap text-sm">{aiFeedback}</p>
              ) : (
                <div className="py-3 text-center">
                  <p className="mb-3 text-muted-foreground text-xs">
                    Get personalized feedback from AI
                  </p>
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={generateAIFeedback}
                    disabled={loadingFeedback}
                  >
                    {loadingFeedback ? (
                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                    )}
                    Get Feedback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Retry Quiz
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                Review Lesson
              </Button>
              <Button size="sm" className="w-full rounded-xl text-xs">
                Continue Course
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
