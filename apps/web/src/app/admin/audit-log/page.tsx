"use client";

import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: "auth" | "course" | "user" | "payment" | "system";
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: "Ahmed Hassan",
    action: "User Login",
    details: "Successful login from 192.168.1.1",
    category: "auth",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: "Sara Ali",
    action: "Course Published",
    details: 'Published "Web Development with React"',
    category: "course",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: "Ibrahim Nur",
    action: "Role Changed",
    details: "Changed role from Student to Tutor",
    category: "user",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: "System",
    action: "Backup Completed",
    details: "Automated daily backup completed successfully",
    category: "system",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    user: "Fatima Omar",
    action: "Payment Received",
    details: "$29.99 for Python Basics enrollment",
    category: "payment",
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user: "Mohamed Yusuf",
    action: "Course Deleted",
    details: 'Deleted draft course "Test Course"',
    category: "course",
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user: "Khadija Abdi",
    action: "Account Suspended",
    details: "User suspended for policy violation",
    category: "user",
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    user: "System",
    action: "SSL Certificate Renewed",
    details: "Auto-renewed SSL certificate for api.aqoon.ai",
    category: "system",
  },
  {
    id: "9",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: "Ahmed Hassan",
    action: "Failed Login Attempt",
    details: "3 failed login attempts from 10.0.0.1",
    category: "auth",
  },
  {
    id: "10",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    user: "Sara Ali",
    action: "Payout Processed",
    details: "$450.00 payout to tutor bank account",
    category: "payment",
  },
];

const categoryColors: Record<string, string> = {
  auth: "bg-blue-500/10 text-blue-500",
  course: "bg-green-500/10 text-green-500",
  user: "bg-purple-500/10 text-purple-500",
  payment: "bg-yellow-500/10 text-yellow-500",
  system: "bg-gray-500/10 text-gray-500",
};

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredLogs = mockAuditLog.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.details.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || entry.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">Audit Log</h1>
          <p className="text-muted-foreground">Track all platform activity</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                    {formatTime(entry.timestamp)}
                  </TableCell>
                  <TableCell className="font-medium">{entry.user}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[entry.category] || ""}>
                      {entry.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                    {entry.details}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No log entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
