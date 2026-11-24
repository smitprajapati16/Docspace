import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary text-foreground-secondary border border-border",
        outline: "border border-border text-foreground-secondary bg-transparent",
        owner: "bg-[#EAEBE6] text-[#344B40] font-semibold",
        editor: "bg-[#E9EFEA] text-[#294B38] font-semibold",
        viewer: "bg-surface-secondary text-foreground-secondary border border-border",
        success: "bg-[#EBF3EE] text-success",
        danger: "bg-[#FAECEB] text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
