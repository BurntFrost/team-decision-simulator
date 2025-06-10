import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-2xl backdrop-blur-sm border border-white/20",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-2xl backdrop-blur-sm border border-white/20",
        outline:
          "glass border-white/30 text-gray-700 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-lg",
        secondary:
          "bg-white/10 backdrop-blur-md text-gray-700 border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-lg",
        ghost:
          "text-gray-700 hover:bg-white/10 hover:backdrop-blur-sm rounded-2xl transition-all duration-300",
        link: "text-blue-600 underline-offset-4 hover:underline",
        glass:
          "glass-strong text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-xl",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4",
        sm: "h-10 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-2xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-12 rounded-2xl",
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
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
