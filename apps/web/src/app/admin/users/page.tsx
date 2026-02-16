"use client";

import { MoreHorizontal, Search, Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  joinedAt: string;
  coursesCount: number;
  status: "active" | "suspended";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    role: "student",
    joinedAt: "2024-01-15",
    coursesCount: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Sara Ali",
    email: "sara@example.com",
    role: "tutor",
    joinedAt: "2024-01-10",
    coursesCount: 3,
    status: "active",
  },
  {
    id: "3",
    name: "Mohamed Yusuf",
    email: "mohamed@example.com",
    role: "tutor",
    joinedAt: "2024-01-20",
    coursesCount: 7,
    status: "active",
  },
  {
    id: "4",
    name: "Fatima Omar",
    email: "fatima@example.com",
    role: "student",
    joinedAt: "2024-02-01",
    coursesCount: 2,
    status: "active",
  },
  {
    id: "5",
    name: "Ibrahim Nur",
    email: "ibrahim@example.com",
    role: "admin",
    joinedAt: "2023-12-01",
    coursesCount: 0,
    status: "active",
  },
  {
    id: "6",
    name: "Khadija Abdi",
    email: "khadija@example.com",
    role: "student",
    joinedAt: "2024-02-10",
    coursesCount: 1,
    status: "suspended",
  },
];

const roleColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-500",
  tutor: "bg-green-500/10 text-green-500",
  admin: "bg-red-500/10 text-red-500",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const changeRole = (userId: string, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === "active" ? "suspended" : "active",
            }
          : u,
      ),
    );
  };

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
          <h1 className="mb-2 font-bold font-display text-3xl">Manage Users</h1>
          <p className="text-muted-foreground">{users.length} users total</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role] || ""}>
                      <Shield className="mr-1 h-3 w-3" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.joinedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.coursesCount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => changeRole(user.id, "student")}
                        >
                          Set as Student
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeRole(user.id, "tutor")}
                        >
                          Set as Tutor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeRole(user.id, "admin")}
                        >
                          Set as Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleStatus(user.id)}
                          className={
                            user.status === "active"
                              ? "text-destructive"
                              : "text-green-500"
                          }
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No users found
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
