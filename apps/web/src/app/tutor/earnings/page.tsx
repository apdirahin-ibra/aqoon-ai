"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    Clock,
    DollarSign,
    Loader2,
    Wallet,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Payout {
    id: string;
    amount: number;
    status: "completed" | "pending" | "processing";
    date: string;
    method: string;
}

const mockPayouts: Payout[] = [
    {
        id: "1",
        amount: 25000,
        status: "completed",
        date: "2024-01-31",
        method: "Bank Transfer",
    },
    {
        id: "2",
        amount: 18500,
        status: "completed",
        date: "2024-01-15",
        method: "Bank Transfer",
    },
    {
        id: "3",
        amount: 31200,
        status: "processing",
        date: "2024-02-05",
        method: "PayPal",
    },
    {
        id: "4",
        amount: 12800,
        status: "pending",
        date: "2024-02-10",
        method: "Bank Transfer",
    },
];

export default function TutorEarningsPage() {
    const [payouts] = useState<Payout[]>(mockPayouts);
    const [loading] = useState(false);

    const totalEarned = payouts
        .filter((p) => p.status === "completed")
        .reduce((s, p) => s + p.amount, 0);
    const pendingAmount = payouts
        .filter((p) => p.status !== "completed")
        .reduce((s, p) => s + p.amount, 0);

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(cents / 100);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-600";
            case "processing":
                return "bg-blue-500/10 text-blue-600";
            case "pending":
                return "bg-amber-500/10 text-amber-600";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-2 font-bold font-display text-3xl">Earnings</h1>
                    <p className="text-muted-foreground">
                        Track your revenue and payout history
                    </p>
                </div>
                <Button>
                    <Wallet className="mr-2 h-4 w-4" />
                    Request Payout
                </Button>
            </div>

            {/* Stats */}
            <div className="mb-10 grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{formatPrice(totalEarned)}</p>
                                <p className="text-muted-foreground text-sm">Total Earned</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    {formatPrice(pendingAmount)}
                                </p>
                                <p className="text-muted-foreground text-sm">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <ArrowUpRight className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    {formatPrice(totalEarned + pendingAmount)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Lifetime Revenue
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payout History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                    {payouts.length > 0 ? (
                        <div className="space-y-3">
                            {payouts.map((payout) => (
                                <div
                                    key={payout.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${payout.status === "completed"
                                                    ? "bg-green-500/10"
                                                    : "bg-muted"
                                                }`}
                                        >
                                            {payout.status === "completed" ? (
                                                <ArrowUpRight className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <ArrowDownRight className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {formatPrice(payout.amount)}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {formatDate(payout.date)} • {payout.method}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(payout.status)}>
                                        {payout.status.charAt(0).toUpperCase() +
                                            payout.status.slice(1)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            <DollarSign className="mx-auto mb-4 h-12 w-12" />
                            <h3 className="mb-2 font-semibold">No payouts yet</h3>
                            <p>Payouts will appear here once you start earning</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
