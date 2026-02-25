import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Skeleton className="h-8 w-48" />
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={`stat-${i}`} className="h-32 rounded-xl" />
				))}
			</div>
			<Skeleton className="h-96 rounded-xl" />
		</div>
	);
}
