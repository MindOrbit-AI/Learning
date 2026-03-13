"use client";

interface ObserveContent {
  visual?: string;
  description?: string;
}

interface ObserveSceneProps {
  content: ObserveContent;
}

export function ObserveScene({ content }: ObserveSceneProps) {
  return (
    <div className="space-y-4">
      {content.visual && (
        <div className="rounded-xl border bg-muted/30 p-6 text-center">
          <span className="text-4xl">{content.visual}</span>
        </div>
      )}
      {content.description && (
        <p className="text-muted-foreground">{content.description}</p>
      )}
    </div>
  );
}
