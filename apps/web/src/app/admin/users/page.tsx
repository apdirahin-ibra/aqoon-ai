"use client";

import {
    Ban,
    Loader2,
    MoreHorizontal,
    Search,
    Shield,
    ShieldCheck,
    User,
    Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: "student" | "tutor" | "admin";
    status: "active" | "suspended";
    createdAt: string;
    coursesCount: number;
}

const mockUsers: UserRecord[] = [
    {
        id: "1",
        name: "Ahmed Hassan",
        email: "ahmed@example.com",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01",
        coursesCount: 0,
    },
    {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "tutor",
        status: "active",
        createdAt: "2024-01-05",
        coursesCount: 5,
    },
    {
        id: "3",
        name: "John Smith",
        email: "john@example.com",
        role: "student",
        status: "active",
        createdAt: "2024-01-10",
        coursesCount: 3,
    },
    {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        role: "student",
        status: "active",
        createdAt: "2024-01-12",
        coursesCount: 7,
    },
    {
        id: "5",
        name: "Michael Chen",
        email: "michael@example.com",
        role: "tutor",
        status: "active",
        createdAt: "2024-01-15",
        coursesCount: 3,
    },
    {
        id: "6",
        name: "David Kim",
        email: "david@example.com",
        role: "student",
        status: "suspended",
        createdAt: "2024-01-20",
        coursesCount: 1,
    },
];

export default function AdminUsersPage() {
    const [users] = useState<UserRecord[]>(mockUsers);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return (
                    <Badge className="bg-red-500/10 text-red-600">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                    </Badge>
                );
            case "tutor":
                return (
                    <Badge className="bg-blue-500/10 text-blue-600">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Tutor
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <User className="mr-1 h-3 w-3" />
                        Student
                    </Badge>
                );
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

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
                <h1 className="mb-2 font-bold font-display text-3xl">
                    User Management
                </h1>
                <p className="text-muted-foreground">
                    Manage users, roles, and account status
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="font-bold text-2xl">
                            {users.filter((u) => u.role === "student").length}
                        </p>
                        <p className="text-muted-foreground text-sm">Students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="font-bold text-2xl">
                            {users.filter((u) => u.role === "tutor").length}
                        </p>
                        <p className="text-muted-foreground text-sm">Tutors</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="font-bold text-2xl">
                            {users.filter((u) => u.role === "admin").length}
                        </p>
                        <p className="text-muted-foreground text-sm">Admins</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        User
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Courses
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-xs">
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                        <td className="px-6 py-4">
                                            {user.status === "active" ? (
                                                <Badge className="bg-green-500/10 text-green-600">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-600">
                                                    <Ban className="mr-1 h-3 w-3" />
                                                    Suspended
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {user.coursesCount}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">No users found</h3>
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
