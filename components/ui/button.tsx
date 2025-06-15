import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-500 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] relative overflow-hidden gpu-accelerated smooth-60fps",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 rounded-2xl backdrop-blur-sm border border-white/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        destructive:
          "bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 rounded-2xl backdrop-blur-sm border border-white/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        outline:
          "bg-white/8 backdrop-blur-md border-white/30 text-gray-700 hover:bg-white/15 hover:text-gray-900 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 rounded-2xl shadow-lg hover:shadow-xl border-2 hover:border-white/40 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        secondary:
          "bg-white/12 backdrop-blur-lg text-gray-700 border border-white/25 hover:bg-white/20 hover:text-gray-900 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 rounded-2xl shadow-lg hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        ghost:
          "text-gray-700 hover:bg-white/12 hover:backdrop-blur-md hover:text-gray-900 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 rounded-2xl transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 transition-colors duration-300",
        glass:
          "bg-white/15 backdrop-blur-xl text-white border border-white/40 hover:bg-white/25 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 rounded-2xl shadow-xl hover:shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        liquid:
          "bg-gradient-to-br from-blue-400/80 via-purple-500/80 to-cyan-400/80 backdrop-blur-xl text-white border border-white/50 hover:from-blue-500/90 hover:via-purple-600/90 hover:to-cyan-500/90 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.95] active:translate-y-0 rounded-3xl shadow-2xl hover:shadow-4xl animate-glass-breathing before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:via-transparent before:to-white/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700 after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4 text-sm font-medium",
        sm: "h-10 rounded-xl gap-1.5 px-4 has-[>svg]:px-3 text-xs font-medium",
        lg: "h-14 rounded-2xl px-8 has-[>svg]:px-6 text-base font-semibold",
        xl: "h-16 rounded-3xl px-10 has-[>svg]:px-8 text-lg font-semibold",
        icon: "size-12 rounded-2xl p-0",
        "icon-sm": "size-10 rounded-xl p-0",
        "icon-lg": "size-14 rounded-2xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant !== "link" && variant !== "ghost") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  }, [onClick, variant]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={asChild ? onClick : handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {!asChild && ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping gpu-accelerated"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Content with enhanced accessibility */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Subtle inner highlight for depth */}
      {variant !== "link" && variant !== "ghost" && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
