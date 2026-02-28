"use client";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import Hero from "./components/Hero";

// ============================================================================
// ARCTIC SOLUTIONS — BATCH 1: DESIGN SYSTEM + PARTICLE ENGINE + LAYOUT SHELL
// ============================================================================

// --- DESIGN TOKENS ---
const ARCTIC = {
  colors: {
    // Core palette (matched to van/building branding)
    navy: "#0a1628",
    navyDeep: "#060e1a",
    navyLight: "#0f2035",
    primary: "#0077B6",       // Arctic blue
    primaryLight: "#0096E0",
    secondary: "#00B4D8",     // Ice blue
    secondaryLight: "#48CAE4",
    frost: "#90E0EF",
    ice: "#CAF0F8",
    white: "#F0F8FF",
    // Functional
    emergency: "#EF4444",
    emergencyGlow: "#DC2626",
    emergencyPulse: "rgba(239, 68, 68, 0.4)",
    success: "#10B981",
    warning: "#F59E0B",
    // Glass
    glass: "rgba(15, 32, 53, 0.6)",
    glassBorder: "rgba(0, 180, 216, 0.15)",
    glassHover: "rgba(0, 119, 182, 0.2)",
    // Text
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(220, 240, 255, 1.0)",
    textMuted: "rgba(200, 225, 255, 0.78)",
  },
  fonts: {
    display: "'Outfit', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  phone: "4842739759",
  phoneFormatted: "(484) 273-9759",
};

// --- ICE PARTICLE ENGINE ---
function IceParticleCanvas({ density = 45, speed = 0.4, className = "" }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    const createParticle = (startRandom = false) => ({
      x: Math.random() * (w / (window.devicePixelRatio || 1)),
      y: startRandom
        ? Math.random() * (h / (window.devicePixelRatio || 1))
        : -10 - Math.random() * 40,
      size: Math.random() * 3 + 0.5,
      speedY: Math.random() * speed + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      type: Math.random() > 0.7 ? "crystal" : "dot",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    });

    resize();
    particlesRef.current = Array.from({ length: density }, () =>
      createParticle(true)
    );

    const drawCrystal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = Math.cos(angle) * p.size;
        const py = Math.sin(angle) * p.size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(144, 224, 239, ${p.opacity * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(202, 240, 248, ${p.opacity * 0.8})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawDot = (p) => {
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size
      );
      gradient.addColorStop(0, `rgba(202, 240, 248, ${p.opacity})`);
      gradient.addColorStop(0.5, `rgba(144, 224, 239, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(144, 224, 239, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      const displayW = w / (window.devicePixelRatio || 1);
      const displayH = h / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, displayW, displayH);

      particlesRef.current.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.rotation += p.rotationSpeed;

        // Mouse repulsion (subtle)
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.4;
        }

        if (p.y > displayH + 10 || p.x < -20 || p.x > displayW + 20) {
          Object.assign(p, createParticle(false));
        }

        p.type === "crystal" ? drawCrystal(p) : drawDot(p);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// --- SCROLL ANIMATION HOOK ---
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

// --- ANIMATED REVEAL WRAPPER ---
function Reveal({ children, delay = 0, direction = "up", className = "", style = {} }) {
  const [ref, isVisible] = useScrollReveal(0.1);

  const transforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    scale: "scale(0.92)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// --- FROST GLASS CARD ---
function FrostCard({
  children,
  className = "",
  hover = true,
  glow = false,
  style = {},
  onClick,
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    if (!cardRef.current || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -12,
      y: (x - 0.5) * 12,
    });
  }, [hover]);

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={handleLeave}
      style={{
        ...style,
        background: isHovered
          ? "rgba(15, 32, 53, 0.75)"
          : "rgba(15, 32, 53, 0.55)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        border: `1px solid ${
          isHovered
            ? "rgba(0, 180, 216, 0.35)"
            : "rgba(0, 180, 216, 0.12)"
        }`,
        borderRadius: "16px",
        transform: hover
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
              isHovered ? "translateZ(8px)" : ""
            }`
          : undefined,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: glow
          ? `0 0 30px rgba(0, 180, 216, ${isHovered ? 0.25 : 0.1}), 
             0 8px 32px rgba(0, 0, 0, 0.4),
             inset 0 1px 0 rgba(202, 240, 248, 0.08)`
          : `0 8px 32px rgba(0, 0, 0, 0.3),
             inset 0 1px 0 rgba(202, 240, 248, 0.06)`,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Holographic shimmer overlay */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              ${105 + tilt.y * 3}deg,
              transparent 20%,
              rgba(0, 180, 216, 0.06) 40%,
              rgba(144, 224, 239, 0.1) 50%,
              rgba(0, 180, 216, 0.06) 60%,
              transparent 80%
            )`,
            pointerEvents: "none",
            zIndex: 1,
            borderRadius: "16px",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

// --- CLICK TO CALL BUTTON ---
function ClickToCall({
  variant = "primary",
  size = "md",
  showIcon = true,
  className = "",
  pulse = false,
}) {
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
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      )}
      <span>{ARCTIC.phoneFormatted}</span>
    </a>
  );
}

// --- EMERGENCY BADGE ---
function EmergencyBadge({ style = {} }) {
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
        }}
      />
      24/7 Emergency Service
    </div>
  );
}

// --- SECTION DIVIDER (Snowflake-inspired) ---
function SectionDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${ARCTIC.colors.glassBorder}, ${ARCTIC.colors.secondary}22, ${ARCTIC.colors.glassBorder}, transparent)`,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "6px",
          height: "6px",
          background: ARCTIC.colors.secondary,
          borderRadius: "1px",
          rotate: "45deg",
          boxShadow: `0 0 12px ${ARCTIC.colors.secondary}66`,
        }}
      />
    </div>
  );
}

