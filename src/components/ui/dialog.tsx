"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { XIcon } from "lucide-react";

import { cn } from "~/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

// Drag handle component (mobile only)
function DragHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto mb-2 h-1 w-12 rounded-full bg-muted-foreground/30 sm:hidden",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const dragY = useTransform(y, (value) => Math.max(0, value));

  // Calculate overlay opacity based on drag distance for visual feedback
  // Using transform for smooth, performant updates without re-renders
  const overlayOpacity = useTransform(dragY, (value) => {
    if (!isMobile || !isDragging) return 1;
    const maxDrag = 200; // Maximum drag distance for full fade
    return Math.max(0.3, 1 - value / maxDrag);
  });

  // Track overlay opacity for style updates
  const [currentOpacity, setCurrentOpacity] = React.useState(1);
  useMotionValueEvent(overlayOpacity, "change", (latest) => {
    setCurrentOpacity(latest);
  });

  // Detect mobile breakpoint
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dialog by clicking the close button (works with Radix Dialog)
  const handleClose = React.useCallback(() => {
    const closeButton = contentRef.current?.querySelector(
      '[data-slot="dialog-close"]',
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    } else {
      // Fallback: dispatch escape key event
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        bubbles: true,
      });
      document.dispatchEvent(escapeEvent);
    }
  }, []);

  const handleDragStart = React.useCallback(() => {
    if (isMobile) {
      setIsDragging(true);
    }
  }, [isMobile]);

  const handleDrag = React.useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Update motion value with drag offset for smooth visual feedback
      // This ensures the position and opacity update in real-time as the user drags
      if (isMobile) {
        // Only track downward drags (positive offset)
        const offset = Math.max(0, info.offset.y);
        y.set(offset);
      }
    },
    [isMobile, y],
  );

  const handleDragEnd = React.useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!isMobile) return;

      const threshold = 100; // pixels
      const velocityThreshold = 500; // velocity threshold

      // Close if dragged down past threshold or with sufficient velocity
      if (
        info.offset.y > threshold ||
        (info.offset.y > 50 && info.velocity.y > velocityThreshold)
      ) {
        handleClose();
      } else {
        // Snap back to original position
        y.set(0);
      }

      // Reset drag state
      setIsDragging(false);
    },
    [handleClose, isMobile, y],
  );

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay
        style={{
          opacity: isDragging ? currentOpacity : undefined,
        }}
        className={isDragging ? "transition-opacity duration-75" : ""}
      />
      <motion.div
        ref={contentRef}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          y,
          touchAction: isMobile ? "pan-y" : "auto",
        }}
        animate={!isDragging ? { y: 0 } : undefined}
        transition={
          !isDragging
            ? { type: "spring", damping: 30, stiffness: 300 }
            : { duration: 0 }
        }
        className="sm:pointer-events-none"
      >
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            // Mobile: Bottom drawer
            "fixed right-0 bottom-0 left-0 z-50 grid max-h-[90vh] w-full gap-4 overflow-y-auto rounded-t-lg border-t border-r border-l bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom",
            // Desktop: Centered dialog
            "sm:top-[50%] sm:right-auto sm:bottom-auto sm:left-[50%] sm:max-h-[85vh] sm:w-full sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border sm:pb-6 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
            className,
          )}
          {...props}
        >
          <div className="sticky top-0 right-0 left-0 isolate grid place-items-center bg-linear-to-b from-background py-4">
            <DragHandle />
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </div>
          <div className="p-5 md:p-6">{children}</div>
        </DialogPrimitive.Content>
      </motion.div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
