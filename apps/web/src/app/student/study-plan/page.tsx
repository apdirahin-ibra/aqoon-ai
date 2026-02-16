"use client";

import {
  BookOpen,
  Calendar,
  CheckCircle,
  Lightbulb,
  Loader2,
  Save,
  Sparkles,
  Target,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface StudyPlan {
  weeks: {
    week: number;
    focus: string;
    tasks: string[];
    milestone: string;
  }[];
  tips: string[];
}

const mockPlan: StudyPlan = {
  weeks: [
    {
      week: 1,
      focus: "Python Basics",
      tasks: [
        "Install Python and set up development environment",
        "Learn variables, data types, and basic operators",
        "Write your first Python program",
      ],
      milestone: "Write a program that calculates basic arithmetic",
    },
    {
      week: 2,
      focus: "Control Flow",
      tasks: [
        "Understand if, elif, else statements",
        "Learn about loops (for and while)",
        "Practice conditional logic",
      ],
      milestone: "Build a simple calculator program",
    },
    {
      week: 3,
      focus: "Functions",
      tasks: [
        "Learn function definition and calling",
        "Understand parameters and return values",
        "Practice with built-in functions",
      ],
      milestone: "Create a function library for common tasks",
    },
    {
      week: 4,
      focus: "Data Structures",
      tasks: [
        "Learn lists, tuples, and dictionaries",
        "Understand when to use each data structure",
        "Practice manipulation and iteration",
      ],
      milestone: "Build a contact book application",
    },
  ],
  tips: [
    "Practice coding daily, even if just for 30 minutes",
    "Work on small projects to reinforce learning",
    "Don't be afraid to make mistakes - they're part of learning!",
  ],
};

export default function StudyPlanPage() {
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("coding");
  const [level, setLevel] = useState("beginner");
  const [weeklyHours, setWeeklyHours] = useState([5]);
  const [duration, setDuration] = useState("4");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(mockPlan);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan(mockPlan);
      setLoading(false);
    }, 2000);
  };

  const savePlan = () => {
    alert("Plan saved!");
  };

  return (
    <div className="container py-8">
      <div className="mb-5 text-center">
        <h1 className="mb-1 font-bold font-display text-2xl">
          AI Study Plan Generator
        </h1>
        <p className="mx-auto max-w-lg text-muted-foreground text-sm">
          Tell us your learning goals and we&apos;ll create a personalized study
          plan tailored to your schedule.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                <Target className="h-4 w-4 text-primary" />
              </div>
              Your Learning Goals
            </CardTitle>
            <CardDescription className="text-xs">
              Customize your study plan parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal" className="text-xs">
                What do you want to learn?
              </Label>
              <Input
                id="goal"
                placeholder="e.g., Build full-stack web applications"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="languages">Languages</SelectItem>
                    <SelectItem value="art">Art & Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Current Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Weekly Time Commitment</Label>
                <span className="font-medium text-xs">
                  {weeklyHours[0]} hrs/week
                </span>
              </div>
              <Slider
                value={weeklyHours}
                onValueChange={setWeeklyHours}
                min={1}
                max={40}
                step={1}
              />
              <div className="flex justify-between text-muted-foreground text-[10px]">
                <span>1 hour</span>
                <span>40 hours</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Plan Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 weeks</SelectItem>
                  <SelectItem value="4">4 weeks</SelectItem>
                  <SelectItem value="8">8 weeks</SelectItem>
                  <SelectItem value="12">12 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generatePlan}
              disabled={loading}
              className="w-full rounded-xl"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plan */}
        <div className="space-y-4">
          {plan ? (
            <>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      Your Study Plan
                    </CardTitle>
                    <Button
                      onClick={savePlan}
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-lg text-xs"
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.weeks.map((week, i) => (
                    <div
                      key={week.week}
                      className="border-l-2 border-linear-to-b from-primary to-primary/30 pl-3 animate-in fade-in slide-in-from-bottom-2"
                      style={{
                        animationDelay: `${i * 100}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          Week {week.week}
                        </Badge>
                        <span className="font-semibold text-sm">
                          {week.focus}
                        </span>
                      </div>
                      <ul className="mb-1.5 space-y-0.5">
                        {week.tasks.map((task, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-muted-foreground text-xs"
                          >
                            <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                            {task}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="font-medium text-primary">
                          Milestone:
                        </span>
                        <span className="text-muted-foreground">
                          {week.milestone}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {plan.tips && plan.tips.length > 0 && (
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-warning/20 to-warning/5">
                        <Lightbulb className="h-4 w-4 text-warning" />
                      </div>
                      Study Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {plan.tips.map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 text-xs"
                        >
                          <span className="font-bold text-primary">
                            {idx + 1}.
                          </span>
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="flex h-full items-center justify-center rounded-2xl">
              <CardContent className="py-10 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 font-semibold text-sm">
                  No plan generated yet
                </h3>
                <p className="text-muted-foreground text-xs">
                  Fill in your goals and click generate to create your plan.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
