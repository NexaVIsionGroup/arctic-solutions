import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { arcticImage, homepageHero, siteSettings } from "./sanity/schemas";

export default defineConfig({
  name: "arctic-solutions",
  title: "Arctic Solutions CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: {
    types: [arcticImage, homepageHero, siteSettings],
  },
});
