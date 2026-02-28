// ============================================================================
// SANITY SCHEMA: Arctic Image — supports upload OR external URL
// ============================================================================
import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const arcticImage = defineType({
  name: "arcticImage",
  title: "Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "useExternalUrl",
      title: "Use External URL",
      type: "boolean",
      description: "Toggle ON to use a URL instead of uploading an image.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Upload Image",
      type: "image",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette", "blurhash"],
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe this image for accessibility and SEO.",
          validation: (Rule) => Rule.required().warning("Alt text improves accessibility and SEO."),
        }),
      ],
      hidden: ({ parent }) => parent?.useExternalUrl === true,
    }),
    defineField({
      name: "externalUrl",
      title: "External Image URL",
      type: "url",
      description: "Paste a full image URL (e.g., Unsplash, stock photo CDN).",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).warning("Must be a valid URL."),
      hidden: ({ parent }) => parent?.useExternalUrl !== true,
    }),
    defineField({
      name: "alt",
      title: "Alt Text (for external URL)",
      type: "string",
      description: "Describe this image for accessibility and SEO.",
      hidden: ({ parent }) => parent?.useExternalUrl !== true,
    }),
    defineField({
      name: "objectFit",
      title: "Image Fit",
      type: "string",
      description: "How the image fills its container.",
      options: {
        list: [
          { title: "Cover (fill, crop edges)", value: "cover" },
          { title: "Contain (fit inside, show all)", value: "contain" },
          { title: "Fill (stretch to fit)", value: "fill" },
          { title: "None (original size)", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "cover",
    }),
    defineField({
      name: "objectPosition",
      title: "Image Position",
      type: "string",
      description: "Where to anchor the image within its container.",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Top", value: "top" },
          { title: "Bottom", value: "bottom" },
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Top Left", value: "top left" },
          { title: "Top Right", value: "top right" },
          { title: "Bottom Left", value: "bottom left" },
          { title: "Bottom Right", value: "bottom right" },
        ],
      },
      initialValue: "center",
    }),
    defineField({
      name: "priority",
      title: "Priority Load (above the fold)",
      type: "boolean",
      description: "Enable for hero/above-the-fold images to load immediately.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      imageUrl: "image.asset.url",
      externalUrl: "externalUrl",
      alt: "image.alt",
      externalAlt: "alt",
      useExternal: "useExternalUrl",
    },
    prepare({ imageUrl, externalUrl, alt, externalAlt, useExternal }: any) {
      return {
        title: useExternal ? externalAlt || "External Image" : alt || "Uploaded Image",
        subtitle: useExternal ? externalUrl : "Sanity Asset",
      };
    },
  },
});
