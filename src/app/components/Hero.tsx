"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ARCTIC } from "../lib/constants";
import IceParticleCanvas from "./IceParticleCanvas";
import { ClickToCall, EmergencyBadge } from "./ui";

// ============================================================================
// HERO SECTION — Arctic Solutions Homepage
// Clip-path reveal on load, scroll-linked parallax, staggered animations,
// van/building showcase, trust indicators strip
// ============================================================================

interface HeroProps {
  // These come from Sanity query — fallbacks use constants
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  showEmergencyBadge?: boolean;
  emergencyBadgeText?: string;
  heroImageSrc?: string;
  yetiImageSrc?: string;
  vanImageSrc?: string;
  buildingImageSrc?: string;
  trustIndicators?: { label: string; value: string }[];
  particleDensity?: number;
  particleSpeed?: number;
}

// Stagger animation variants
const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const clipReveal = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1.0, ease: [0.77, 0, 0.175, 1] as [number, number, number, number], delay: 0.1 },
  },
};

export default function Hero({
  headline = "Commercial Refrigeration",
  headlineAccent = "That Never Quits",
  subheadline = "Walk-in coolers. Reach-ins. Ice machines. Rooftop units. 24/7 emergency service across Upstate South Carolina.",
  primaryCtaLabel = "Call Now",
  secondaryCtaLabel = "Request a Quote",
  secondaryCtaLink = "#quote",
  showEmergencyBadge = true,
  emergencyBadgeText = "24/7 Emergency Service",
  heroImageSrc,
  yetiImageSrc,
  vanImageSrc = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
  buildingImageSrc,
  trustIndicators = [
    { label: "Response Time", value: "< 60 min" },
    { label: "Google Rating", value: "5.0 ★" },
    { label: "Jobs Completed", value: "850+" },
    { label: "Upstate SC", value: "~100 mi radius" },
  ],
  particleDensity = 50,
  particleSpeed = 0.35,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useInView(heroRef, { once: true });

  // Scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
      id="hero"
      aria-label="Hero"
    >
      {/* === BACKGROUND LAYERS === */}

      {/* Deep gradient base */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(0, 119, 182, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(0, 180, 216, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #0a1628 0%, #060e1a 60%, #060e1a 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Parallax background image (if provided from Sanity) */}
      {heroImageSrc && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
          aria-hidden="true"
        >
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,14,26,0.7) 0%, rgba(6,14,26,0.95) 100%)",
            }}
          />
        </motion.div>
      )}

      {/* Grid pattern overlay (subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 180, 216, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 216, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Ice Particles */}
      <IceParticleCanvas density={particleDensity} speed={particleSpeed} />

      {/* === MAIN CONTENT === */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pt-28 pb-8 md:pt-32 md:pb-12"
        style={{ y: contentY, opacity: opacityFade }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Emergency Badge */}
          {showEmergencyBadge && (
            <motion.div variants={fadeUp} className="mb-6">
              <EmergencyBadge text={emergencyBadgeText} />
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-black leading-[1.02] tracking-[-0.03em] mb-5"
            style={{
              fontSize: "clamp(36px, 8vw, 76px)",
              color: ARCTIC.colors.white,
            }}
          >
            {headline.replace(headlineAccent, "").trim()}{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${ARCTIC.colors.primary}, ${ARCTIC.colors.secondary}, ${ARCTIC.colors.frost})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {headlineAccent}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="font-body max-w-xl mx-auto mb-8 leading-relaxed"
            style={{
              fontSize: "clamp(16px, 2.8vw, 21px)",
              color: "#c8e6f5",
            }}
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-3 justify-center mb-10"
          >
            <ClickToCall
              variant="emergency"
              size="lg"
              pulse
              label={`${primaryCtaLabel}: ${ARCTIC.phoneFormatted}`}
            />
            <a
              href={secondaryCtaLink}
              className="inline-flex items-center gap-2 px-8 py-4 font-display font-bold text-lg rounded-xl no-underline transition-all duration-300 hover:bg-[rgba(0,180,216,0.15)]"
              style={{
                color: ARCTIC.colors.secondary,
                background: "rgba(0, 180, 216, 0.08)",
                border: "1px solid rgba(0, 180, 216, 0.25)",
                letterSpacing: "0.02em",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M2 6l10 7 10-7" />
              </svg>
              {secondaryCtaLabel}
            </a>
          </motion.div>

          {/* Service Van Showcase with clip-path reveal */}
          {vanImageSrc && (
            <motion.div
              variants={clipReveal}
              className="relative mx-auto mb-8 rounded-2xl overflow-hidden"
              style={{
                maxWidth: "680px",
                aspectRatio: "16/9",
                boxShadow:
                  "0 0 60px rgba(0, 119, 182, 0.15), 0 20px 60px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(0, 180, 216, 0.15)",
              }}
            >
              <Image
                src={vanImageSrc}
                alt="Arctic Solutions service van with Yeti mascot wrap"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 95vw, 680px"
              />
              {/* Holographic sheen on hover */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(0, 180, 216, 0.08) 45%, rgba(144, 224, 239, 0.12) 50%, rgba(0, 180, 216, 0.08) 55%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* === TRUST INDICATORS STRIP === */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div
          className="mx-auto max-w-5xl px-5 py-5"
          style={{
            borderTop: "1px solid rgba(0, 180, 216, 0.1)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustIndicators.map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-display font-extrabold text-lg md:text-xl"
                  style={{
                    color: ARCTIC.colors.frost,
                    textShadow: "0 0 20px rgba(144, 224, 239, 0.3)",
                  }}
                >
                  {item.value}
                </div>
                <div
                  className="font-mono text-[11px] tracking-[0.1em] uppercase mt-0.5"
                  style={{ color: "rgba(160, 213, 232, 0.5)" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* === BOTTOM GRADIENT FADE === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[5] pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${ARCTIC.colors.navyDeep}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* === SCROLL INDICATOR === */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.15em] uppercase"
          style={{ color: "rgba(160, 213, 232, 0.4)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0, 180, 216, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
