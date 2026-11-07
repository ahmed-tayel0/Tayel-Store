import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-r from-primary via-primary-hover to-primary
          text-background
          hover:from-primary-hover hover:via-primary hover:to-primary-light
          focus-visible:ring-primary/50 focus-visible:ring-offset-background
          shadow-lg shadow-primary/25
          hover:shadow-xl hover:shadow-primary/40
        `,
        destructive: `
          bg-gradient-to-r from-error via-red-600 to-error
          text-background
          hover:from-red-600 hover:via-error hover:to-red-400
          focus-visible:ring-error/50 focus-visible:ring-offset-background
          shadow-lg shadow-error/25
        `,
        outline: `
          bg-transparent
          border border-white/10
          text-foreground
          hover:bg-white/5
          hover:border-primary/50
          focus-visible:ring-primary/50 focus-visible:ring-offset-background
        `,
        secondary: `
          bg-surface-elevated
          text-foreground
          border border-white/10
          hover:bg-white/5
          hover:border-white/20
          focus-visible:ring-primary/50 focus-visible:ring-offset-background
        `,
        ghost: `
          text-foreground-muted
          hover:text-foreground
          hover:bg-white/5
          focus-visible:ring-primary/50 focus-visible:ring-offset-background
        `,
        link: `
          text-primary underline-offset-4 hover:underline
          focus-visible:ring-primary/50 focus-visible:ring-offset-background
        `,
      },
      size: {
        default: "h-10 px-5 has-[>svg]:px-4",
        xs: "h-7 gap-1.5 rounded-lg px-3 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-2 rounded-lg px-4 has-[>svg]:px-3",
        lg: "h-11 rounded-xl px-7 has-[>svg]:px-5 text-lg",
        xl: "h-12 rounded-2xl px-8 has-[>svg]:px-6 text-xl",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }