import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  willow: boolean;
  twinklePhase: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  colors: string[];
  big: boolean;
}

interface Flash {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

interface TrailDot {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  phase: number;
}

interface Diya {
  x: number;
  y: number;
  phase: number;
}

const PALETTE_DARK: string[][] = [
  ["#ff5a4e", "#ffb13d", "#fff3d2"],
  ["#f3b53a", "#ffe9a8", "#ff8a3d"],
  ["#39d98a", "#bdf6d6", "#ffffff"],
  ["#d946ef", "#f6b9ff", "#ffd9fb"],
  ["#7c3aed", "#c9b2ff", "#ff5a4e"],
  ["#ffffff", "#9fd8ff", "#f3b53a"],
];

const PALETTE_LIGHT: string[][] = [
  ["#e24a3c", "#d98a12", "#b85c00"],
  ["#c98c10", "#a8650a", "#8a3d00"],
  ["#1f9d63", "#0f7a4a", "#064d2e"],
  ["#b020c9", "#8a12a8", "#6b0a85"],
  ["#5b21b6", "#7c3aed", "#b91c1c"],
  ["#1d4ed8", "#0369a1", "#b45309"],
];

function drawDiya(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, isLight: boolean) {
  const flicker = 0.75 + 0.25 * Math.sin(t);
  const glowColor = isLight ? "200,110,40" : "255,160,70";
  const grad = ctx.createRadialGradient(x, y - 4, 1, x, y - 4, 20);
  grad.addColorStop(0, `rgba(${glowColor},${0.45 * flicker})`);
  grad.addColorStop(1, `rgba(${glowColor},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y - 4, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8a4a2b";
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 9, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a85c35";
  ctx.beginPath();
  ctx.moveTo(x - 8.5, y + 7);
  ctx.quadraticCurveTo(x, y + 1.5, x + 8.5, y + 7);
  ctx.quadraticCurveTo(x, y + 10.5, x - 8.5, y + 7);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flicker, flicker);
  const fg = ctx.createLinearGradient(0, -12, 0, 2);
  fg.addColorStop(0, "#fff3c4");
  fg.addColorStop(0.5, "#ffb13d");
  fg.addColorStop(1, "#ff6a2e");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.quadraticCurveTo(4.3, -5, 0, -12);
  ctx.quadraticCurveTo(-4.3, -5, 0, 2);
  ctx.fill();
  ctx.restore();
}

const DiwaliEffects: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let diyas: Diya[] = [];

    const layoutDiyas = () => {
      const count = Math.max(6, Math.round(w / 140));
      const arr: Diya[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: (w / (count + 1)) * (i + 1),
          y: 16,
          phase: Math.random() * Math.PI * 2,
        });
      }
      diyas = arr;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      layoutDiyas();
    };
    resize();
    window.addEventListener("resize", resize);

    let rockets: Rocket[] = [];
    let sparks: Spark[] = [];
    let flashes: Flash[] = [];
    let trail: TrailDot[] = [];

    const onMouseMove = (e: MouseEvent) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        life: 0,
        maxLife: 34,
        phase: Math.random() * Math.PI * 2,
      });
      if (trail.length > 40) trail.shift();
    };
    window.addEventListener("mousemove", onMouseMove);

    const palette = () =>
      themeRef.current === "light" ? PALETTE_LIGHT : PALETTE_DARK;

    const launch = (big: boolean) => {
      const x = w * (0.1 + Math.random() * 0.8);
      rockets.push({
        x,
        y: h + 4,
        vy: -(5.4 + Math.random() * 2.2),
        vx: (Math.random() - 0.5) * 0.5,
        targetY: h * (0.14 + Math.random() * 0.22),
        colors: palette()[(Math.random() * palette().length) | 0],
        big,
      });
    };

    const explode = (x: number, y: number, colors: string[], big: boolean) => {
      const count = (big ? 100 : 55) + ((Math.random() * 25) | 0);
      const speedMax = big ? 5.2 : 3.8;
      flashes.push({ x, y, life: 0, maxLife: 7, size: big ? 30 : 18 });
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.15;
        const speed = 1.2 + Math.random() * speedMax;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: (big ? 54 : 40) + Math.random() * 18,
          color: colors[(Math.random() * colors.length) | 0],
          size: (big ? 1.9 : 1.6) + Math.random() * 1.7,
          willow: big && Math.random() < 0.55,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    let launchTimer: ReturnType<typeof setTimeout>;
    const scheduleLaunch = () => {
      const gap = 1100 + Math.random() * 900;
      launchTimer = setTimeout(() => {
        launch(Math.random() < 0.3);
        scheduleLaunch();
      }, gap);
    };

    launch(true);
    scheduleLaunch();

    let raf: number;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const isLight = themeRef.current === "light";

      diyas.forEach((d) => drawDiya(ctx, d.x, d.y, t / 260 + d.phase, isLight));

      rockets = rockets.filter((r) => {
        r.x += r.vx;
        r.y += r.vy;
        ctx.save();
        ctx.shadowColor = r.colors[1];
        ctx.shadowBlur = 8;
        ctx.strokeStyle = r.colors[1];
        ctx.globalAlpha = isLight ? 0.75 : 0.9;
        ctx.lineWidth = r.big ? 2.3 : 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.vx * 3.4, r.y - r.vy * 3.4);
        ctx.stroke();
        ctx.restore();
        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.colors, r.big);
          return false;
        }
        return true;
      });

      flashes = flashes.filter((f) => {
        f.life++;
        const tt = f.life / f.maxLife;
        if (tt >= 1) return false;
        const amberFlash = isLight ? "255,214,140" : "255,255,255";
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * (1 + tt));
        g.addColorStop(0, `rgba(${amberFlash},${0.75 * (1 - tt)})`);
        g.addColorStop(1, `rgba(${amberFlash},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * (1 + tt), 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      sparks = sparks.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.willow ? 0.09 : 0.055;
        p.vx *= 0.985;
        const tt = p.life / p.maxLife;
        if (tt >= 1) return false;
        const twinkle = p.willow
          ? 0.55 + 0.45 * Math.abs(Math.sin(p.life * 0.5 + p.twinklePhase))
          : 1;
        ctx.save();
        ctx.globalAlpha = (1 - tt) * twinkle * (isLight ? 0.85 : 1);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.willow ? 6 : 9;
        ctx.fillStyle = p.color;
        if (p.willow) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * (1 - tt * 0.5);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - tt * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return true;
      });

      trail = trail.filter((p) => {
        p.life++;
        const tt = p.life / p.maxLife;
        if (tt >= 1) return false;
        const flicker = 0.7 + 0.3 * Math.sin(p.life * 0.6 + p.phase);
        const alpha = (1 - tt) * flicker * (isLight ? 0.7 : 1);
        ctx.save();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 * (1 - tt * 0.3));
        g.addColorStop(0, `rgba(255,178,80,${0.5 * alpha})`);
        g.addColorStop(1, "rgba(255,138,61,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "#ffcf8a";
        ctx.shadowBlur = 6;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#fff3c4";
        ctx.beginPath();
        ctx.arc(p.x, p.y - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(launchTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default DiwaliEffects;
