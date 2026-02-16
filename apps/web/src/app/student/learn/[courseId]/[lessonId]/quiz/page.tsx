"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Loader2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  lessonId: string;
}

const mockQuiz: Quiz = {
  id: "1",
  title: "Python Basics Quiz",
  questions: [
    {
      id: "q1",
      question: "What is the correct way to create a variable in Python?",
      options: ["var x = 5", "x = 5", "let x = 5", "int x = 5"],
      correctAnswer: 1,
    },
    {
      id: "q2",
      question: "Which data type is used to store text in Python?",
      options: ["int", "str", "char", "text"],
      correctAnswer: 1,
    },
    {
      id: "q3",
      question: "What is the output of print(2 + 3)?",
      options: ["5", "23", "2 + 3", "Error"],
      correctAnswer: 0,
    },
    {
      id: "q4",
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "func", "define"],
      correctAnswer: 1,
    },
  ],
  lessonId: "1",
};

export default function QuizPage() {
  const [quiz] = useState<Quiz | null>(mockQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progressPercent = quiz
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    : 0;

  if (!quiz) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Results view
  if (submitted && score !== null) {
    const passed = score >= 70;

    return (
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="rounded-2xl text-center shadow-sm">
            <CardContent className="pt-8 pb-6">
              <div
                className={cn(
                  "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
                  passed
                    ? "bg-linear-to-br from-success/20 to-success/5"
                    : "bg-linear-to-br from-destructive/20 to-destructive/5",
                )}
              >
                {passed ? (
                  <Trophy className="h-8 w-8 text-success" />
                ) : (
                  <XCircle className="h-8 w-8 text-destructive" />
                )}
              </div>

              <h1 className="mb-1 font-bold font-display text-2xl">
                {passed ? "Congratulations!" : "Keep Practicing!"}
              </h1>
              <p className="mb-4 text-muted-foreground text-sm">
                {passed
                  ? "You have successfully passed the quiz."
                  : "You need 70% to pass. Review and try again."}
              </p>

              <div
                className={cn(
                  "mb-1 bg-clip-text font-bold text-4xl text-transparent",
                  passed
                    ? "bg-linear-to-r from-success to-success/60"
                    : "bg-linear-to-r from-destructive to-destructive/60",
                )}
              >
                {score}%
              </div>
              <p className="mb-5 text-muted-foreground text-xs">
                {
                  quiz.questions.filter(
                    (q) => answers[q.id] === q.correctAnswer,
                  ).length
                }{" "}
                of {quiz.questions.length} correct
              </p>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleRetry}
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Retry
                </Button>
                <Button size="sm" className="rounded-xl">
                  Back to Lesson
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Answers */}
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold text-sm">Review Your Answers</h2>
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <Card key={question.id} className="rounded-xl shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          isCorrect ? "bg-success/10" : "bg-destructive/10",
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        ) : (
                          <XCircle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 font-medium text-xs">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-0.5 text-xs">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={cn(
                                "rounded-lg p-1.5",
                                optIndex === question.correctAnswer &&
                                  "bg-success/10 text-success",
                                optIndex === userAnswer &&
                                  optIndex !== question.correctAnswer &&
                                  "bg-destructive/10 text-destructive",
                              )}
                            >
                              {option}
                              {optIndex === question.correctAnswer && " ✓"}
                              {optIndex === userAnswer &&
                                optIndex !== question.correctAnswer &&
                                " (Your answer)"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="mb-3 inline-flex items-center text-muted-foreground text-xs">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Lesson
          </div>
          <h1 className="font-bold font-display text-2xl">{quiz.title}</h1>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-5 rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">
                  {currentQuestion.question}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswer(currentQuestion.id, Number.parseInt(value))
                }
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex cursor-pointer items-center space-x-2.5 rounded-xl border p-2.5 text-sm transition-colors",
                      answers[currentQuestion.id] === index
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50",
                    )}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Previous
          </Button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              disabled={answers[currentQuestion?.id || ""] === undefined}
            >
              Next
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-xl"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quiz.questions.length}
            >
              Submit Quiz
              <CheckCircle2 className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                index === currentQuestionIndex
                  ? "bg-primary"
                  : answers[q.id] !== undefined
                    ? "bg-primary/50"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
