"use client";

import { Bell, Camera, Loader2, Shield, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
	const [loading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [fullName, setFullName] = useState("John Doe");
	const [bio, setBio] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [changingPassword, setChangingPassword] = useState(false);
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [courseUpdates, setCourseUpdates] = useState(true);
	const [marketingEmails, setMarketingEmails] = useState(false);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setTimeout(() => setSaving(false), 1000);
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		if (newPassword.length < 6) {
			alert("Password must be at least 6 characters");
			return;
		}
		setChangingPassword(true);
		setTimeout(() => {
			setChangingPassword(false);
			setNewPassword("");
			setConfirmPassword("");
			alert("Password changed successfully");
		}, 1000);
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
				<h1 className="font-bold font-display text-3xl">Profile & Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs
				defaultValue="profile"
				orientation="horizontal"
				className="flex w-full flex-col space-y-6"
			>
				<TabsList className="inline-flex h-auto w-auto bg-muted/50 p-1">
					<TabsTrigger value="profile" className="px-4 py-2">
						<User className="mr-2 h-4 w-4" />
						Profile
					</TabsTrigger>
					<TabsTrigger value="security" className="px-4 py-2">
						<Shield className="mr-2 h-4 w-4" />
						Security
					</TabsTrigger>
					<TabsTrigger value="notifications" className="px-4 py-2">
						<Bell className="mr-2 h-4 w-4" />
						Notifications
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="w-full">
					<div className="grid gap-6 md:grid-cols-2">
						<Card className="md:col-span-2 lg:col-span-1">
							<CardHeader>
								<CardTitle>Profile Information</CardTitle>
								<CardDescription>
									Update your personal information
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleUpdateProfile} className="space-y-6">
									<div className="flex items-center gap-6">
										<div className="relative">
											<Avatar className="h-24 w-24">
												<AvatarFallback className="bg-primary text-2xl text-primary-foreground">
													{fullName?.charAt(0) || "U"}
												</AvatarFallback>
											</Avatar>
											<button
												type="button"
												className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
											>
												<Camera className="h-4 w-4" />
											</button>
										</div>
										<div>
											<h3 className="font-semibold">
												{fullName || "Your Name"}
											</h3>
											<p className="text-muted-foreground text-sm">
												student@example.com
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="fullName">Full Name</Label>
											<Input
												id="fullName"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												placeholder="Enter your full name"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value="student@example.com"
												disabled
												className="bg-muted"
											/>
										</div>
									</div>

									<Button type="submit" disabled={saving}>
										{saving && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Save Changes
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card className="md:col-span-2 lg:col-span-1">
							<CardHeader>
								<CardTitle>Bio</CardTitle>
								<CardDescription>Tell us about yourself</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									id="bio"
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder="Tell us about yourself..."
									rows={10}
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="security" className="w-full">
					<div className="grid gap-6 md:grid-cols-2">
						<Card className="md:col-span-2 lg:col-span-1">
							<CardHeader>
								<CardTitle>Change Password</CardTitle>
								<CardDescription>
									Update your password to keep your account secure
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleChangePassword} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="newPassword">New Password</Label>
										<Input
											id="newPassword"
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="••••••••"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="confirmPassword">
											Confirm New Password
										</Label>
										<Input
											id="confirmPassword"
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="••••••••"
										/>
									</div>

									<Button type="submit" disabled={changingPassword}>
										{changingPassword && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Update Password
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card className="md:col-span-2 lg:col-span-1">
							<CardHeader>
								<CardTitle>Connected Accounts</CardTitle>
								<CardDescription>
									Manage your connected social accounts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between rounded-lg border border-border p-4">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
											<svg className="h-5 w-5" viewBox="0 0 24 24">
												<path
													fill="#4285F4"
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
												/>
												<path
													fill="#34A853"
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												/>
												<path
													fill="#FBBC05"
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												/>
												<path
													fill="#EA4335"
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												/>
											</svg>
										</div>
										<div>
											<p className="font-medium">Google</p>
											<p className="text-muted-foreground text-sm">
												Not connected
											</p>
										</div>
									</div>
									<Button variant="outline" size="sm">
										Connect
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="notifications" className="w-full">
					<Card>
						<CardHeader>
							<CardTitle>Email Notifications</CardTitle>
							<CardDescription>
								Choose what emails you want to receive
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Learning Reminders</p>
									<p className="text-muted-foreground text-sm">
										Receive reminders to continue your courses
									</p>
								</div>
								<Switch
									checked={emailNotifications}
									onCheckedChange={setEmailNotifications}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Course Updates</p>
									<p className="text-muted-foreground text-sm">
										Get notified when courses you&apos;re enrolled in are
										updated
									</p>
								</div>
								<Switch
									checked={courseUpdates}
									onCheckedChange={setCourseUpdates}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Marketing Emails</p>
									<p className="text-muted-foreground text-sm">
										Receive news about new courses and special offers
									</p>
								</div>
								<Switch
									checked={marketingEmails}
									onCheckedChange={setMarketingEmails}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
