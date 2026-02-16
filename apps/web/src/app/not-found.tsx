import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mb-8">
                <h1 className="mb-2 font-bold font-display text-8xl text-primary md:text-9xl">
                    404
                </h1>
                <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-primary/30" />
            </div>

            <h2 className="mb-4 font-bold font-display text-2xl md:text-3xl">
                Page Not Found
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Sorry, the page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/courses">
                        <Search className="mr-2 h-4 w-4" />
                        Browse Courses
                    </Link>
                </Button>
            </div>
        </div>
    );
}
