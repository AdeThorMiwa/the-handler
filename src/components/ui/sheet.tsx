import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: VoidFunction;
  children: React.ReactNode;
}

function Sheet({ open, onClose, children }: SheetProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="sheet-panel"
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 320,
              mass: 0.8,
            }}
            className={cn(
              "fixed right-0 top-0 bottom-0 z-50",
              "w-[60%] min-w-105 max-w-225",
              "bg-background border-l border-border shadow-2xl",
              "flex flex-col overflow-hidden",
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── SheetClose button ─────────────────────────────────────────────────────────

interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ className, onClose, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onClose?.();
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-md h-7 w-7",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  ),
);
SheetClose.displayName = "SheetClose";

// ── SheetHeader ───────────────────────────────────────────────────────────────

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-border shrink-0",
        className,
      )}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

// ── SheetTitle ────────────────────────────────────────────────────────────────

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight text-foreground",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

// ── SheetDescription ──────────────────────────────────────────────────────────

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-0.5", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ── SheetContent (scrollable body) ───────────────────────────────────────────

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto px-6 py-5", className)}
    {...props}
  />
));
SheetContent.displayName = "SheetContent";

// ── SheetFooter ───────────────────────────────────────────────────────────────

function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0",
        className,
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

// ── SheetSection (with optional side-tab highlight) ───────────────────────────

interface SheetSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  highlighted?: boolean;
  accentColor?: "purple" | "indigo" | "emerald" | "amber";
}

function SheetSection({
  className,
  highlighted = false,
  accentColor = "purple",
  ...props
}: SheetSectionProps) {
  const accentMap: Record<string, string> = {
    purple: "border-purple-500",
    indigo: "border-indigo-500",
    emerald: "border-emerald-500",
    amber: "border-amber-500",
  };

  return (
    <div
      className={cn(
        highlighted && [
          "border-l-4 pl-4 rounded-r-md bg-slate-50/70 py-3 pr-3",
          accentMap[accentColor],
        ],
        className,
      )}
      {...props}
    />
  );
}
SheetSection.displayName = "SheetSection";

export {
  Sheet,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
  SheetSection,
};
