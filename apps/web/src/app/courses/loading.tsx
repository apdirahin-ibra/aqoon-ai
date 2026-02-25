import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-10 w-64" />
			<Skeleton className="h-10 w-full max-w-md" />
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`course-${i}`} className="flex flex-col gap-3">
						<Skeleton className="aspect-video rounded-xl" />
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				))}
			</div>
		</div>
	);
}
