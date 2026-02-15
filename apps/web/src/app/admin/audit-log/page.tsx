"use client";

import {
    ClipboardList,
    Filter,
    Loader2,
    Search,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AuditEntry {
    id: string;
    action: string;
    actor: string;
    actorRole: "admin" | "tutor" | "student" | "system";
    target: string;
    details: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
}

const mockAuditLog: AuditEntry[] = [
    {
        id: "1",
        action: "user.role.changed",
        actor: "Ahmed Hassan",
        actorRole: "admin",
        target: "Sarah Johnson",
        details: "Changed role from student to tutor",
        timestamp: "2024-02-10T14:30:00Z",
        severity: "warning",
    },
    {
        id: "2",
        action: "course.published",
        actor: "Sarah Johnson",
        actorRole: "tutor",
        target: "Introduction to Python",
        details: "Course published and made visible to students",
        timestamp: "2024-02-10T12:15:00Z",
        severity: "info",
    },
    {
        id: "3",
        action: "user.suspended",
        actor: "Ahmed Hassan",
        actorRole: "admin",
        target: "David Kim",
        details: "Account suspended for policy violation",
        timestamp: "2024-02-09T18:45:00Z",
        severity: "critical",
    },
    {
        id: "4",
        action: "course.deleted",
        actor: "Michael Chen",
        actorRole: "tutor",
        target: "Old Draft Course",
        details: "Draft course permanently deleted",
        timestamp: "2024-02-09T10:20:00Z",
        severity: "warning",
    },
    {
        id: "5",
        action: "payment.processed",
        actor: "System",
        actorRole: "system",
        target: "Order #12345",
        details: "Payment of $79.99 processed successfully",
        timestamp: "2024-02-08T16:00:00Z",
        severity: "info",
    },
    {
        id: "6",
        action: "user.registered",
        actor: "System",
        actorRole: "system",
        target: "Emily Rodriguez",
        details: "New user registered via Google OAuth",
        timestamp: "2024-02-08T09:30:00Z",
        severity: "info",
    },
    {
        id: "7",
        action: "course.price.changed",
        actor: "Sarah Johnson",
        actorRole: "tutor",
        target: "Advanced React",
        details: "Price changed from $49.99 to $79.99",
        timestamp: "2024-02-07T14:10:00Z",
        severity: "warning",
    },
    {
        id: "8",
        action: "payout.requested",
        actor: "Michael Chen",
        actorRole: "tutor",
        target: "Payout #789",
        details: "Payout of $312.00 requested via bank transfer",
        timestamp: "2024-02-07T11:00:00Z",
        severity: "info",
    },
];

export default function AdminAuditLogPage() {
    const [entries] = useState<AuditEntry[]>(mockAuditLog);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [severityFilter, setSeverityFilter] = useState("all");

    const filteredEntries = entries.filter((entry) => {
        const matchesSearch =
            entry.action.toLowerCase().includes(search.toLowerCase()) ||
            entry.actor.toLowerCase().includes(search.toLowerCase()) ||
            entry.target.toLowerCase().includes(search.toLowerCase()) ||
            entry.details.toLowerCase().includes(search.toLowerCase());
        const matchesSeverity =
            severityFilter === "all" || entry.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "critical":
                return <Badge className="bg-red-500/10 text-red-600">Critical</Badge>;
            case "warning":
                return (
                    <Badge className="bg-amber-500/10 text-amber-600">Warning</Badge>
                );
            default:
                return <Badge className="bg-blue-500/10 text-blue-600">Info</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return (
                    <Badge variant="outline" className="text-xs">
                        Admin
                    </Badge>
                );
            case "tutor":
                return (
                    <Badge variant="outline" className="text-xs">
                        Tutor
                    </Badge>
                );
            case "system":
                return (
                    <Badge variant="outline" className="text-xs">
                        System
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-xs">
                        Student
                    </Badge>
                );
        }
    };

    const formatTimestamp = (ts: string) => {
        const date = new Date(ts);
        return {
            date: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
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
            <div className="mb-8">
                <h1 className="mb-2 font-bold font-display text-3xl">Audit Log</h1>
                <p className="text-muted-foreground">
                    Track all platform activities and changes
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search actions, actors, targets..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Log Entries */}
            <Card>
                <CardContent className="p-0">
                    {filteredEntries.length > 0 ? (
                        <div className="divide-y">
                            {filteredEntries.map((entry) => {
                                const { date, time } = formatTimestamp(entry.timestamp);
                                return (
                                    <div
                                        key={entry.id}
                                        className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {getSeverityBadge(entry.severity)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                                    {entry.action}
                                                </code>
                                                {getRoleBadge(entry.actorRole)}
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">{entry.actor}</span>
                                                {" → "}
                                                <span className="text-muted-foreground">
                                                    {entry.target}
                                                </span>
                                            </p>
                                            <p className="mt-1 text-muted-foreground text-xs">
                                                {entry.details}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-muted-foreground text-xs">{date}</p>
                                            <p className="text-muted-foreground text-xs">{time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">No entries found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
