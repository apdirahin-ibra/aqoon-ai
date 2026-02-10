export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
			<div className="fade-in slide-in-from-bottom-4 w-full max-w-md animate-in space-y-8 duration-500">
				{children}
			</div>
		</div>
	);
}
