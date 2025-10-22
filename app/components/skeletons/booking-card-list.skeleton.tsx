import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export function BookingCardListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <Card
          key={index}
          className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar>
              <Skeleton className="h-10 w-10 rounded-full" />
            </Avatar>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                <Skeleton className="h-6 w-32" />
              </h3>
              <div className="text-sm text-gray-500">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="flex flex-col text-sm text-gray-600 space-y-1">
              <span>
                <Skeleton className="h-4 w-40" />
              </span>
              <span>
                <Skeleton className="h-4 w-24" />
              </span>
              <span>
                <Skeleton className="h-4 w-32" />
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
