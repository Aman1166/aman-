import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

const MagicBento = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="w-full bg-black text-white py-32 overflow-hidden">
      <motion.div 
        className="mx-auto max-w-7xl px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >

        {/* Section Header */}
        <motion.div variants={itemVariants} className="mb-24">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] inline-block py-2 px-4 rounded-full border border-white/20">
            What I Do & Deliver
          </h2>
        </motion.div>

        {/* Strict Swiss Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-40">

          <motion.div variants={itemVariants}>
            <SwissItem
              value={100}
              suffix="%"
              label="Responsive Web Design"
              description="Creating websites that provide a smooth experience across desktop, tablet and mobile devices."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SwissItem
              value={8}
              suffix="+"
              label="Core Technologies"
              description="Mastering React.js, JavaScript, Tailwind CSS, HTML5, CSS3, Node.js, Git & GitHub."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SwissItem
              value={4}
              suffix="+"
              label="Featured Projects"
              description="Turning ideas and designs into functional, engaging, and professional digital experiences."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SwissItem
              value={2026}
              suffix=""
              label="Active Developer"
              description="Frontend Web Developer at RizeWorld, crafting modern interfaces and deploying web solutions."
            />
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

const SwissItem = ({ value, suffix, label, description }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.4 } // Swiss: intentional visibility
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animate = () => {
    const duration = 1200;
    const startTime = performance.now();

    const update = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  return (
    <div ref={ref} className="flex flex-col items-start">

      {/* Label */}
      <span className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white">
        {label}
      </span>

      {/* Number */}
      <h3 className="mb-6 font-sans text-8xl md:text-9xl font-bold tracking-tight leading-none">
        {count.toLocaleString()}
        {suffix}
      </h3>

      {/* Description */}
      <p className="max-w-sm font-sans text-base leading-6 text-white/65">
        {description}
      </p>
    </div>
  );
};

export default MagicBento;
