"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps {
  className?: string;
  value?: number | null;
}

const Progress = React.forwardRef(
  (props: ProgressProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { className, value } = props;

    // Handle null/undefined values and ensure value is between 0 and 100
    const safeValue = React.useMemo(() => {
      const val = value ?? 0;
      return Math.min(Math.max(val, 0), 100);
    }, [value]);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
) as React.ForwardRefExoticComponent<ProgressProps> & { displayName: string };

Progress.displayName = "Progress";

export { Progress };
