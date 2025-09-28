/* eslint-disable sort-keys */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center font-normal justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-[#F2F3F5] disabled:text-[#A8A8A7] [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white leading-[24px]",
        destructive:
          "bg-(--destructive) text-(--destructive-foreground) shadow-(--shadow-base) hover:(--bg-destructive)/90",
        outline:
          "border border-(--input) bg-(--background) shadow-(--shadow-base) hover:bg-(--accent) hover:text-(--accent-foreground)",
        secondary:
          "bg-[#E5F2FF] text-primary shadow-(--shadow-base) hover:bg-secondary/80",
        ghost: "hover:bg-(--accent) hover:text-(--accent-foreground)",
        link: "text-(--primary) underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[22px] py-3",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        large: "h-14 px-6 w-full rounded-lg font-bold [&_svg]:size-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
