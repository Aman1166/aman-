"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { VideoModal } from "./video-modal";

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content?: string;
  text?: string;
  media?: string;
  avatar?: string;
  image?: string;
  video?: string;
}

interface VerticalAccordionProps {
  testimonials?: TestimonialItem[];
  backgroundColor?: string;
  textColor?: string;
  imageOverlayFrom?: string;
  imageOverlayVia?: string;
  imageOverlayTo?: string;
  companyBadgeBgColor?: string;
  companyBadgeTextColor?: string;
  playButtonBgColor?: string;
  playButtonIconColor?: string;
  quoteColor?: string;
  quoteTruncateLength?: number;
  authorNameColor?: string;
  authorRoleColor?: string;
  authorAvatarBorderColor?: string;
  inactiveLabelColor?: string;
  inactiveLabelRotate?: number;
}

const VerticalAccordion: React.FC<VerticalAccordionProps> = ({
  testimonials = [],
  backgroundColor = "#f5f5f5",
  textColor = "#000000",
  imageOverlayFrom = "transparent",
  imageOverlayVia = "rgba(0,0,0,0.2)",
  imageOverlayTo = "rgba(0,0,0,0.9)",
  companyBadgeBgColor = "#ffffff",
  companyBadgeTextColor = "#000000",
  playButtonBgColor = "#ffffff",
  playButtonIconColor = "#000000",
  quoteColor = "#ffffff",
  quoteTruncateLength = 60,
  authorNameColor = "#ffffff",
  authorRoleColor = "rgba(255,255,255,0.7)",
  authorAvatarBorderColor = "#ffffff",
  inactiveLabelColor = "rgba(255,255,255,0.7)",
  inactiveLabelRotate = -90,
}) => {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  const filteredTestimonials = testimonials.filter((t) => t.video && t.media);

  // If no testimonials with video/media exist, fallback to all testimonials to avoid empty screen
  const displayTestimonials = filteredTestimonials.length > 0 ? filteredTestimonials : testimonials;

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center overflow-hidden p-4 md:p-10"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex flex-col md:flex-row gap-2 h-[600px] md:h-[800px] w-full max-w-[1500px]">
        {displayTestimonials.slice(0, 5).map((t, i) => (
          <motion.div
            key={t.id}
            onHoverStart={() => setActive(i)}
            animate={{ width: active === i ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "100%" : "60%") : (typeof window !== 'undefined' && window.innerWidth < 768 ? "100%" : "10%"), height: active === i ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "60%" : "100%") : (typeof window !== 'undefined' && window.innerWidth < 768 ? "10%" : "100%") }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative rounded-3xl overflow-hidden cursor-pointer bg-black group"
          >
            <img
              src={t.media || t.image}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              alt={t.name}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${imageOverlayFrom}, ${imageOverlayVia}, ${imageOverlayTo})`,
              }}
            />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
              {active === i ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                      style={{
                        backgroundColor: companyBadgeBgColor,
                        color: companyBadgeTextColor,
                      }}
                    >
                      {t.company}
                    </div>
                    {t.video && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentVideo(t.video || "");
                          setModalOpen(true);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ backgroundColor: playButtonBgColor }}
                      >
                        <Play size={16} fill={playButtonIconColor} />
                      </button>
                    )}
                  </div>
                  <h3
                    className="text-xl md:text-3xl lg:text-5xl font-bold mb-4 leading-tight"
                    style={{ color: quoteColor }}
                  >
                    "{(t.content || t.text || "").slice(0, quoteTruncateLength)}
                    ..."
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar || t.image}
                      className="w-10 h-10 rounded-full border-2 object-cover"
                      style={{ borderColor: authorAvatarBorderColor }}
                      alt={t.name}
                    />
                    <div>
                      <div
                        className="font-bold text-sm md:text-base"
                        style={{ color: authorNameColor }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="text-[10px] md:text-xs"
                        style={{ color: authorRoleColor }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-8 md:left-8 md:origin-left whitespace-nowrap font-bold uppercase tracking-widest text-sm md:text-lg"
                  style={{
                    color: inactiveLabelColor,
                    transform: typeof window !== 'undefined' && window.innerWidth < 768 ? "translateX(-50%) rotate(0deg)" : `translateX(0) rotate(${inactiveLabelRotate}deg)`,
                  }}
                >
                  {t.company}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={currentVideo}
        poster=""
      />
    </div>
  );
};

export default VerticalAccordion;
