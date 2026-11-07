'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Native select implementation that mimics Radix UI Select API
// Select - the root component, renders a native <select>
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    // Filter out Radix-specific props that native select doesn't understand
    const { onValueChange, ...nativeProps } = props as any;

    // Extract options from children (SelectContent > SelectItem)
    const options: React.ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === SelectContent) {
          React.Children.forEach(child.props.children, (item) => {
            if (React.isValidElement(item) && item.type === SelectItem) {
              options.push(item);
            }
          });
        }
      }
    });

    return (
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full appearance-none items-center justify-between rounded-md border bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          'border-white/10 hover:border-primary/50 focus:border-primary',
          className
        )}
        {...nativeProps}
      >
        {options.length > 0 ? options : children}
      </select>
    );
  }
);
Select.displayName = 'Select';

// SelectTrigger - renders nothing (native select doesn't need a trigger button)
const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    // For native select, we don't render a trigger - the select itself is the trigger
    // But we need to return something valid, so we return null
    return null;
  }
);
SelectTrigger.displayName = 'SelectTrigger';

// SelectValue - renders nothing (native select shows selected option automatically)
const SelectValue = ({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) => {
  return null;
};

// SelectContent - acts as a wrapper for SelectItem, doesn't render anything itself
const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// SelectItem - renders an <option>
const SelectItem = ({ value, children, disabled }: { value: string; children: React.ReactNode; disabled?: boolean }) => {
  return <option value={value} disabled={disabled}>{children}</option>;
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};