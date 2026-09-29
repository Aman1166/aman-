import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface LanyardCardProps {
  name?: string;
  role?: string;
  experience?: string;
  companyName?: string;
  year?: string;
  profileImage?: string;
  backCardText?: string;
  backCardColor?: string;
  backCardTextColor?: string;
  className?: string;
}

export default function LanyardCard({
  name = "Aman Roney",
  role = "Frontend Web Developer",
  experience = "React · JavaScript · Tailwind",
  companyName = "RizeWorld",
  year = "2026",
  profileImage = "/aman.jpg",
  backCardText = "DEVELOPER",
  backCardColor = "#8855FF",
  backCardTextColor = "#FFFFFF",
  className = "",
}: LanyardCardProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current !== null) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    if (!isShaking) {
      setIsShaking(true);
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(false);
        shakeTimeoutRef.current = null;
      }, 1500);
    }
  };

  const tapeTextureStyle = {
    backgroundImage: `
      linear-gradient(45deg, rgba(255,255,255,0.3) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(255,255,255,0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 50%, transparent 50%)
    `,
    backgroundSize: "8px 8px, 8px 8px, 2px 2px",
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center select-none cursor-pointer ${className}`}
      style={{
        transformOrigin: "top center",
      }}
      initial={{ y: -400, rotateZ: -20 }}
      animate={{
        y: 0,
        rotateZ: hasAnimated
          ? isShaking
            ? [-5, 3, -2, 1, -1, 0]
            : 0
          : [-20, 15, -10, 8, -5, 3, -2, 0],
      }}
      transition={{
        y: { duration: 0.8, ease: "easeOut" },
        rotateZ: isShaking
          ? { duration: 1.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeOut" }
          : { duration: 3, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1], ease: "easeOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Sticky Tape at Top */}
      <div
        className="w-[70px] h-[26px] bg-[#E8E8E8]/90 relative z-20 -mb-3 rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.1)] border border-black/10"
        style={{
          transform: "rotate(-5deg)",
          ...tapeTextureStyle,
        }}
      >
        <div className="absolute -inset-[1px] rounded-[2px] bg-gradient-to-br from-white/60 to-white/20 -z-10" />
        <div className="absolute top-[20%] left-[10%] right-[10%] h-[30%] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-[1px]" />
      </div>

      {/* Back Card (Appears on Hover) */}
      {isHovered && (
        <motion.div
          className="w-[260px] sm:w-[280px] h-[350px] sm:h-[370px] rounded-2xl shadow-[0px_10px_35px_rgba(0,0,0,0.5)] absolute top-7 left-0 z-0 overflow-hidden"
          style={{ background: backCardColor }}
          initial={{ rotateZ: 0, opacity: 0, x: 0 }}
          animate={{ rotateZ: 10, opacity: 1, x: -28, y: -22 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div
            className="absolute left-6 top-full -translate-y-1/2 -rotate-90 origin-left text-white font-sans font-black tracking-tight uppercase whitespace-nowrap text-5xl sm:text-6xl opacity-90"
            style={{ color: backCardTextColor }}
          >
            {backCardText}
          </div>
        </motion.div>
      )}

      {/* Main Front Card */}
      <div className="w-[260px] sm:w-[280px] h-[350px] sm:h-[370px] rounded-2xl bg-gradient-to-b from-[#1c1c1f] via-[#121214] to-[#0c0c0e] border border-white/15 shadow-[0px_12px_40px_rgba(0,0,0,0.7)] flex flex-col p-5 text-white relative overflow-hidden z-10">
        {/* Subtle holographic/glow corner accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex justify-between items-center w-full z-10">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {companyName}
          </span>
          <span className="font-mono text-xs font-semibold text-white/60 tracking-wider">
            {year}
          </span>
        </div>

        {/* Profile Image Avatar */}
        <div className="flex items-center justify-center flex-1 my-3 z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-purple-500 via-white/30 to-blue-500 shadow-xl">
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Bottom Badge Info */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-zinc-900 mt-auto z-10 shadow-lg">
          <div className="font-sans font-bold text-base sm:text-lg leading-tight text-black mb-1">
            {name}
          </div>
          <div className="font-sans text-xs font-semibold text-purple-700 leading-tight mb-1">
            {role}
          </div>
          <div className="font-sans text-[11px] font-medium text-zinc-600 leading-tight">
            {experience}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
