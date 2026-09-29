import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

const awardsData = [
  { name: "Frontend Development", platform: "React & JS", year: "Specialist" },
  { name: "Responsive UI Design", platform: "Tailwind CSS", year: "Pixel-Perfect" },
  { name: "RizeWorld Developer", platform: "Web Platform", year: "2026 – Present" },
  { name: "Production Deployment", platform: "Fast & Modern", year: "Optimized" },
];

const floatAnimation = {
  y: ["-5px", "5px"],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  },
};

const Aman = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);

  return (
    <section ref={containerRef} className="relative bg-black py-16 px-4 md:px-8" style={{ position: 'relative' }}>
      {/* Outer Wrapper: White Rounded Card with Scroll Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1500px] mx-auto bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl"
      >
        
        {/* Left Side (White Background) */}
        <div className="w-full lg:w-[55%] p-8 md:p-12 lg:p-20 flex flex-col justify-between relative z-10">
          
          <div className="flex justify-between items-center mb-12 lg:mb-20">
            <span className="font-sans font-medium text-black text-xl md:text-2xl tracking-tight">
              Aman Roney
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-black/50">
              [ Professional Experience ]
            </span>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 flex flex-col justify-center"
          >
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-black text-[3.5rem] sm:text-6xl md:text-[5.5rem] lg:text-[6rem] font-medium leading-[1.05] tracking-tight mb-6"
            >
              Professional<br />
              <span className="font-serif italic font-light text-black">Experience</span><br />
              & Journey.
            </motion.h2>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-black/80 text-sm md:text-base max-w-md leading-relaxed mb-10 font-sans"
            >
              Working on modern websites and digital experiences using React, JavaScript, HTML, CSS and Tailwind CSS. Developing responsive interfaces, implementing designs and deploying websites.
            </motion.p>
          </motion.div>

          {/* Awards List - Placed at the bottom like the logos in reference */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-4 items-center"
          >
            {awardsData.map((award, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-black font-bold text-sm">{award.name}</span>
                <div className="flex gap-2 items-center text-xs text-black/60 font-medium">
                  <span>{award.platform}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{award.year}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side (Image & Floating Card) */}
        <div className="w-full lg:w-[45%] relative min-h-[500px] lg:min-h-full overflow-hidden rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2.5rem]">
          <motion.div className="absolute inset-0 w-full h-full" style={{ y: imageY, scale: imageScale }}>
            <img 
              src="/aman.jpg" 
              alt="Aman Roney" 
              className="w-full h-full object-cover object-[center_20%]"
            />
          </motion.div>

          {/* Floating Glass Card */}
          <motion.div 
            animate={floatAnimation}
            className="absolute top-1/2 left-8 md:left-12 -translate-y-1/2 z-20 w-[280px]"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl overflow-hidden relative group">
              {/* Subtle gradient shine inside glass */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Window Controls (Red/Yellow/Green dots) */}
              <div className="flex items-center gap-1.5 mb-4 border-b border-white/20 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[10px] text-white/80 font-medium uppercase tracking-wider">
                  Aman Roney Profile
                </span>
              </div>

              {/* Card Body */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h4 className="text-white font-serif italic text-lg leading-tight">Aman Roney<br/><span className="text-xs font-sans not-italic text-white/80 font-normal">Frontend Developer</span></h4>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-3 relative z-10">
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Role</span>
                  <span className="text-white text-xs font-medium">Frontend Dev</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Experience</span>
                  <span className="text-white text-xs font-medium">2026 – Present</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default Aman;
