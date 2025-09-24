import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        primary:
          "bg-blue-600 text-white shadow-xs hover:bg-blue-700 focus-visible:ring-blue-200",
        success:
          "bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-200",
        danger:
          "bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-200",
        warning:
          "bg-amber-500 text-white shadow-xs hover:bg-amber-600 focus-visible:ring-amber-200",
        info:
          "bg-sky-500 text-white shadow-xs hover:bg-sky-600 focus-visible:ring-sky-200",
        light:
          "bg-gray-100 text-gray-800 shadow-xs hover:bg-gray-200 focus-visible:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        dark:
          "bg-gray-800 text-white shadow-xs hover:bg-gray-900 focus-visible:ring-gray-500",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        'outline-primary':
          "border border-blue-600 text-blue-600 bg-transparent shadow-xs hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20",
        'outline-success':
          "border border-green-600 text-green-600 bg-transparent shadow-xs hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20",
        'outline-danger':
          "border border-red-600 text-red-600 bg-transparent shadow-xs hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20",
        'outline-warning':
          "border border-amber-500 text-amber-500 bg-transparent shadow-xs hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20",
        'outline-info':
          "border border-sky-500 text-sky-500 bg-transparent shadow-xs hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-900/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 text-base has-[>svg]:px-6",
        icon: "size-9",
      },
      isBlock: {
        true: "w-full justify-center",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isBlock: false,
      isDisabled: false,
      isLoading: false,
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isBlock?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  isBlock,
  isDisabled,
  isLoading,
  leftIcon,
  rightIcon,
  loadingText,
  asChild = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  const disabled = isDisabled || isLoading || props.disabled;
  
  // Jika asChild true, kita tidak bisa menggunakan Fragment atau wrapper tambahan
  // karena Slot hanya menerima satu child
  if (asChild) {
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, isBlock, isDisabled, isLoading, className })
        )}
        ref={ref}
        disabled={disabled}
        data-slot="button"
        {...props}
      >
        {children}
      </Comp>
    );
  }
  
  // Jika bukan asChild, kita bisa menggunakan button biasa dengan semua fitur
  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, isBlock, isDisabled, isLoading, className })
      )}
      ref={ref}
      disabled={disabled}
      data-slot="button"
      {...props}
    >
      {isLoading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        </div>
      )}
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {isLoading && loadingText ? loadingText : children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
