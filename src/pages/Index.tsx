import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

// Components
import About from "./About";
import SplashCursor from "@/components/SplashCursor";
import SelectedWorks from "./SelectedWorks";
import VectorBridge from "./VectorBridge";
import Footer from "./Footer";
import Contact from "./Contact";
import Testimonial from "./Testimonial";
import Navigation from "@/components/Navigation";
import Aman from "../components/Aman";
import FAQGravity from "../components/FAQGravity";
import VerticalAccordion from "../components/VerticalAccordion";
import LanyardCard from "@/components/LanyardCard";
import PaintReveal from "@/components/PaintReveal";

const dummyTestimonials = [
  {
    id: "1",
    name: "Jain Event Planner",
    role: "Event & Wedding Agency",
    company: "EVENT PLANNER",
    content: "Aman built a modern, responsive wedding and event website for us. The clean design and smooth user experience blew our clients away.",
    media: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "2",
    name: "DWPS Alwar",
    role: "Academic Institution",
    company: "EDUCATION",
    content: "The school website built by Aman is fast, beautifully structured, and works effortlessly across mobiles, tablets, and desktops.",
    media: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "3",
    name: "RizeWorld Institute",
    role: "Skill Development",
    company: "INSTITUTE",
    content: "Aman developed a high-performing professional website for our courses. Great code quality, React performance, and modern UI engineering.",
    media: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "4",
    name: "Zoniraz Jewels",
    role: "Luxury E-Commerce",
    company: "JEWELLERY",
    content: "Aman created an elegant, luxurious jewellery shopping interface. The animations and responsive catalog elevate our entire brand.",
    media: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "5",
    name: "Creative Collaborations",
    role: "Product & UI Design",
    company: "DEV & DESIGN",
    content: "Aman turns ideas into functional and engaging websites with clean code, fast load times, and pixel-perfect attention to detail.",
    media: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  }
];

// --- Cursor Follower ---
const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 bg-gray-400/50 rounded-full pointer-events-none z-[9999] hidden lg:block backdrop-blur-[1px]"
      style={{ x, y }}
    />
  );
};

const BrandLogo = () => (
  <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 mix-blend-difference">
    <h1 className="font-sans font-black text-2xl md:text-3xl tracking-tighter text-white flex items-start whitespace-nowrap">
      AMAN RONEY
      <span className="text-xs md:text-sm font-medium ml-1 -mt-1">®</span>
    </h1>
  </div>
);

const AvailabilityBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="absolute z-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 pointer-events-none"
    style={{ top: "2.25rem" }}
  >
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
    </span>
    <span className="font-sans font-black text-[9px] tracking-[0.25em] uppercase text-white">
      Available for work
    </span>
  </motion.div>
);

const SocialStrip = () => {
  const socials = [
    { label: "GitHub", href: "https://github.com/Aman1166" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute z-20 hidden md:flex flex-col items-center"
      style={{ right: "64px", top: "112px", bottom: "194px", justifyContent: "center", gap: "1rem" }}
    >
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
      {socials.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          title={label}
          className="group flex-shrink-0"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span className="font-sans font-black text-[10px] tracking-[0.22em] uppercase text-white group-hover:opacity-100 transition-opacity duration-300">
            {label}
          </span>
        </a>
      ))}
      <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
    </motion.div>
  );
};

const SpinningCTA = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="absolute md:z-30 lg:z-10 hidden md:flex items-center justify-center"
    style={{ bottom: "4rem", right: "4rem" }}
  >
    <style>{`
      @keyframes ctaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .cta-ring { animation: ctaSpin var(--cta-spin-duration, 10s) linear infinite; transform-origin: center; }
      .cta-wrap:hover .cta-ring { --cta-spin-duration: 3s; }
      .cta-wrap { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .cta-wrap:hover { transform: scale(1.08); }
    `}</style>
    <a href="#contact" className="cta-wrap group relative flex items-center justify-center w-[130px] h-[130px]" aria-label="Get in touch">
      <svg viewBox="0 0 130 130" className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="65" cy="65" r="62" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 130 130" className="cta-ring absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <path id="cta-circle-path" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text fill="rgba(255,255,255,1)" fontSize="8.5" fontFamily="'Inter', sans-serif" fontWeight="900" letterSpacing="4">
          <textPath href="#cta-circle-path">GET IN TOUCH · GET IN TOUCH · GET IN TOUCH ·&nbsp;</textPath>
        </text>
      </svg>
      <span className="absolute inset-4 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" style={{ transformOrigin: "center" }} />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10 w-6 h-6 text-white group-hover:text-black" style={{ transition: "color 0.3s ease" }}>
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  </motion.div>
);

