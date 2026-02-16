import {
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Students",
    value: "10,000+",
    icon: Users,
    color: "bg-linear-to-br from-category-coding to-category-coding/70",
  },
  {
    label: "Courses",
    value: "200+",
    icon: BookOpen,
    color: "bg-linear-to-br from-accent to-accent/70",
  },
  {
    label: "Tutors",
    value: "50+",
    icon: GraduationCap,
    color: "bg-linear-to-br from-category-languages to-category-languages/70",
  },
  {
    label: "Certificates Issued",
    value: "5,000+",
    icon: Award,
    color: "bg-linear-to-br from-success to-success/70",
  },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We believe everyone deserves access to quality education, regardless of location or background.",
    color: "bg-linear-to-br from-accent to-accent/70",
  },
  {
    icon: Lightbulb,
    title: "AI-Powered Learning",
    description:
      "Our platform uses artificial intelligence to personalize learning paths and provide adaptive feedback.",
    color: "bg-linear-to-br from-warning to-warning/70",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We build strong learning communities where students and tutors collaborate and grow together.",
    color: "bg-linear-to-br from-category-languages to-category-languages/70",
  },
];

const team = [
  {
    name: "Ahmed Hassan",
    role: "Founder & CEO",
    bio: "Passionate about education technology and making learning accessible.",
    gradient: "from-accent/30 to-accent/5",
  },
  {
    name: "Sara Ali",
    role: "Head of Curriculum",
    bio: "10+ years of experience in curriculum design and instructional methodology.",
    gradient: "from-category-coding/30 to-category-coding/5",
  },
  {
    name: "Mohamed Yusuf",
    role: "CTO",
    bio: "Full-stack engineer specializing in AI/ML and scalable education platforms.",
    gradient: "from-category-languages/30 to-category-languages/5",
  },
  {
    name: "Fatima Omar",
    role: "Head of Community",
    bio: "Building inclusive learning communities and supporting student success.",
    gradient: "from-success/30 to-success/5",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-background py-24">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">
            About Us
          </Badge>
          <h1 className="mb-5 font-bold font-display text-4xl tracking-tight sm:text-5xl">
            Building the Future of{" "}
            <span className="bg-linear-to-r from-primary to-category-coding bg-clip-text text-transparent">
              Education
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We&apos;re building an AI-powered learning platform that adapts to
            every student&apos;s unique needs and empowers tutors to create
            world-class courses.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group flex animate-fade-in-up items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold font-display text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              Our Values
            </Badge>
            <h2 className="mb-5 font-bold font-display text-3xl md:text-4xl">
              What Drives Us{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Forward
              </span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group relative animate-fade-in-up overflow-hidden rounded-3xl border border-border bg-card p-8 text-center transition-all duration-500 hover:border-transparent hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div
                    className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${value.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 font-bold font-display text-xl transition-colors group-hover:text-primary">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              Our Team
            </Badge>
            <h2 className="font-bold font-display text-3xl md:text-4xl">
              Meet the{" "}
              <span className="bg-linear-to-r from-primary to-category-languages bg-clip-text text-transparent">
                Team
              </span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="group animate-fade-in-up overflow-hidden rounded-3xl border border-border bg-card p-6 text-center transition-all duration-500 hover:border-transparent hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br ${member.gradient} ring-4 ring-background transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className="font-bold text-2xl text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold font-display transition-colors group-hover:text-primary">
                  {member.name}
                </h3>
                <p className="text-primary text-sm">{member.role}</p>
                <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
