import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

const protectedPaths = ["/student", "/tutor", "/admin"];
const authPaths = ["/auth"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const authenticated = await isAuthenticated();

	// Redirect unauthenticated users away from protected routes
	if (
		protectedPaths.some((p) => pathname.startsWith(p)) &&
		!authenticated
	) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	// Redirect authenticated users away from auth pages
	if (authPaths.some((p) => pathname.startsWith(p)) && authenticated) {
		return NextResponse.redirect(new URL("/student", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
