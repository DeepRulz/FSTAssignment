import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-xs text-muted-foreground">The requested page could not be found.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
