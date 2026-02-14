import { useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export function SmoothScrollWrapper({ children }) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = "smooth";

        return () => {
            document.documentElement.style.scrollBehavior = "auto";
        };
    }, []);

    return (
        <>
            {/* Progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left z-[100]"
                style={{ scaleX }}
            />
            {children}
        </>
    );
}

// Reusable scroll animation variants
export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};
