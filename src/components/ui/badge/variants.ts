import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        muted: "border-transparent bg-muted text-muted-foreground",
        success:
          "border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning:
          "border-transparent bg-amber-50 text-amber-700 border border-amber-200",
        danger:
          "border-transparent bg-rose-50 text-rose-700 border border-rose-200",
        purple:
          "border-transparent bg-purple-50 text-purple-700 border border-purple-200",
        "coming-soon":
          "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
