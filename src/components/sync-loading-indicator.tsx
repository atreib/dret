import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function SyncLoadingIndicator({
  message = "Syncing changes...",
  className,
  ...props
}: LoadingIndicatorProps) {
  return (
    <div
      className={cn(
        "absolute top-2 left-2 z-10 flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 text-sm text-muted-foreground backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
      {message}
    </div>
  );
}
