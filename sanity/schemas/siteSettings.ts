// ============================================================================
// SANITY SCHEMA: Site Settings — central business info
// ============================================================================
import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      initialValue: "Arctic Solutions",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Commercial Refrigeration & HVAC",
    }),
    defineField({
      name: "phone",
      title: "Phone Number (digits only)",
      type: "string",
      description: "10 digits, no dashes or spaces. Used for click-to-call.",
      initialValue: "4842739759",
      validation: (Rule) => Rule.required().regex(/^\d{10}$/, { name: "phone" }),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Phone Display Format",
      type: "string",
      description: "How the phone number appears on the site.",
      initialValue: "(484) 273-9759",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "service@arcticsolutionssc.com",
    }),
    defineField({
      name: "address",
      title: "Business Address",
      type: "text",
      rows: 2,
      initialValue: "Spartanburg, SC",
    }),
    defineField({
      name: "serviceRadius",
      title: "Service Radius",
      type: "string",
      initialValue: "~100 miles",
    }),
    defineField({
      name: "serviceAreaDescription",
      title: "Service Area Description",
      type: "string",
      initialValue: "Upstate South Carolina & Western North Carolina",
    }),
    defineField({
      name: "googleRating",
      title: "Google Rating",
      type: "string",
      initialValue: "5.0",
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "string",
      initialValue: "47",
    }),
    defineField({
      name: "founded",
      title: "Year Founded",
      type: "string",
      initialValue: "2020",
    }),
    defineField({
      name: "jobsCompleted",
      title: "Jobs Completed",
      type: "string",
      initialValue: "850+",
    }),
    defineField({
      name: "responseTime",
      title: "Average Response Time",
      type: "string",
      initialValue: "< 60 min",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "arcticImage",
    }),
    defineField({
      name: "ogImage",
      title: "Default Social Share Image",
      type: "arcticImage",
      description: "Used when sharing pages on social media (1200x630 recommended).",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Google Business", value: "google" },
                  { title: "Yelp", value: "yelp" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "LinkedIn", value: "linkedin" },
                ],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
