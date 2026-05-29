import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
  {
    variants: {
      variant: {
        default: "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800",
        outline:
          "border border-stone-300 bg-white text-slate-900 shadow-sm hover:border-stone-400 hover:bg-stone-50",
        ghost: "text-slate-700 hover:bg-stone-100 hover:text-slate-950",
        secondary: "bg-stone-100 text-slate-900 hover:bg-stone-200",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children?: ReactNode;
  };

export function Button({
  asChild = false,
  children,
  className,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(buttonVariants({ className, size, variant }), child.props.className),
      ...props,
    });
  }

  return (
    <button
      type={type}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    >
      {children}
    </button>
  );
}
