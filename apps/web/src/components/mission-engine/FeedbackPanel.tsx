"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@mindorbit/ui";

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation?: string | null;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function FeedbackPanel({
  isCorrect,
  explanation,
  onRetry,
  showRetry = false,
  className,
}: FeedbackPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 transition-all duration-300",
        isCorrect
          ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
          : "border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XCircle className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400" />
        )}
        <div className="flex-1 space-y-2">
          <p
            className={cn(
              "font-medium",
              isCorrect ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200"
            )}
          >
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          {explanation && (
            <p className="text-sm text-muted-foreground">{explanation}</p>
          )}
          {showRetry && !isCorrect && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <AlertCircle className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
