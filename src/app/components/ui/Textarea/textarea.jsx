import * as React from "react";

import { cn } from "../Utilities/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex field-sizing-content min-h-20 w-full rounded-md border px-3 py-2 text-base",
        "bg-input-background border-input resize-none",
        "dark:bg-slate-800/50 dark:border-slate-700 dark:shadow-sm dark:shadow-black/30",
        "transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-input/80 dark:hover:border-slate-600 dark:hover:shadow-md dark:hover:shadow-black/40",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "dark:focus-visible:ring-primary/50 dark:focus-visible:shadow-lg dark:focus-visible:shadow-primary/20",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "md:text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };













