// ============================================================================
// GROQ QUERIES — Arctic Solutions Homepage
// ============================================================================
import { groq } from "next-sanity";

/**
 * Fetch hero section data
 */
export const heroQuery = groq`
  *[_type == "homepageHero"][0] {
    headline,
    headlineAccent,
    subheadline,
    primaryCtaLabel,
    secondaryCtaLabel,
    secondaryCtaLink,
    showEmergencyBadge,
    emergencyBadgeText,
    heroImage {
      useExternalUrl,
      image {
        asset-> { _id, url, metadata { lqip, dimensions } },
        hotspot,
        crop,
        alt
      },
      externalUrl,
      alt,
      objectFit,
      objectPosition,
      priority
    },
    yetiImage {
      useExternalUrl,
      image {
        asset-> { _id, url, metadata { lqip, dimensions } },
        hotspot,
        crop,
        alt
      },
      externalUrl,
      alt,
      objectFit,
      objectPosition,
      priority
    },
    vanImage {
      useExternalUrl,
      image {
        asset-> { _id, url, metadata { lqip, dimensions } },
        hotspot,
        crop,
        alt
      },
      externalUrl,
      alt,
      objectFit,
      objectPosition,
      priority
    },
    buildingImage {
      useExternalUrl,
      image {
        asset-> { _id, url, metadata { lqip, dimensions } },
        hotspot,
        crop,
        alt
      },
      externalUrl,
      alt,
      objectFit,
      objectPosition,
      priority
    },
    trustIndicators[] {
      label,
      value
    },
    particleDensity,
    particleSpeed
  }
`;

/**
 * Fetch all services (for services section)
 */
export const servicesQuery = groq`
  *[_type == "arcticService"] | order(order asc) {
    _id,
    title,
    shortTitle,
    slug,
    icon,
    description,
    emergency,
    image {
      useExternalUrl,
      image {
        asset-> { _id, url, metadata { lqip } },
        hotspot,
        crop,
        alt
      },
      externalUrl,
      alt,
      objectFit,
      objectPosition
    }
  }
`;

/**
 * Fetch site settings (phone, address, etc.)
 */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    businessName,
    phone,
    email,
    address,
    serviceRadius,
    googleRating,
    reviewCount,
    founded,
    jobsCompleted,
    responseTime,
    socialLinks[] {
      platform,
      url
    }
  }
`;
