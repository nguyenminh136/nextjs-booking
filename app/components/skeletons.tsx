import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function SectionCardSkeleton() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Skeleton className="h-4 w-12" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Skeleton className="h-4 w-12" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Skeleton className="h-4 w-12" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Skeleton className="h-4 w-12" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
