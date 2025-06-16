"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "glass rounded-3xl p-2 flex w-full items-center justify-start overflow-x-auto gap-2 md:inline-flex md:w-fit md:p-2.5 md:gap-3 lg:gap-4 lg:p-3",
        "bg-gradient-to-r from-white/12 via-white/8 to-white/12 backdrop-blur-2xl border border-white/30 shadow-glass",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700",
        "gpu-accelerated smooth-60fps",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50",
        "text-gray-600 hover:text-gray-800 hover:bg-white/15 hover:backdrop-blur-lg hover:scale-[1.02] hover:-translate-y-0.5",
        "data-[state=active]:bg-gradient-to-br data-[state=active]:from-white/25 data-[state=active]:via-white/20 data-[state=active]:to-white/25",
        "data-[state=active]:text-gray-900 data-[state=active]:shadow-liquid data-[state=active]:backdrop-blur-xl",
        "data-[state=active]:border data-[state=active]:border-white/40 data-[state=active]:scale-[1.02] data-[state=active]:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "md:min-h-[48px] md:px-6 md:py-2.5 lg:px-8 lg:py-3",
        "relative overflow-hidden gpu-accelerated smooth-60fps touch-responsive",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "data-[state=active]:before:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
