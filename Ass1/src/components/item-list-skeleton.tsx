export function ItemListSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-3 animate-pulse shadow-sm">
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-10 bg-muted rounded w-full" />
      <div className="h-10 bg-muted rounded w-full" />
    </div>
  );
}
