import type { Metadata } from "next";

/** Matches `app/opengraph-image.tsx` dimensions. */
export const defaultOgImages: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [
  { url: "/opengraph-image", width: 1200, height: 630, alt: "MindOrbit Learn" },
];

export const defaultTwitterImages: NonNullable<Metadata["twitter"]>["images"] = [
  "/opengraph-image",
];
