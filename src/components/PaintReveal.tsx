import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaintStamp {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface PaintRevealProps {
  baseImage?: string;
  revealImage?: string;
  brushSize?: number;
  fadeDuration?: number;
  maxStamps?: number;
  className?: string;
  borderRadius?: string;
}

export default function PaintReveal({
  baseImage,
  revealImage,
  brushSize = 140,
  fadeDuration = 2.4,
  maxStamps = 60,
  className = "",
  borderRadius = "0px",
}: PaintRevealProps) {
  const [stamps, setStamps] = useState<PaintStamp[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const maskId = useMemo(
    () => "paint-mask-" + Math.random().toString(36).substring(2, 9),
    []
  );

  const getResponsiveBrushSize = useCallback(() => {
    if (!containerRef.current) return brushSize;
    const width = containerRef.current.offsetWidth;
    if (width < 768) return brushSize * 0.65;
    if (width < 1024) return brushSize * 0.85;
    return brushSize;
  }, [brushSize]);

  const addStampAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentBrushSize = getResponsiveBrushSize();

      const x = clientX - rect.left - currentBrushSize / 2;
      const y = clientY - rect.top - currentBrushSize / 2;

      const newStamp: PaintStamp = {
        id: idCounter.current++,
        x,
        y,
        size: currentBrushSize,
      };

      setStamps((prev) => {
        const next = [...prev, newStamp];
        return next.length > maxStamps ? next.slice(next.length - maxStamps) : next;
      });
    },
    [getResponsiveBrushSize, maxStamps]
  );

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      // Paint on pointer move or click
      addStampAt(e.clientX, e.clientY);

      // Interpolate between last position to prevent gaps during fast movement
      if (lastPosRef.current) {
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = brushSize * 0.35;
        if (dist > step) {
          const steps = Math.min(Math.floor(dist / step), 4);
          for (let i = 1; i < steps; i++) {
            const interpX = lastPosRef.current.x + (dx * i) / steps;
            const interpY = lastPosRef.current.y + (dy * i) / steps;
            addStampAt(interpX, interpY);
          }
        }
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    },
    [addStampAt, brushSize]
  );

  const handlePointerLeave = () => {
    lastPosRef.current = null;
  };

  const removeStamp = useCallback((id: number) => {
    setStamps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerLeave={handlePointerLeave}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          addStampAt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
      style={{ borderRadius, touchAction: "none" }}
    >
      {/* Base Layer: Dark Hero Background */}
      {baseImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${baseImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-black">
          {/* Subtle noise and radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,25,0.8),rgba(0,0,0,1))]" />
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
      )}

      {/* Reveal Layer: Hidden until painted with strokes */}
      {revealImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${revealImage})`,
            WebkitMask: `url(#${maskId})`,
            mask: `url(#${maskId})`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, #7000ff 0%, #00f2fe 45%, #ff007f 80%, #12002b 100%)",
            WebkitMask: `url(#${maskId})`,
            mask: `url(#${maskId})`,
          }}
        >
          {/* Animated iridescent light sheen inside reveal */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/40 via-purple-500/40 to-pink-500/40 mix-blend-screen" />
        </div>
      )}

      {/* SVG Mask Definition with animated fading stamps */}
      <svg
        className="absolute top-0 left-0 w-0 h-0 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Soft radial feathered brush */}
          <radialGradient id={`brush-grad-${maskId}`}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <mask id={maskId} maskUnits="userSpaceOnUse">
            {/* Black background = hidden by default */}
            <rect width="100%" height="100%" fill="black" />
            {/* White stamps = reveal underlying image */}
            <AnimatePresence>
              {stamps.map((s) => (
                <motion.circle
                  key={s.id}
                  cx={s.x + s.size / 2}
                  cy={s.y + s.size / 2}
                  r={s.size / 2}
                  fill={`url(#brush-grad-${maskId})`}
                  initial={{ opacity: 0.9, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: fadeDuration, ease: "easeOut" }}
                  onAnimationComplete={() => removeStamp(s.id)}
                />
              ))}
            </AnimatePresence>
          </mask>
        </defs>
      </svg>
    </div>
  );
}
