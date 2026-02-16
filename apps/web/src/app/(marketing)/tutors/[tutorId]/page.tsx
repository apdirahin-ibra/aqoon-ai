import {
  BookOpen,
  Globe,
  GraduationCap,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock tutor data — in real app, fetch by tutorId param
const tutor = {
  name: "Ahmed Hassan",
  title: "Senior Software Engineer & Educator",
  bio: "Passionate about teaching programming and helping students launch their tech careers. 10+ years of industry experience at top tech companies. My courses focus on practical, hands-on learning with real-world projects.",
  location: "Mogadishu, Somalia",
  languages: ["Somali", "English", "Arabic"],
  rating: 4.9,
  totalStudents: 1247,
  totalCourses: 8,
  totalReviews: 342,
  joinedDate: "Jan 2023",
  expertise: [
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "Machine Learning",
    "Data Science",
  ],
};

const courses = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    description:
      "Learn Python from scratch with hands-on projects and real-world examples.",
    students: 245,
    rating: 4.9,
    level: "Beginner",
    price: "$29.99",
    lessons: 24,
  },
  {
    id: "2",
    title: "Web Development with React",
    description:
      "Build modern web applications with React, hooks, and state management.",
    students: 189,
    rating: 4.7,
    level: "Intermediate",
    price: "$39.99",
    lessons: 32,
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    description:
      "Create scalable backend services with Node.js, Express, and databases.",
    students: 156,
    rating: 4.8,
    level: "Intermediate",
    price: "$34.99",
    lessons: 28,
  },
];

const reviews = [
  {
    id: "1",
    name: "Sara A.",
    rating: 5,
    comment:
      "Ahmed is an incredible teacher. His Python course helped me land my first dev job!",
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "Ibrahim N.",
    rating: 5,
    comment:
      "Clear explanations and great projects. The React course is a must for anyone starting frontend development.",
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Fatima O.",
    rating: 4,
    comment:
      "Very thorough and well-structured courses. Would love more advanced content.",
    date: "2 months ago",
  },
];

export default function TutorPublicProfilePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-background py-16">
        <div className="container">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/30 to-primary/10 text-4xl font-bold text-primary">
              {tutor.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="mb-1 font-bold font-display text-3xl">
                {tutor.name}
              </h1>
              <p className="mb-2 text-lg text-muted-foreground">
                {tutor.title}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {tutor.rating} ({tutor.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {tutor.totalStudents.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {tutor.totalCourses} courses
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tutor.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Bio + Expertise */}
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-3 font-semibold">About</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tutor.bio}
                  </p>

                  <Separator className="my-4" />

                  <h3 className="mb-2 font-semibold">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <h3 className="mb-2 font-semibold">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="gap-1">
                        <Globe className="h-3 w-3" />
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <p className="text-muted-foreground text-xs">
                    Member since {tutor.joinedDate}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: Courses + Reviews */}
            <div className="space-y-8 lg:col-span-2">
              <div>
                <h2 className="mb-4 font-bold font-display text-2xl">
                  Courses by {tutor.name.split(" ")[0]}
                </h2>
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold">{course.title}</h3>
                          <p className="mb-2 text-muted-foreground text-sm">
                            {course.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {course.level}
                            </Badge>
                            <span>{course.lessons} lessons</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {course.rating}
                            </span>
                            <span>{course.students} students</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="mb-2 font-bold text-lg">
                            {course.price}
                          </p>
                          <Button size="sm" asChild>
                            <Link href={`/courses/${course.id}`}>
                              View Course
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="mb-4 font-bold font-display text-2xl">
                  Student Reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                              {review.name.charAt(0)}
                            </div>
                            <span className="font-medium text-sm">
                              {review.name}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {review.date}
                          </span>
                        </div>
                        <div className="mb-2 flex gap-0.5">
                          {Array.from({
                            length: review.rating,
                          }).map((_, i) => (
                            <Star
                              key={`star-${i}`}
                              className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
