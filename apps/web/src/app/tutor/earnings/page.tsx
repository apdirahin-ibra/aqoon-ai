"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	Clock,
	CreditCard,
	DollarSign,
	Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const balanceInfo = {
	available: 3450,
	pending: 1280,
	lifetime: 12480,
	lastPayout: "2024-02-10",
};

const payoutHistory = [
	{
		id: "1",
		date: "2024-02-10",
		amount: 1250,
		method: "Bank Transfer",
		status: "completed",
	},
	{
		id: "2",
		date: "2024-01-25",
		amount: 980,
		method: "Bank Transfer",
		status: "completed",
	},
	{
		id: "3",
		date: "2024-01-10",
		amount: 1500,
		method: "PayPal",
		status: "completed",
	},
	{
		id: "4",
		date: "2024-02-15",
		amount: 720,
		method: "Bank Transfer",
		status: "pending",
	},
	{
		id: "5",
		date: "2023-12-20",
		amount: 1100,
		method: "Bank Transfer",
		status: "completed",
	},
];

const earningsByCourse = [
	{
		id: "1",
		title: "Introduction to Python Programming",
		earnings: 4200,
		students: 245,
		percentage: 34,
	},
	{
		id: "2",
		title: "Web Development with React",
		earnings: 3600,
		students: 189,
		percentage: 29,
	},
	{
		id: "3",
		title: "Node.js Backend Development",
		earnings: 2880,
		students: 156,
		percentage: 23,
	},
	{
		id: "4",
		title: "Advanced JavaScript Patterns",
		earnings: 1800,
		students: 92,
		percentage: 14,
	},
];

const barColors = [
	"bg-emerald-500",
	"bg-blue-500",
	"bg-purple-500",
	"bg-yellow-500",
];

export default function TutorEarningsPage() {
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="container py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">Earnings</h1>
					<p className="text-muted-foreground">
						Track your income and payout history
					</p>
				</div>
				<Button>
					<CreditCard className="mr-2 h-4 w-4" />
					Request Payout
				</Button>
			</div>

			{/* Balance Cards */}
			<div className="mb-8 grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">
									Available Balance
								</p>
								<p className="mt-1 font-bold text-3xl text-emerald-500">
									${balanceInfo.available.toLocaleString()}
								</p>
								<p className="mt-1 flex items-center gap-1 text-sm">
									<ArrowUpRight className="h-3 w-3 text-green-500" />
									<span className="text-green-500">Ready to withdraw</span>
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
								<DollarSign className="h-6 w-6 text-emerald-500" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Pending</p>
								<p className="mt-1 font-bold text-3xl">
									${balanceInfo.pending.toLocaleString()}
								</p>
								<p className="mt-1 flex items-center gap-1 text-sm">
									<Clock className="h-3 w-3 text-yellow-500" />
									<span className="text-muted-foreground">Processing</span>
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
								<Clock className="h-6 w-6 text-yellow-500" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">
									Lifetime Earnings
								</p>
								<p className="mt-1 font-bold text-3xl">
									${balanceInfo.lifetime.toLocaleString()}
								</p>
								<p className="mt-1 flex items-center gap-1 text-sm">
									<ArrowUpRight className="h-3 w-3 text-green-500" />
									<span className="text-green-500">+18%</span>
									<span className="text-muted-foreground">this month</span>
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
								<DollarSign className="h-6 w-6 text-purple-500" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Earnings by Course */}
				<Card>
					<CardHeader>
						<CardTitle>Earnings by Course</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{earningsByCourse.map((course, i) => (
								<div key={course.id}>
									<div className="mb-1 flex items-center justify-between text-sm">
										<span className="max-w-[220px] truncate font-medium">
											{course.title}
										</span>
										<span className="font-semibold">
											${course.earnings.toLocaleString()}
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
										<div
											className={`h-full rounded-full ${barColors[i % barColors.length]}`}
											style={{
												width: `${course.percentage}%`,
											}}
										/>
									</div>
									<p className="mt-1 text-muted-foreground text-xs">
										{course.students} students · {course.percentage}% of total
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Payout History */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Payout History</CardTitle>
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-3.5 w-3.5" />
								Export
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{payoutHistory.map((payout) => (
									<TableRow key={payout.id}>
										<TableCell className="text-muted-foreground text-sm">
											{formatDate(payout.date)}
										</TableCell>
										<TableCell className="text-sm">{payout.method}</TableCell>
										<TableCell>
											<Badge
												variant={
													payout.status === "completed"
														? "default"
														: "secondary"
												}
											>
												{payout.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right font-medium">
											<span
												className={
													payout.status === "completed"
														? "flex items-center justify-end gap-1 text-green-500"
														: "flex items-center justify-end gap-1 text-muted-foreground"
												}
											>
												{payout.status === "completed" ? (
													<ArrowDownRight className="h-3 w-3" />
												) : (
													<Clock className="h-3 w-3" />
												)}
												${payout.amount.toLocaleString()}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
