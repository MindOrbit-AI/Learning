"use client";

import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";

export function ResourceActions({
  resourceId,
  isLiked,
  isSaved,
  likeCount,
  saveCount,
}: {
  resourceId: string;
  isLiked: boolean;
  isSaved: boolean;
  likeCount: number;
  saveCount: number;
}) {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likes, setLikes] = useState(likeCount);
  const [saves, setSaves] = useState(saveCount);

  async function toggleLike() {
    const res = await fetch(`/api/resources/${resourceId}/like`, {
      method: liked ? "DELETE" : "POST",
    });
    if (res.ok) {
      setLiked(!liked);
      setLikes((l) => (liked ? l - 1 : l + 1));
    }
  }

  async function toggleSave() {
    const res = await fetch(`/api/resources/${resourceId}/save`, {
      method: saved ? "DELETE" : "POST",
    });
    if (res.ok) {
      setSaved(!saved);
      setSaves((s) => (saved ? s - 1 : s + 1));
    }
  }

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={toggleLike}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
          liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </button>
      <button
        type="button"
        onClick={toggleSave}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
          saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        <span>{saves}</span>
      </button>
    </div>
  );
}
