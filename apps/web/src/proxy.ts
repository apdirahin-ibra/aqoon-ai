import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/student", "/tutor", "/admin"];
const authPaths = ["/signin", "/signup"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Better Auth stores session in this cookie
	const sessionToken =
		request.cookies.get("better-auth.session_token")?.value ||
		request.cookies.get("__Secure-better-auth.session_token")?.value;

	const isLoggedIn = !!sessionToken;

	// Redirect unauthenticated users away from protected routes
	if (protectedPaths.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	// Redirect authenticated users away from auth pages
	if (authPaths.some((p) => pathname === p) && isLoggedIn) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
