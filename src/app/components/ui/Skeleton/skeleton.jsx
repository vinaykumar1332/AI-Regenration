import { cn } from "../Utilities/utils";

function Skeleton(props) {
  const { className, ...rest } = props || {};

  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...rest}
    />
  );
}

export { Skeleton };













