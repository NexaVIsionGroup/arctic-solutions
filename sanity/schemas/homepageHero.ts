// ============================================================================
// SANITY SCHEMA: Homepage Hero Section
// ============================================================================
import { defineType, defineField } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const homepageHero = defineType({
  name: "homepageHero",
  title: "Homepage Hero",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Main hero headline. Keep it punchy — 6-8 words max.",
      initialValue: "Commercial Refrigeration That Never Quits",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "headlineAccent",
      title: "Headline Accent (gradient text)",
      type: "string",
      description: "The portion of the headline that gets the blue gradient treatment.",
      initialValue: "That Never Quits",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
      description: "Supporting text below the headline. One to two sentences.",
      initialValue:
        "Walk-in coolers. Reach-ins. Ice machines. Rooftop units. 24/7 emergency service across Upstate South Carolina.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
      description: "Text on the main call-to-action button (click-to-call).",
      initialValue: "Call Now",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
      description: "Text on the secondary button.",
      initialValue: "Request a Quote",
    }),
    defineField({
      name: "secondaryCtaLink",
      title: "Secondary CTA Link",
      type: "string",
      initialValue: "#quote",
    }),
    defineField({
      name: "showEmergencyBadge",
      title: "Show Emergency Badge",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "emergencyBadgeText",
      title: "Emergency Badge Text",
      type: "string",
      initialValue: "24/7 Emergency Service",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "arcticImage",
      description: "Background image for the hero. Dark/moody works best with the overlay.",
    }),
    defineField({
      name: "yetiImage",
      title: "Yeti Mascot Image",
      type: "arcticImage",
      description: "The Yeti mascot. PNG with transparent background preferred.",
    }),
    defineField({
      name: "vanImage",
      title: "Service Van Image",
      type: "arcticImage",
      description: "Arctic Solutions service van photo.",
    }),
    defineField({
      name: "buildingImage",
      title: "Building/Storefront Image",
      type: "arcticImage",
      description: "Arctic Solutions storefront photo.",
    }),
    defineField({
      name: "trustIndicators",
      title: "Hero Trust Indicators",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      initialValue: [
        { label: "Response Time", value: "< 60 min" },
        { label: "Google Rating", value: "5.0 ★" },
        { label: "Jobs Completed", value: "850+" },
      ],
    }),
    defineField({
      name: "particleDensity",
      title: "Ice Particle Density",
      type: "number",
      description: "Number of floating ice particles (20-80). Higher = more particles.",
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "particleSpeed",
      title: "Ice Particle Speed",
      type: "number",
      description: "How fast particles fall (0.1 - 1.0).",
      initialValue: 0.35,
      validation: (Rule) => Rule.min(0).max(2),
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }: any) {
      return { title: title || "Homepage Hero", subtitle: "Hero Section" };
    },
  },
});
