import { Skeleton } from "../ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
    </div>
  );
}
