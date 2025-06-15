import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "glass" | "floating" | "premium" | "interactive";
  animated?: boolean;
  shimmer?: boolean;
}

function Card({
  className,
  variant = "default",
  animated = false,
  shimmer = false,
  ...props
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const variantClasses = {
    default: "bg-white/8 backdrop-blur-xl border border-white/20 shadow-2xl",
    glass: "bg-white/12 backdrop-blur-2xl border border-white/30 shadow-3xl",
    floating: "bg-white/10 backdrop-blur-xl border border-white/25 shadow-2xl hover:shadow-4xl transform-gpu hover:-translate-y-1 hover:scale-[1.02]",
    premium: "bg-gradient-to-br from-white/15 via-white/10 to-white/8 backdrop-blur-2xl border border-white/40 shadow-3xl",
    interactive: "bg-white/8 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/35 hover:shadow-4xl cursor-pointer transform-gpu hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] active:translate-y-0",
  };

  return (
    <div
      data-slot="card"
      className={cn(
        "glass-card text-card-foreground flex flex-col gap-3 relative overflow-hidden md:gap-6",
        "transition-all duration-500 ease-out",
        variantClasses[variant],
        animated && "animate-glass-breathing",
        shimmer && "before:animate-glass-shimmer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/6 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/8 to-transparent pointer-events-none" />

      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-glass-shimmer" />
      )}

      {/* Interactive glow effect */}
      {isHovered && variant === "interactive" && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-500/10 to-cyan-400/10 pointer-events-none transition-opacity duration-300" />
      )}

      {/* Multiple border highlights for depth */}
      <div className="absolute inset-0 rounded-inherit border border-white/15 pointer-events-none" />
      <div className="absolute inset-[1px] rounded-inherit border border-white/8 pointer-events-none" />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 rounded-inherit opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col gap-3 md:gap-6 h-full">
        {props.children}
      </div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-3 md:gap-1.5 md:px-6 md:[.border-b]:pb-6 relative",
        "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 [.border-b]:before:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-none font-semibold text-gray-900 dark:text-white",
        "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-white",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm leading-relaxed",
        "text-gray-600 dark:text-gray-300",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-3 md:px-6 flex-1",
        "relative z-10",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-3 [.border-t]:pt-3 md:px-6 md:[.border-t]:pt-6",
        "relative z-10",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 [.border-t]:before:opacity-100",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
