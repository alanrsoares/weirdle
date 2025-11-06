"use client";

import { useTheme } from "next-themes";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          success:
            "ring-2 ring-blue-600 text-blue-600 bg-blue-50 dark:ring-blue-500 dark:text-blue-500 dark:bg-blue-950/50",
          error:
            "ring-2 ring-red-600 text-red-600 bg-red-50 dark:ring-red-500 dark:text-red-500 dark:bg-red-950/50",
          info: "ring-2 ring-gray-600 text-gray-600 bg-gray-50 dark:ring-gray-500 dark:text-gray-500 dark:bg-gray-950/50",
          warning:
            "ring-2 ring-orange-600 text-orange-600 bg-orange-50 dark:ring-orange-500 dark:text-orange-500 dark:bg-orange-950/50",
          default:
            "ring-2 ring-indigo-600 text-indigo-600 bg-indigo-50 dark:ring-indigo-500 dark:text-indigo-500 dark:bg-indigo-950/50",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