// --- YETI ICON (SVG simplified mascot mark) ---
function YetiMark({ size = 32 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${ARCTIC.colors.primary}, ${ARCTIC.colors.secondary})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        fontWeight: 900,
        color: ARCTIC.colors.white,
        fontFamily: ARCTIC.fonts.display,
        boxShadow: `0 0 20px rgba(0, 180, 216, 0.3)`,
        flexShrink: 0,
      }}
    >
      ❄
    </div>
  );
}

// --- NAVIGATION ---
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Why Arctic", href: "#advantage" },
    { label: "Education", href: "#education" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? "10px 0" : "16px 0",
          background: scrolled
            ? "rgba(6, 14, 26, 0.92)"
            : "rgba(6, 14, 26, 0.4)",
          backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "blur(8px)",
          borderBottom: scrolled
            ? `1px solid rgba(0, 180, 216, 0.1)`
            : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <YetiMark size={36} />
            <div>
              <div
                style={{
                  fontFamily: ARCTIC.fonts.display,
                  fontWeight: 800,
                  fontSize: "18px",
                  color: ARCTIC.colors.white,
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                }}
              >
                ARCTIC SOLUTIONS
              </div>
              <div
                style={{
                  fontFamily: ARCTIC.fonts.body,
                  fontSize: "10px",
                  color: ARCTIC.colors.textMuted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Commercial Refrigeration & HVAC
              </div>
            </div>
          </a>

          {/* Desktop Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
            className="nav-desktop"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: ARCTIC.fonts.body,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: ARCTIC.colors.textSecondary,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = ARCTIC.colors.secondary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = ARCTIC.colors.textSecondary)
                }
              >
                {link.label}
              </a>
            ))}
            <ClickToCall variant="primary" size="sm" />
          </div>

          {/* Mobile: Call + Hamburger */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
            className="nav-mobile"
          >
            <a
              href={`tel:+1${ARCTIC.phone}`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${ARCTIC.colors.primary}, ${ARCTIC.colors.primaryLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0, 119, 182, 0.4)",
              }}
              aria-label="Call Arctic Solutions"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(0, 180, 216, 0.1)",
                border: "1px solid rgba(0, 180, 216, 0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  width: "18px",
                  height: "2px",
                  background: ARCTIC.colors.secondary,
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transform: isOpen
                    ? "rotate(45deg) translate(2.5px, 2.5px)"
                    : "none",
                }}
              />
              <span
                style={{
                  width: "18px",
                  height: "2px",
                  background: ARCTIC.colors.secondary,
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  opacity: isOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: "18px",
                  height: "2px",
                  background: ARCTIC.colors.secondary,
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transform: isOpen
                    ? "rotate(-45deg) translate(2.5px, -2.5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(6, 14, 26, 0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        <EmergencyBadge style={{ marginBottom: "20px" }} />
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            style={{
              fontFamily: ARCTIC.fonts.display,
              fontSize: "28px",
              fontWeight: 700,
              color: ARCTIC.colors.white,
              textDecoration: "none",
              padding: "12px 24px",
              letterSpacing: "0.02em",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${
                0.1 + i * 0.06
              }s`,
            }}
          >
            {link.label}
          </a>
        ))}
        <div style={{ marginTop: "24px" }}>
          <ClickToCall variant="emergency" size="lg" pulse />
        </div>
        <a
          href="#quote"
          onClick={() => setIsOpen(false)}
          style={{
            marginTop: "12px",
            fontFamily: ARCTIC.fonts.display,
            fontSize: "16px",
            fontWeight: 600,
            color: ARCTIC.colors.secondary,
            textDecoration: "none",
            padding: "12px 32px",
            border: `1px solid rgba(0, 180, 216, 0.3)`,
            borderRadius: "12px",
          }}
        >
          Request a Quote
        </a>
      </div>
    </>
  );
}

// --- FOOTER ---
function Footer() {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    "Walk-in Coolers & Freezers",
    "Reach-in Units",
    "Ice Machines",
    "Rooftop HVAC",
    "Preventive Maintenance",
    "Emergency Repair",
  ];

  const areaLinks = [
    "Spartanburg, SC",
    "Greenville, SC",
    "Anderson, SC",
    "Cherokee County",
    "Union County",
    "Laurens County",
  ];

  return (
    <footer
      style={{
        background: ARCTIC.colors.navyDeep,
        borderTop: `1px solid rgba(0, 180, 216, 0.08)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "200px",
          background: `radial-gradient(ellipse, rgba(0, 119, 182, 0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 20px 30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <YetiMark size={32} />
              <div
                style={{
                  fontFamily: ARCTIC.fonts.display,
                  fontWeight: 800,
                  fontSize: "16px",
                  color: ARCTIC.colors.white,
                  letterSpacing: "0.04em",
                }}
              >
                ARCTIC SOLUTIONS
              </div>
            </div>
            <p
              style={{
                fontFamily: ARCTIC.fonts.body,
                fontSize: "14px",
                color: ARCTIC.colors.textMuted,
                lineHeight: 1.6,
                marginBottom: "16px",
                maxWidth: "280px",
              }}
            >
              Commercial refrigeration and HVAC service you can trust. Serving
              the Upstate South Carolina region with owner-level precision and
              24/7 emergency response.
            </p>
            <EmergencyBadge />
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                fontFamily: ARCTIC.fonts.display,
                fontWeight: 700,
                fontSize: "13px",
                color: ARCTIC.colors.secondary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Services
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {serviceLinks.map((s) => (
                <a
                  key={s}
                  href="#services"
                  style={{
                    fontFamily: ARCTIC.fonts.body,
                    fontSize: "14px",
                    color: ARCTIC.colors.textMuted,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = ARCTIC.colors.textPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = ARCTIC.colors.textMuted)
                  }
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Service Area */}
          <div>
            <h4
              style={{
                fontFamily: ARCTIC.fonts.display,
                fontWeight: 700,
                fontSize: "13px",
                color: ARCTIC.colors.secondary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Service Area
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {areaLinks.map((a) => (
                <span
                  key={a}
                  style={{
                    fontFamily: ARCTIC.fonts.body,
                    fontSize: "14px",
                    color: ARCTIC.colors.textMuted,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: ARCTIC.fonts.display,
                fontWeight: 700,
                fontSize: "13px",
                color: ARCTIC.colors.secondary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Get In Touch
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <ClickToCall variant="emergency" size="sm" />
              <a
                href="#quote"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: ARCTIC.fonts.body,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: ARCTIC.colors.secondary,
                  textDecoration: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M2 6l10 7 10-7" />
                </svg>
                Request a Quote
              </a>
              <span
                style={{
                  fontFamily: ARCTIC.fonts.body,
                  fontSize: "13px",
                  color: ARCTIC.colors.textMuted,
                  lineHeight: 1.5,
                }}
              >
                Spartanburg, SC
                <br />
                Serving ~100 mile radius
              </span>
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontFamily: ARCTIC.fonts.body,
              fontSize: "12px",
              color: ARCTIC.colors.textMuted,
            }}
          >
            © {currentYear} Arctic Solutions. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: ARCTIC.fonts.body,
              fontSize: "11px",
              color: "rgba(144, 224, 239, 0.3)",
            }}
          >
            Built by{" "}
            <a
              href="https://nexavisiongroup.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(144, 224, 239, 0.4)",
                textDecoration: "none",
              }}
            >
              NexaVision Group
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN APP — DEMO SHELL WITH ALL BATCH 1 COMPONENTS
// ============================================================================
export default function ArcticSolutionsBatch1() {
  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background: ${ARCTIC.colors.navyDeep}; color: ${ARCTIC.colors.textPrimary}; overflow-x: hidden; }

        /* Responsive nav toggle */
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }

        /* Animations */
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes frostedBorderGlow {
          0%, 100% { border-color: rgba(0, 180, 216, 0.12); }
          50% { border-color: rgba(0, 180, 216, 0.3); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${ARCTIC.colors.navyDeep}; }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 180, 216, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 180, 216, 0.5);
        }

        /* Selection */
        ::selection {
          background: rgba(0, 119, 182, 0.4);
          color: ${ARCTIC.colors.white};
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${ARCTIC.colors.navy} 0%, ${ARCTIC.colors.navyDeep} 100%)`,
          fontFamily: ARCTIC.fonts.body,
          position: "relative",
        }}
      >
        <Navigation />

        {/* === HERO (Batch 2) === */}
        <Hero />

        {/* === COMPONENT SHOWCASE (demo of Batch 1 pieces) === */}
        <section style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span
                style={{
                  fontFamily: ARCTIC.fonts.mono,
                  fontSize: "12px",
                  color: ARCTIC.colors.secondary,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Batch 1 — Design System Preview
              </span>
              <h2
                style={{
                  fontFamily: ARCTIC.fonts.display,
                  fontWeight: 800,
                  fontSize: "clamp(24px, 5vw, 40px)",
                  color: ARCTIC.colors.white,
                  marginTop: "8px",
                }}
              >
                Foundation Components
              </h2>
            </div>
          </Reveal>

          {/* Frost Card Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginBottom: "48px",
            }}
          >
            {[
              {
                icon: "❄",
                title: "Ice Particle Engine",
                desc: "Canvas-based floating particles with mouse repulsion, crystal shapes, and performance-optimized rendering.",
              },
              {
                icon: "📱",
                title: "Mobile-First Nav",
                desc: "Frosted glass navigation with click-to-call button, animated hamburger, and full-screen overlay menu.",
              },
              {
                icon: "🔲",
                title: "Frost Glass Cards",
                desc: "3D tilt-on-hover with holographic shimmer overlay, glassmorphism blur, and dynamic border glow.",
              },
              {
                icon: "🔴",
                title: "Emergency System",
                desc: "Pulsing red CTAs, emergency badges with animated dots, and 24/7 click-to-call routing.",
              },
              {
                icon: "👁",
                title: "Scroll Reveals",
                desc: "IntersectionObserver-powered animations with directional entrances and staggered delays.",
              },
              {
                icon: "🎨",
                title: "Arctic Design Tokens",
                desc: "Full color system, typography stack (Outfit + DM Sans + JetBrains Mono), and reusable utilities.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <FrostCard glow hover style={{ padding: "28px" }}>
                  <div
                    style={{
                      fontSize: "28px",
                      marginBottom: "12px",
                      filter: "drop-shadow(0 0 8px rgba(0, 180, 216, 0.4))",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: ARCTIC.fonts.display,
                      fontWeight: 700,
                      fontSize: "18px",
                      color: ARCTIC.colors.white,
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: ARCTIC.fonts.body,
                      fontSize: "14px",
                      color: ARCTIC.colors.textMuted,
                      lineHeight: 1.6,
                    }}
                  >
                    {card.desc}
                  </p>
                </FrostCard>
              </Reveal>
            ))}
          </div>

          <SectionDivider />

          {/* CTA Variants showcase */}
          <Reveal delay={0.1}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                padding: "48px 0",
              }}
            >
              <ClickToCall variant="primary" size="md" />
              <ClickToCall variant="emergency" size="md" pulse />
              <ClickToCall variant="ghost" size="md" />
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>
    </>
  );
}
