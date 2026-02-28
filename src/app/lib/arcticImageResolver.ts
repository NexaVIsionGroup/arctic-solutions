// ============================================================================
// SANITY IMAGE RESOLVER — handles both uploaded and external URL images
// ============================================================================
import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import { client } from "./sanityClient";

const builder = imageUrlBuilder(client);

interface ArcticImageData {
  useExternalUrl?: boolean;
  image?: {
    asset?: { _ref?: string; url?: string };
    hotspot?: { x: number; y: number; height: number; width: number };
    crop?: { top: number; bottom: number; left: number; right: number };
    alt?: string;
  };
  externalUrl?: string;
  alt?: string;
  objectFit?: string;
  objectPosition?: string;
  priority?: boolean;
}

interface ResolvedImage {
  src: string;
  alt: string;
  objectFit: string;
  objectPosition: string;
  priority: boolean;
  blurDataURL?: string;
}

/**
 * Resolves an arcticImage schema field into props for next/image or <img>
 */
export function resolveArcticImage(
  data: ArcticImageData | null | undefined,
  fallbackSrc = "",
  fallbackAlt = "Arctic Solutions"
): ResolvedImage {
  if (!data) {
    return {
      src: fallbackSrc,
      alt: fallbackAlt,
      objectFit: "cover",
      objectPosition: "center",
      priority: false,
    };
  }

  // External URL mode
  if (data.useExternalUrl && data.externalUrl) {
    return {
      src: data.externalUrl,
      alt: data.alt || fallbackAlt,
      objectFit: data.objectFit || "cover",
      objectPosition: data.objectPosition || "center",
      priority: data.priority || false,
    };
  }

  // Sanity uploaded image mode
  if (data.image?.asset?._ref) {
    const url = builder.image(data.image).auto("format").quality(85).url();
    return {
      src: url,
      alt: data.image.alt || fallbackAlt,
      objectFit: data.objectFit || "cover",
      objectPosition: data.objectPosition || "center",
      priority: data.priority || false,
    };
  }

  // Fallback
  return {
    src: fallbackSrc,
    alt: fallbackAlt,
    objectFit: data.objectFit || "cover",
    objectPosition: data.objectPosition || "center",
    priority: data.priority || false,
  };
}

/**
 * Generates srcSet for responsive Sanity images
 */
export function resolveArcticImageSrcSet(
  data: ArcticImageData | null | undefined,
  widths: number[] = [400, 800, 1200, 1920]
): string {
  if (!data?.image?.asset?._ref) return "";

  return widths
    .map((w) => {
      const url = builder.image(data.image!).width(w).auto("format").quality(80).url();
      return `${url} ${w}w`;
    })
    .join(", ");
}
