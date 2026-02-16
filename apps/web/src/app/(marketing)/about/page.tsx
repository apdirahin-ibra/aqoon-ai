import {
    ArrowRight,
    Award,
    Globe,
    GraduationCap,
    Heart,
    Lightbulb,
    Target,
    Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
    { label: "Students Worldwide", value: "50,000+", icon: Users },
    { label: "Expert Tutors", value: "500+", icon: GraduationCap },
    { label: "Countries Reached", value: "120+", icon: Globe },
    { label: "Courses Available", value: "1,000+", icon: Award },
];

const values = [
    {
        icon: Heart,
        title: "Passion for Learning",
        description:
            "We believe everyone deserves access to quality education that transforms lives.",
    },
    {
        icon: Target,
        title: "Excellence",
        description:
            "We strive for the highest standards in everything we do, from course content to user experience.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "We continuously explore new ways to make learning more engaging, effective, and accessible.",
    },
];

const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", initials: "SJ" },
    { name: "Michael Chen", role: "CTO", initials: "MC" },
    { name: "Emily Rodriguez", role: "Head of Education", initials: "ER" },
    { name: "David Kim", role: "Head of Product", initials: "DK" },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-20">
                <div className="container text-center">
                    <h1 className="mb-6 font-bold font-display text-4xl md:text-5xl">
                        About <span className="text-primary">Aqoon AI</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
                        We're on a mission to democratize education and empower learners
                        worldwide with high-quality, accessible online learning experiences.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="border-border border-b py-16">
                <div className="container">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <p className="mb-1 font-bold text-3xl">{stat.value}</p>
                                <p className="text-muted-foreground text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="container">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="mb-6 font-bold font-display text-3xl">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Aqoon AI was founded with a simple yet powerful vision: to
                                    make quality education accessible to everyone, everywhere.
                                </p>
                                <p>
                                    What started as a small platform with just a handful of
                                    courses has grown into a global learning community with
                                    thousands of students and hundreds of expert tutors.
                                </p>
                                <p>
                                    Today, we continue to innovate and expand our offerings,
                                    always keeping our learners at the heart of everything we do.
                                    Our platform combines cutting-edge AI technology with
                                    pedagogical excellence to deliver transformative learning
                                    experiences.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted shadow-2xl">
                                <GraduationCap className="h-24 w-24 text-muted-foreground/30" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 rounded-xl bg-primary p-6 text-primary-foreground shadow-xl">
                                <p className="font-bold text-3xl">4+</p>
                                <p className="text-sm opacity-90">Years of Excellence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-muted/30 py-20">
                <div className="container">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 font-bold font-display text-3xl">
                            Our Values
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            These core values guide everything we do at Aqoon AI
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {values.map((value) => (
                            <Card key={value.title}>
                                <CardContent className="pt-6 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                        <value.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-lg">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="container">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 font-bold font-display text-3xl">
                            Meet Our Team
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            The passionate people behind Aqoon AI
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        {team.map((member) => (
                            <div key={member.name} className="text-center">
                                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                                    <span className="font-bold text-2xl text-muted-foreground">
                                        {member.initials}
                                    </span>
                                </div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-muted-foreground text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container text-center">
                    <h2 className="mb-4 font-bold font-display text-3xl">
                        Ready to Start Learning?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
                        Join thousands of learners who are already transforming their lives
                        with Aqoon AI.
                    </p>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/courses">
                            Browse Courses
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
