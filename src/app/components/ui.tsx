"use client";

import { ARCTIC } from "../lib/constants";

// ============================================================================
// ARCTIC SOLUTIONS — Shared UI Components
// ClickToCall + EmergencyBadge
// ============================================================================

interface ClickToCallProps {
  variant?: "primary" | "emergency" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
  pulse?: boolean;
  label?: string;
}

export function ClickToCall({
  variant = "primary",
  size = "md",
  showIcon = true,
  className = "",
  pulse = false,
  label,
}: ClickToCallProps) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "14px", iconSize: 16, gap: "6px" },
    md: { padding: "12px 24px", fontSize: "16px", iconSize: 18, gap: "8px" },
    lg: { padding: "16px 32px", fontSize: "18px", iconSize: 20, gap: "10px" },
    xl: { padding: "20px 40px", fontSize: "20px", iconSize: 22, gap: "12px" },
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${ARCTIC.colors.primary}, ${ARCTIC.colors.primaryLight})`,
      color: ARCTIC.colors.white,
      border: "none",
      shadow: `0 4px 20px rgba(0, 119, 182, 0.4)`,
    },
    emergency: {
      background: `linear-gradient(135deg, ${ARCTIC.colors.emergency}, ${ARCTIC.colors.emergencyGlow})`,
      color: "#fff",
      border: "none",
      shadow: `0 4px 20px ${ARCTIC.colors.emergencyPulse}`,
    },
    ghost: {
      background: "rgba(0, 119, 182, 0.1)",
      color: ARCTIC.colors.secondary,
      border: `1px solid rgba(0, 180, 216, 0.3)`,
      shadow: "none",
    },
  };

  const s = sizes[size];
  const v = variants[variant];

  return (
    <a
      href={`tel:+1${ARCTIC.phone}`}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: ARCTIC.fonts.display,
        fontWeight: 700,
        color: v.color,
        background: v.background,
        border: v.border,
        borderRadius: "12px",
        textDecoration: "none",
        boxShadow: v.shadow,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        animation: pulse ? "emergencyPulse 2s ease-in-out infinite" : "none",
      }}
    >
      {showIcon && (
        <svg
          width={s.iconSize}
          height={s.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      )}
      <span>{label ?? ARCTIC.phoneFormatted}</span>
    </a>
  );
}

interface EmergencyBadgeProps {
  style?: React.CSSProperties;
  text?: string;
}

export function EmergencyBadge({ style = {}, text = "24/7 Emergency Service" }: EmergencyBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        background: "rgba(239, 68, 68, 0.15)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "100px",
        fontSize: "13px",
        fontFamily: ARCTIC.fonts.display,
        fontWeight: 600,
        color: ARCTIC.colors.emergency,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: ARCTIC.colors.emergency,
          animation: "emergencyDot 1.5s ease-in-out infinite",
          boxShadow: `0 0 8px ${ARCTIC.colors.emergencyPulse}`,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {text}
    </div>
  );
}
