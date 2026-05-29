import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
  {
    variants: {
      variant: {
        default: "bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-950/15",
        outline:
          "border border-stone-300 bg-white text-slate-900 hover:border-stone-400 hover:bg-stone-50 hover:shadow-md hover:shadow-stone-950/10",
        ghost: "shadow-none text-slate-700 hover:bg-stone-100 hover:text-slate-950 hover:shadow-sm",
        secondary: "bg-stone-100 text-slate-900 hover:bg-stone-200 hover:shadow-md hover:shadow-stone-950/10",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-950/15",
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