const MobileSocialStrip = () => {
  const socials = [
    { label: "GitHub", icon: Github, href: "https://github.com/Aman1166" },
    { label: "LinkedIn", icon: Linkedin, href: "#" },
    { label: "Instagram", icon: Instagram, href: "#" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-6"
    >
      {socials.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
          className="text-white hover:opacity-75 transition-opacity duration-300 block">
          <Icon size={18} strokeWidth={2.5} />
        </a>
      ))}
    </motion.div>
  );
};

const Index = () => {
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerContainerRef,
    offset: ["start end", "end end"]
  });

  // Create parallax effect: Footer starts higher up and moves to normal position as we scroll into it
  const footerY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return (
    <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
      <BrandLogo />
      <CursorFollower />
      <div className="hidden lg:block"><SplashCursor /></div>
      <Navigation />

      {/* Fixed background About section */}
      <div className="fixed inset-0 z-0 bg-white text-black">
        <About />
      </div>

      {/* Hero */}
      <section className="relative h-screen bg-black flex flex-col px-6 py-12 md:px-16 md:py-16 z-20 overflow-hidden">
        {/* Interactive Paint Reveal Canvas: Reveals Aman photo on cursor movement */}
        <div className="absolute inset-0 z-0">
          <PaintReveal revealImage="/aman-hero.png" />
        </div>

        <AvailabilityBadge />
        <SocialStrip />
        <SpinningCTA />

        {/* Floating Lanyard Drop Card */}
        <div className="absolute top-14 sm:top-16 md:top-20 right-6 sm:right-12 md:right-20 lg:right-32 xl:right-40 z-20 hidden sm:block scale-75 md:scale-90 lg:scale-100 origin-top-right">
          <LanyardCard />
        </div>

        {/* Mobile Midpoint Buffer: 80px total height from top to clear hamburger (Hamburger at 24px + 56px height) */}
        <div className="h-[32px] w-full md:hidden" /> {/* py-12 (48px) + 32px = 80px */}

        {/* Dynamic Centering Container for Mobile Socials */}
        <div className="flex-1 flex flex-col items-end justify-center md:hidden pr-0 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <MobileSocialStrip />
          </div>
        </div>

        <div className="z-10 mt-auto mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-fit"
          >
            <a href="#contact" className="group relative overflow-hidden border border-white/30 px-5 py-3 flex items-center gap-3 hover:border-white transition-colors duration-500 w-fit mb-6 md:hidden">
              <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="relative font-sans font-black text-[10px] tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-300 z-10">Get in touch</span>
              <svg className="relative w-3 h-3 text-white group-hover:text-black transition-colors duration-300 z-10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
            <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-8xl lg:text-[8rem] xl:text-[9.5rem] leading-[0.85] tracking-tighter text-white uppercase text-left whitespace-nowrap">
              AMAN RONEY
            </h1>
          </motion.div>
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-4 mb-8 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="col-span-1 md:col-span-6 lg:col-span-5"
          >
            <div className="w-12 h-[2px] bg-white mb-6 md:hidden" />
            <p className="font-sans text-xs md:text-sm font-medium text-white leading-relaxed tracking-wide uppercase text-left">
              Frontend Web Developer — I build modern, responsive and user-friendly websites with clean design and smooth experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content stack */}
      <div className="relative z-20 w-full bg-transparent">
        {/* Section 01: About Me */}
        <div id="about" className="h-screen w-full pointer-events-none" />

        {/* Section 02: Selected Projects */}
        <div id="projects" className="bg-black text-white relative z-20">
          <SelectedWorks />
        </div>

        {/* Section 03: Skills & Philosophy */}
        <div id="skills" className="bg-white text-black relative z-20">
          <VectorBridge />
        </div>

        {/* Section 04: Client Reviews & Testimonials */}
        <motion.div 
          id="testimonials"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black relative z-20"
        >
          <VerticalAccordion 
            testimonials={dummyTestimonials} 
            backgroundColor="#000000"
            textColor="#ffffff"
            companyBadgeBgColor="#ffffff"
            companyBadgeTextColor="#000000"
            playButtonBgColor="#ffffff"
            playButtonIconColor="#000000"
          />
        </motion.div>

        {/* Section 05: Services & Metrics */}
        <div id="services" className="bg-black text-white relative z-20">
          <Testimonial />
        </div>

        {/* Section 06: Experience */}
        <div id="experience" className="bg-black text-white relative z-20">
          <Aman />
        </div>

        {/* Section 07: FAQ */}
        <div id="faq" className="relative z-20">
          <FAQGravity />
        </div>

        {/* Section 08: Contact */}
        <div id="contact" className="relative z-20 bg-white text-black">
          <Contact />
        </div>
      </div>

      {/* Parallax Footer Reveal Stack */}
      <div ref={footerContainerRef} className="relative z-0 h-screen w-full overflow-hidden bg-black text-white" style={{ position: 'relative' }}>
        <motion.div style={{ y: footerY }} className="h-full w-full">
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;