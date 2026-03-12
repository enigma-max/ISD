import { Skeleton } from "@/components/ui/skeleton";

const RestaurantCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-sm">
    <Skeleton className="w-full h-44 sm:h-48 rounded-none" />
    <div className="p-3 sm:p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default RestaurantCardSkeleton;
