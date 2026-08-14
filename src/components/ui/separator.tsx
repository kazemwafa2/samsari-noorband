import * as React from "react";

interface SeparatorProps
extends React.HTMLAttributes<HTMLDivElement> {}

export function Separator({
  className = "",
  ...props
}: SeparatorProps) {
  return (
    <div
      className={
        `h-px w-full bg-gray-200 dark:bg-gray-700 ${className}`
      }
      {...props}
    />
  );
}
