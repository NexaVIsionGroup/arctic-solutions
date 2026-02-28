import Hero from "./components/Hero";
import { client } from "./lib/sanityClient";
import { heroQuery } from "./lib/queries";
import { resolveArcticImage } from "./lib/arcticImageResolver";

export const revalidate = 60;

export default async function ArcticHomePage() {
  const heroData = await client.fetch(heroQuery).catch(() => null);

  const vanImg = resolveArcticImage(
    heroData?.vanImage,
    "/high-yeti.png",
    "Arctic Solutions service van — Yeti mascot wrap"
  );

  const heroImg = resolveArcticImage(heroData?.heroImage, "", "");

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background: #060e1a; color: #F0F8FF; overflow-x: hidden; }

        @keyframes emergencyPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.2); }
        }
        @keyframes emergencyDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <Hero
        headline={heroData?.headline}
        headlineAccent={heroData?.headlineAccent}
        subheadline={heroData?.subheadline}
        primaryCtaLabel={heroData?.primaryCtaLabel}
        secondaryCtaLabel={heroData?.secondaryCtaLabel}
        secondaryCtaLink={heroData?.secondaryCtaLink}
        showEmergencyBadge={heroData?.showEmergencyBadge}
        emergencyBadgeText={heroData?.emergencyBadgeText}
        heroImageSrc={heroImg.src || undefined}
        vanImageSrc={vanImg.src || undefined}
        trustIndicators={heroData?.trustIndicators}
        particleDensity={heroData?.particleDensity}
        particleSpeed={heroData?.particleSpeed}
      />

      {/* Batch 3+ sections will be added here */}
    </>
  );
}
