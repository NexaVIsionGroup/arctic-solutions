"use client";
import { useEffect, useRef } from "react";

export default function IceParticleCanvas({ density = 45, speed = 0.4, className = "" }: { density?: number; speed?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w: number, h: number;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    const createParticle = (startRandom = false) => ({
      x: Math.random() * (w / (window.devicePixelRatio || 1)),
      y: startRandom ? Math.random() * (h / (window.devicePixelRatio || 1)) : -10 - Math.random() * 40,
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
    particlesRef.current = Array.from({ length: density }, () => createParticle(true));

    const drawCrystal = (p: any) => {
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

    const drawDot = (p: any) => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
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
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) { const force = (80 - dist) / 80; p.x += (dx / dist) * force * 0.8; p.y += (dy / dist) * force * 0.4; }
        if (p.y > displayH + 10 || p.x < -20 || p.x > displayW + 20) Object.assign(p, createParticle(false));
        p.type === "crystal" ? drawCrystal(p) : drawDot(p);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);
    const handleMouse = (e: MouseEvent) => { const rect = canvas.getBoundingClientRect(); mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }; };
    canvas.addEventListener("mousemove", handleMouse);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); canvas.removeEventListener("mousemove", handleMouse); };
  }, [density, speed]);

  return <canvas ref={canvasRef} className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}
