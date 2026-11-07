import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl",
        "bg-transparent",
        "border border-white/10",
        "px-4 py-2.5 text-base",
        "text-foreground",
        "placeholder:text-foreground-muted/50",
        "transition-all duration-200 ease-out",
        "outline-none",
        "selection:bg-primary selection:text-background",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
        "aria-invalid:border-error aria-invalid:ring-error/30",
        "hover:border-white/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }