"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-white/20 shadow-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      "bg-white/5 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-primary",
        "data-[state=checked]:animate-in data-[state=checked]:zoom-in-95 data-[state=unchecked]:animate-out data-[state=unchecked]:zoom-out-95",
        "data-[state=indeterminate]:animate-in data-[state=indeterminate]:zoom-in-95"
      )}
    >
      <Check className="size-3.5" aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }