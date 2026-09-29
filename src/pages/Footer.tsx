import { motion, Variants } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <footer className="relative bg-black text-white font-sans pt-12 md:pt-20 border-t border-white h-screen flex flex-col" style={{ position: 'relative' }}>

      {/* Top Section: Info Grid */}
      <motion.div
        className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-5 gap-y-10 md:gap-x-12 shrink-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Column 1: IDENTIFICATION */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-4 text-white/80">
            Identification
          </h3>
          <p className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide leading-relaxed">
            Aman Roney
          </p>
          <p className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide leading-relaxed text-white/60">
            Frontend Web Developer
          </p>
          <p className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide leading-relaxed text-white/60">
            React · JavaScript · Tailwind CSS
          </p>
        </motion.div>

        {/* Column 2: CHANNELS */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-4 text-white/80">
            Channels
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/Aman1166"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit flex items-center gap-1"
            >
              GitHub ↗
            </a>
            <a
              href="#"
              className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit flex items-center gap-1"
            >
              LinkedIn ↗
            </a>
            <a
              href="#"
              className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit flex items-center gap-1"
            >
              Instagram ↗
            </a>
          </div>
        </motion.div>

        {/* Column 3: QUICK LINKS */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-4 text-white/80">
            Quick Links
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", href: "#" },
              { label: "About Me", href: "#about" },
              { label: "Selected Projects", href: "#projects" },
              { label: "Skills & Philosophy", href: "#skills" },
              { label: "Client Reviews", href: "#testimonials" },
              { label: "Experience", href: "#experience" },
              { label: "FAQ", href: "#faq" },
              { label: "Contact", href: "#contact" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Column 4: WHAT I DO */}
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-4 text-white/80">
            What I Do
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { label: "Frontend Development", href: "#services" },
              { label: "Responsive Web Design", href: "#skills" },
              { label: "Website Development", href: "#projects" },
              { label: "React & Modern UI", href: "#about" },
              { label: "Website Deployment", href: "#experience" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit text-white/80 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Column 5: CONTACT INFO */}
        <motion.div variants={itemVariants} className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-1 text-white/80 flex items-center gap-2">
              <MapPin size={14} /> Alwar, Rajasthan, India
            </h3>
            <p className="font-sans text-xs md:text-sm font-medium tracking-wide text-white/60 flex items-center gap-2">
              <Phone size={14} /> +91 83022 77092
            </p>
            <p className="font-sans text-xs md:text-sm font-medium tracking-wide text-white/60 lowercase flex items-center gap-2">
              <Mail size={14} /> amanroney1166@gmail.com
            </p>
            <p className="font-sans text-xs md:text-sm font-medium tracking-wide text-white/60 leading-relaxed mt-1 flex items-start gap-2">
              <MapPin size={14} className="mt-1 flex-shrink-0" />
              <span>
                C-198, near Telco Circle, UIT colony,<br />
                Shalimar Nagar, Alwar,<br />
                Rajasthan 301001, India
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Section: Branding Wordmark - Clean bold grotesque typography matching reference */}
      <div className="w-full flex-1 flex items-center justify-center overflow-hidden select-none py-4 md:py-6">
        <h2 className="font-sans font-black text-[22vw] sm:text-[23vw] md:text-[24vw] leading-none tracking-tight text-white uppercase text-center select-none pointer-events-none">
          AMAN
        </h2>
      </div>
    </footer>
  );
};

export default Footer;