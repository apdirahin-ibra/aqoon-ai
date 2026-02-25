"use client";

import { Loader2, Save, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TutorProfile {
	displayName: string;
	bio: string;
	specialties: string;
	website: string;
	linkedIn: string;
	twitter: string;
	avatarUrl: string;
}

export default function TutorProfilePage() {
	const [saving, setSaving] = useState(false);
	const [profile, setProfile] = useState<TutorProfile>({
		displayName: "Ahmed Hassan",
		bio: "Experienced software engineer and educator with 10+ years of industry experience. Passionate about making complex topics accessible to everyone.",
		specialties: "Python, Web Development, Data Science, Machine Learning",
		website: "https://ahmedhassan.dev",
		linkedIn: "https://linkedin.com/in/ahmedhassan",
		twitter: "@ahmedhassan",
		avatarUrl: "",
	});

	const handleSave = async () => {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 1000));
		setSaving(false);
	};

	return (
		<div className="container py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">
						Tutor Profile
					</h1>
					<p className="text-muted-foreground">
						Manage your public profile visible to students
					</p>
				</div>
				<Button onClick={handleSave} disabled={saving}>
					{saving ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Save className="mr-2 h-4 w-4" />
					)}
					Save Profile
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="displayName">Display Name</Label>
								<Input
									id="displayName"
									value={profile.displayName}
									onChange={(e) =>
										setProfile({ ...profile, displayName: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									rows={5}
									value={profile.bio}
									onChange={(e) =>
										setProfile({ ...profile, bio: e.target.value })
									}
									placeholder="Tell students about yourself..."
								/>
								<p className="text-muted-foreground text-xs">
									{profile.bio.length}/500 characters
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="specialties">Specialties</Label>
								<Input
									id="specialties"
									value={profile.specialties}
									onChange={(e) =>
										setProfile({ ...profile, specialties: e.target.value })
									}
									placeholder="e.g., Python, Machine Learning, Data Science"
								/>
								<p className="text-muted-foreground text-xs">
									Comma-separated list of your expertise areas
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Social Links</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input
									id="website"
									type="url"
									value={profile.website}
									onChange={(e) =>
										setProfile({ ...profile, website: e.target.value })
									}
									placeholder="https://yourwebsite.com"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="linkedin">LinkedIn</Label>
								<Input
									id="linkedin"
									type="url"
									value={profile.linkedIn}
									onChange={(e) =>
										setProfile({ ...profile, linkedIn: e.target.value })
									}
									placeholder="https://linkedin.com/in/yourprofile"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="twitter">Twitter / X</Label>
								<Input
									id="twitter"
									value={profile.twitter}
									onChange={(e) =>
										setProfile({ ...profile, twitter: e.target.value })
									}
									placeholder="@yourhandle"
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile Photo</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col items-center gap-4">
								<div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
									{profile.avatarUrl ? (
										<img
											src={profile.avatarUrl}
											alt="Avatar"
											className="h-full w-full rounded-full object-cover"
										/>
									) : (
										<User className="h-12 w-12 text-muted-foreground" />
									)}
								</div>
								<div className="w-full space-y-2">
									<Label htmlFor="avatar">Avatar URL</Label>
									<Input
										id="avatar"
										placeholder="https://example.com/photo.jpg"
										value={profile.avatarUrl}
										onChange={(e) =>
											setProfile({ ...profile, avatarUrl: e.target.value })
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Profile Preview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-center">
								<div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
									{profile.avatarUrl ? (
										<img
											src={profile.avatarUrl}
											alt="Avatar"
											className="h-full w-full rounded-full object-cover"
										/>
									) : (
										<User className="h-8 w-8 text-muted-foreground" />
									)}
								</div>
								<h3 className="font-bold text-lg">
									{profile.displayName || "Your Name"}
								</h3>
								<p className="mt-1 text-muted-foreground text-sm">
									{profile.specialties || "Your specialties"}
								</p>
								<p className="mt-3 text-sm">
									{profile.bio
										? profile.bio.slice(0, 100) +
											(profile.bio.length > 100 ? "..." : "")
										: "Your bio will appear here"}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
