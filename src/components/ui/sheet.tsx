"use client"

import * as React from "react"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { motion } from "framer-motion"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ..._props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  // Only support right side for mobile menu - force physical right positioning
  const isRight = side === "right"

  return (
    <SheetPortal>
      {/* Overlay with Framer Motion animation */}
      <SheetOverlay />

      {/* Sliding Panel - Force LTR for physical animation coordinates */}
      <motion.div
        initial={{ x: isRight ? "100%" : "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: isRight ? "100%" : "-100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={cn(
          "fixed top-0 z-50 flex flex-col gap-4 bg-background shadow-lg",
          isRight && "right-0 h-full w-full sm:w-80 border-l",
          !isRight && "left-0 h-full w-full sm:w-80 border-r",
          className
        )}
        dir="ltr"
      >
        {/* Inner wrapper with RTL for proper text alignment in Arabic */}
        <div dir="rtl" className="flex-1 flex flex-col overflow-y-auto">
          {/* Radix primitive for accessibility & focus management */}
          <SheetPrimitive.Content
            data-slot="sheet-content"
            forceMount
            className="flex-1 flex flex-col"
            {...props}
          >
            {children}
            {showCloseButton && (
              <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </SheetPrimitive.Content>
        </div>
      </motion.div>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}