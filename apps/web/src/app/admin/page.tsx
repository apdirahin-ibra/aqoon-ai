"use client";

import {
	BookOpen,
	DollarSign,
	GraduationCap,
	TrendingUp,
	Users,
} from "lucide-react";

const stats = [
	{
		title: "Total Users",
		value: "2,847",
		change: "+12%",
		icon: Users,
		color: "bg-linear-to-br from-category-coding to-category-coding/70",
	},
	{
		title: "Total Courses",
		value: "156",
		change: "+8%",
		icon: BookOpen,
		color: "bg-linear-to-br from-success to-success/70",
	},
	{
		title: "Enrollments",
		value: "4,523",
		change: "+24%",
		icon: GraduationCap,
		color: "bg-linear-to-br from-category-languages to-category-languages/70",
	},
	{
		title: "Revenue",
		value: "$34,250",
		change: "+18%",
		icon: DollarSign,
		color: "bg-linear-to-br from-warning to-warning/70",
	},
];

const weeklyEnrollments = [
	{ day: "Mon", count: 45 },
	{ day: "Tue", count: 62 },
	{ day: "Wed", count: 38 },
	{ day: "Thu", count: 71 },
	{ day: "Fri", count: 55 },
	{ day: "Sat", count: 28 },
	{ day: "Sun", count: 19 },
];

const recentActivity = [
	{
		id: "1",
		user: "Ahmed Hassan",
		action: "enrolled in",
		target: "Python Basics",
		time: "2 min ago",
	},
	{
		id: "2",
		user: "Sara Ali",
		action: "completed",
		target: "Web Development with React",
		time: "15 min ago",
	},
	{
		id: "3",
		user: "Mohamed Yusuf",
		action: "published",
		target: "Advanced JavaScript Patterns",
		time: "1 hour ago",
	},
	{
		id: "4",
		user: "Fatima Omar",
		action: "earned certificate for",
		target: "Data Science Fundamentals",
		time: "3 hours ago",
	},
	{
		id: "5",
		user: "Ibrahim Nur",
		action: "signed up as",
		target: "Tutor",
		time: "5 hours ago",
	},
];

const maxEnrollment = Math.max(...weeklyEnrollments.map((d) => d.count));

export default function AdminDashboardPage() {
	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">
					Admin Dashboard
				</h1>
				<p className="text-muted-foreground leading-relaxed">
					Overview of your platform&apos;s performance
				</p>
			</div>

			{/* Stats Cards */}
			<div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<div
						key={stat.title}
						className="group animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg"
						style={{ animationDelay: `${index * 0.1}s` }}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">{stat.title}</p>
								<p className="mt-1 font-bold font-display text-3xl">
									{stat.value}
								</p>
								<p className="mt-1 flex items-center gap-1 text-sm">
									<TrendingUp className="h-3 w-3 text-success" />
									<span className="font-medium text-success">
										{stat.change}
									</span>
									<span className="text-muted-foreground">vs last month</span>
								</p>
							</div>
							<div
								className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
							>
								<stat.icon className="h-6 w-6 text-white" />
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Weekly Enrollments Chart */}
				<div className="rounded-2xl border border-border bg-card shadow-sm">
					<div className="border-b p-6">
						<h2 className="font-bold font-display text-lg">
							Weekly Enrollments
						</h2>
					</div>
					<div className="p-6">
						<div className="flex h-48 items-end justify-between gap-2">
							{weeklyEnrollments.map((d) => (
								<div
									key={d.day}
									className="flex flex-1 flex-col items-center gap-2"
								>
									<span className="font-medium text-sm">{d.count}</span>
									<div
										className="w-full rounded-t-lg bg-linear-to-t from-primary to-primary/60 transition-all duration-300 hover:from-accent hover:to-accent/60"
										style={{
											height: `${(d.count / maxEnrollment) * 140}px`,
										}}
									/>
									<span className="text-muted-foreground text-xs">{d.day}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="rounded-2xl border border-border bg-card shadow-sm">
					<div className="border-b p-6">
						<h2 className="font-bold font-display text-lg">Recent Activity</h2>
					</div>
					<div className="p-6">
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
								>
									<div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-linear-to-br from-primary to-accent shadow-sm" />
									<div className="min-w-0 flex-1">
										<p className="text-sm">
											<span className="font-semibold">{activity.user}</span>{" "}
											<span className="text-muted-foreground">
												{activity.action}
											</span>{" "}
											<span className="font-semibold">{activity.target}</span>
										</p>
										<p className="text-muted-foreground text-xs">
											{activity.time}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
