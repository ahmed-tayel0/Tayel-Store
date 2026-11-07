"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange?.(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AlertDialogTriggerProps {
  children: React.ReactElement;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export function AlertDialogTrigger({
  children,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  variant = "default",
}: AlertDialogTriggerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setOpen(true),
      })}
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        variant={variant}
      />
    </>
  );
}