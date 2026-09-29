import { useEffect, useRef } from "react";

interface PaintRevealProps {
  revealImage?: string;
  brushRadius?: number;
  fadeSpeed?: number;
  className?: string;
}

export default function PaintReveal({
  revealImage = "/aman-hero.png",
  brushRadius = 150,
  fadeSpeed = 0.022,
  className = "",
}: PaintRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Set canvas dimensions to match container
    const resize = () => {
      if (!container || !canvas) return;
      width = container.offsetWidth;
      height = container.offsetHeight;

      // Handle high DPI screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Fill initial black mask
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastMoveTime = 0;

    // Brush stamp that cuts a hole in the black canvas
    const drawStamp = (x: number, y: number, radius: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";

      const rad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      rad.addColorStop(0, "rgba(0, 0, 0, 1)");
      rad.addColorStop(0.5, "rgba(0, 0, 0, 0.95)");
      rad.addColorStop(0.8, "rgba(0, 0, 0, 0.5)");
      rad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Interpolate points between fast movements
    const paintAt = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Only paint if inside the hero container
      if (x < 0 || x > width || y < 0 || y > height) {
        lastPosRef.current = null;
        return;
      }

      lastMoveTime = performance.now();

      // Responsive brush radius
      const currentRadius = width < 768 ? brushRadius * 0.75 : brushRadius;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = currentRadius * 0.35;

        if (dist > step) {
          const steps = Math.min(Math.floor(dist / step), 8);
          for (let i = 1; i <= steps; i++) {
            const interpX = lastPosRef.current.x + (dx * i) / steps;
            const interpY = lastPosRef.current.y + (dy * i) / steps;
            drawStamp(interpX, interpY, currentRadius);
          }
        }
      }

      drawStamp(x, y, currentRadius);
      lastPosRef.current = { x, y };
    };

    // Track mouse globally so moving over any text/badge in hero still paints
    const onMouseMove = (e: MouseEvent) => {
      paintAt(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        paintAt(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      lastPosRef.current = null;
      // Instantly restore pure black when cursor leaves
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Animation loop: rapidly restores black as soon as cursor stops moving
    const loop = () => {
      const timeSinceMove = performance.now() - lastMoveTime;

      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      if (timeSinceMove > 200) {
        // Cursor has stopped moving: immediately cover back to 100% solid black
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
      } else if (timeSinceMove > 60) {
        // Cursor just stopped (idle > 60ms): rapidly wipe back to black
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, 0, width, height);
      } else {
        // While actively moving: smooth trail dissipation
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [revealImage, brushRadius, fadeSpeed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${className}`}
    >
      {/* 1. Underlying Image: Natural un-zoomed framing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <img
          src={revealImage}
          alt="Aman Roney"
          className="h-[80vh] md:h-[88vh] w-auto max-w-full object-contain object-center scale-100 pointer-events-none select-none"
        />
      </div>

      {/* 2. Top Canvas: Black veil that gets erased on cursor move */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      />
    </div>
  );
}
