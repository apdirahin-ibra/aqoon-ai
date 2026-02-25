"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
	const router = useRouter();
	const user = useQuery(api.users.current);

	const getInitials = (name?: string | null) => {
		if (!name) return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1.5 transition-all hover:border-border hover:bg-muted/60 focus:outline-none">
				<Avatar size="sm" className="ring-2 ring-primary/20">
					{user?.image && <AvatarImage src={user.image} />}
					<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-[10px] text-primary">
						{getInitials(user?.name)}
					</AvatarFallback>
				</Avatar>
				<span className="hidden font-medium text-[13px] text-foreground sm:inline-block">
					{user?.name || "Account"}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="w-60 rounded-xl border border-border/80 bg-card p-1.5 shadow-xl"
			>
				{/* User info header */}
				<div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-3">
					<Avatar size="default" className="shrink-0 ring-2 ring-primary/20">
						{user?.image && <AvatarImage src={user.image} />}
						<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-primary text-xs">
							{getInitials(user?.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="truncate font-semibold text-[13px] text-foreground leading-tight">
							{user?.name || "User"}
						</span>
						<span className="truncate text-[11px] text-muted-foreground leading-tight">
							{user?.email || ""}
						</span>
					</div>
				</div>
				<DropdownMenuSeparator className="my-1.5" />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="gap-2.5 rounded-lg px-3 py-2.5 font-medium text-[13px]"
						onSelect={() => router.push("/student/profile")}
					>
						<User className="h-4 w-4 text-muted-foreground" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2.5 rounded-lg px-3 py-2.5 font-medium text-[13px]"
						onSelect={() => router.push("/student/profile")}
					>
						<Settings className="h-4 w-4 text-muted-foreground" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="my-1.5" />
				<DropdownMenuItem
					variant="destructive"
					className="gap-2.5 rounded-lg px-3 py-2.5 font-medium text-[13px]"
					onSelect={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push("/signin");
								},
							},
						});
					}}
				>
					<LogOut className="h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
