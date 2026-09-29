"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
    id: number;
    q: string;
    a: string;
}

interface FAQGravityProps {
    faqs?: FAQItem[];
    backgroundColor?: string;
    backgroundText?: string;
    backgroundTextColor?: string;
    bubbleBgColor?: string;
    bubbleBorderColor?: string;
    bubbleTextColor?: string;
    activeBubbleBgColor?: string;
    activeBubbleTextColor?: string;
    activeBubbleShadowColor?: string;
}

const GravityBubble = ({ faq, constraintsRef, index, bubbleBgColor, bubbleBorderColor, bubbleTextColor, activeBubbleBgColor, activeBubbleTextColor, activeBubbleShadowColor }: { faq: FAQItem; constraintsRef: any; index: number; bubbleBgColor: string; bubbleBorderColor: string; bubbleTextColor: string; activeBubbleBgColor: string; activeBubbleTextColor: string; activeBubbleShadowColor: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            whileHover={{ scale: 1.1, zIndex: 50, cursor: "grab" }}
            whileDrag={{ scale: 1.2, cursor: "grabbing", zIndex: 60 }}
            initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 300 : 0),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 300 : 0)
            }}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{
                y: { duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
            onClick={() => setIsOpen(!isOpen)}
            className="absolute rounded-full flex flex-col items-center justify-center text-center p-8 backdrop-blur-md border shadow-2xl transition-colors"
            style={{
                backgroundColor: isOpen ? activeBubbleBgColor : bubbleBgColor,
                borderColor: bubbleBorderColor,
                color: isOpen ? activeBubbleTextColor : bubbleTextColor,
                width: isOpen ? "384px" : "256px",
                height: isOpen ? "384px" : "256px",
                zIndex: isOpen ? 50 : 10,
                boxShadow: isOpen ? `0 0 50px ${activeBubbleShadowColor}` : "none",
            }}
        >
            <h3 className={`font-bold ${isOpen ? "text-xl mb-4" : "text-lg"}`}>
                {faq.q}
            </h3>
            {isOpen && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium leading-relaxed"
                >
                    {faq.a}
                </motion.p>
            )}
            {!isOpen && <Plus className="mt-2 opacity-50" size={24} />}
        </motion.div>
    );
};

const FAQGravity: React.FC<FAQGravityProps> = ({
    faqs = [
        { id: 1, q: "What tech stack do you work with?", a: "I work with React.js, JavaScript, HTML5, CSS3, Tailwind CSS, Node.js, Git & GitHub, and modern web deployment tools." },
        { id: 2, q: "Are your websites fully responsive?", a: "Yes, every website is handcrafted to provide a smooth, engaging experience across desktop, tablet, and mobile screens." },
        { id: 3, q: "Can you turn Figma designs into code?", a: "Yes! I turn UI/UX designs and ideas into functional, pixel-perfect, interactive, and high-performance websites." },
        { id: 4, q: "Where do you deploy websites?", a: "I deploy production-ready web experiences using platforms like Netlify, Vercel, and modern cloud hosting with automated CI/CD." },
        { id: 5, q: "Are you open to freelance projects?", a: "Yes, I am always open to new projects, freelance opportunities, and long-term collaborations." },
        { id: 6, q: "How can we connect?", a: "You can send a message through the contact form below or reach out directly to discuss your project requirements." }
    ],
    backgroundColor = "#111111",
    backgroundText = "AMAN",
    backgroundTextColor = "#222222",
    bubbleBgColor = "rgba(255,255,255,0.05)",
    bubbleBorderColor = "rgba(255,255,255,0.2)",
    bubbleTextColor = "#ffffff",
    activeBubbleBgColor = "#ffffff",
    activeBubbleTextColor = "#000000",
    activeBubbleShadowColor = "rgba(255, 255, 255, 0.4)"
}) => {
    const constraintsRef = useRef(null);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const textScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen overflow-hidden flex items-center justify-center relative py-24" 
            style={{ position: 'relative', backgroundColor }}
        >
            <motion.div 
                className="absolute inset-0 font-black text-[12vw] md:text-[14vw] lg:text-[12vw] flex items-center justify-center select-none overflow-hidden" 
                style={{ color: backgroundTextColor, scale: textScale, opacity: textOpacity }}
            >
                {backgroundText}
            </motion.div>

            <motion.div ref={constraintsRef} className="w-full h-full absolute inset-0">
                {faqs.map((faq, i) => (
                    <GravityBubble key={faq.id} faq={faq} constraintsRef={constraintsRef} index={i} bubbleBgColor={bubbleBgColor} bubbleBorderColor={bubbleBorderColor} bubbleTextColor={bubbleTextColor} activeBubbleBgColor={activeBubbleBgColor} activeBubbleTextColor={activeBubbleTextColor} activeBubbleShadowColor={activeBubbleShadowColor} />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default FAQGravity;
