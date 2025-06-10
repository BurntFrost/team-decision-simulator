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
        "glass rounded-2xl p-1.5 flex w-full items-center justify-start overflow-x-auto gap-1 md:inline-flex md:w-fit md:p-2 md:gap-2 lg:gap-3 lg:p-2.5",
        "bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg",
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
        "inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
        "text-gray-600 hover:text-gray-800 hover:bg-white/10",
        "data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/30",
        "focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "md:min-h-[44px] md:px-5 md:py-2 lg:px-7",
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
