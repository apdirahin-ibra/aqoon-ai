import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { redirect } from "next/navigation";
import {
	fetchAuthMutation,
	fetchAuthQuery,
	isAuthenticated,
} from "@/lib/auth-server";

export default async function DashboardRedirectPage() {
	const authed = await isAuthenticated();
	if (!authed) {
		redirect("/signin");
	}

	let user = await fetchAuthQuery(api.users.current);

	if (!user) {
		try {
			const authUser = await fetchAuthQuery(api.auth.getCurrentUser);
			if (authUser) {
				await fetchAuthMutation(api.users.syncFromAuth, {
					email: authUser.email,
					name: authUser.name || authUser.email.split("@")[0],
					image: authUser.image ?? undefined,
				});
				user = await fetchAuthQuery(api.users.current);
			}
		} catch {}
	}

	if (user?.role === "admin") redirect("/admin");
	if (user?.role === "tutor") redirect("/tutor");
	redirect("/student");
}
