import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import content from "@/appConfig/i18n/en/LandingPage/LandingPage.json";
import "./GarmentShowcaseHero.css";

const heroSection = content?.heroSection ?? {};

export default function GarmentShowcaseHero({ onGetStarted }) {
    const {
        heading = "",
        subheading = "",
        ctaText = "",
        inputImages = {},
        splashImages = {},
        outputModels = [],
        garmentLabels = {},
        connectorCopy = "",
        mobileArrow = "",
        modelBadge = "",
    } = heroSection;

    const topImages = Array.isArray(inputImages.top)
        ? inputImages.top.filter(Boolean)
        : inputImages.top
            ? [inputImages.top]
            : [];
    const bottomImages = Array.isArray(inputImages.bottom)
        ? inputImages.bottom.filter(Boolean)
        : inputImages.bottom
            ? [inputImages.bottom]
            : [];

    const [activeTopIndex, setActiveTopIndex] = useState(0);
    const [activeBottomIndex, setActiveBottomIndex] = useState(0);
    const pairs = heroSection.pairs || [];
    const [activePairIndex, setActivePairIndex] = useState(0);
    const [prevTopSrc, setPrevTopSrc] = useState(null);
    const [prevBottomSrc, setPrevBottomSrc] = useState(null);
    const [prevModelSrc, setPrevModelSrc] = useState(null);
    const prevTopIndexRef = useRef(activeTopIndex);
    const prevBottomIndexRef = useRef(activeBottomIndex);
    const prevModelIndexRef = useRef(0);

    useEffect(() => {
        if (pairs.length) return undefined;
        if (!topImages.length) return undefined;
        const interval = setInterval(() => {
            setPrevTopSrc(topImages[prevTopIndexRef.current]);
            prevTopIndexRef.current = (prevTopIndexRef.current + 1) % topImages.length;
            setActiveTopIndex(prevTopIndexRef.current);
            // clear prev after transition
            setTimeout(() => setPrevTopSrc(null), 800);
        }, 3000);
        return () => clearInterval(interval);
    }, [topImages.length]);

    useEffect(() => {
        if (pairs.length) return undefined;
        if (!bottomImages.length) return undefined;
        const interval = setInterval(() => {
            setPrevBottomSrc(bottomImages[prevBottomIndexRef.current]);
            prevBottomIndexRef.current = (prevBottomIndexRef.current + 1) % bottomImages.length;
            setActiveBottomIndex(prevBottomIndexRef.current);
            setTimeout(() => setPrevBottomSrc(null), 800);
        }, 3200);
        return () => clearInterval(interval);
    }, [bottomImages.length]);

    const handleSelectTop = (index) => {
        if (index === activeTopIndex) return;
        setActiveTopIndex(index);
    };

    const handleSelectBottom = (index) => {
        if (index === activeBottomIndex) return;
        setActiveBottomIndex(index);
    };

    const garmentSplash = splashImages.garment || "";
    const outputSplash = splashImages.output || "";
    const [activeModel, setActiveModel] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // If `pairs` is provided, pair-cycling will control model changes
        if (pairs.length) return undefined;

        if (!outputModels.length) return undefined;

        let transitionTimeout;
        const cycle = () => {
            setIsTransitioning(true);
            transitionTimeout = setTimeout(() => {
                setActiveModel((prev) => (prev + 1) % outputModels.length);
                setIsTransitioning(false);
            }, 600);
        };

        const interval = setInterval(cycle, 3000);
        return () => {
            clearInterval(interval);
            if (transitionTimeout) clearTimeout(transitionTimeout);
        };
    }, [outputModels.length, pairs.length]);

    // Cycle pairs (top + bottom -> output) if pairs are configured
    useEffect(() => {
        if (!pairs.length) return undefined;

        let pairTimeout;
        const cyclePair = () => {
            setIsTransitioning(true);
            // capture previous sources for crossfade
            const currentTop = topImages[activeTopIndex];
            const currentBottom = bottomImages[activeBottomIndex];
            const currentOutput = outputModels[activeModel];
            pairTimeout = setTimeout(() => {
                setPrevTopSrc(currentTop || null);
                setPrevBottomSrc(currentBottom || null);
                setPrevModelSrc(currentOutput || null);
                setActivePairIndex((prev) => (prev + 1) % pairs.length);
                setIsTransitioning(false);
                // clear previous src after transition
                setTimeout(() => {
                    setPrevTopSrc(null);
                    setPrevBottomSrc(null);
                    setPrevModelSrc(null);
                }, 800);
            }, 600);
        };

        const interval = setInterval(cyclePair, 3000);
        return () => {
            clearInterval(interval);
            if (pairTimeout) clearTimeout(pairTimeout);
        };
    }, [pairs.length]);

    // Apply active pair to top/bottom/output indices
    useEffect(() => {
        if (!pairs.length) return;
        const p = pairs[activePairIndex] || pairs[0];
        if (!p) return;

        const newTop = Number.isFinite(p.top) && topImages.length ? p.top % topImages.length : 0;
        const newBottom = Number.isFinite(p.bottom) && bottomImages.length ? p.bottom % bottomImages.length : 0;
        const newOutput = Number.isFinite(p.output) && outputModels.length ? p.output % outputModels.length : 0;

        // set prev sources for smooth crossfade when pair changes programmatically
        setPrevTopSrc(topImages[activeTopIndex] || null);
        setPrevBottomSrc(bottomImages[activeBottomIndex] || null);
        setPrevModelSrc(outputModels[activeModel] || null);

        setActiveTopIndex(newTop);
        setActiveBottomIndex(newBottom);
        setActiveModel(newOutput);

        // clear prev after transition
        const t = setTimeout(() => {
            setPrevTopSrc(null);
            setPrevBottomSrc(null);
            setPrevModelSrc(null);
        }, 800);
        return () => clearTimeout(t);
    }, [activePairIndex, pairs.length, topImages.length, bottomImages.length, outputModels.length]);

    const activeModelSrc = outputModels[activeModel] || outputModels[0] || "";

    const handleSelectModel = (index) => {
        // If pairs exist, selecting a model selects the pair that produces it (if any)
        if (pairs.length) {
            const pairIndex = pairs.findIndex((p) => p.output === index);
            if (pairIndex !== -1 && pairIndex !== activePairIndex) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setActivePairIndex(pairIndex);
                    setIsTransitioning(false);
                }, 600);
                return;
            }
        }

        if (index === activeModel) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveModel(index);
            setIsTransitioning(false);
        }, 600);
    };

    return (
        <motion.section
            className="garment-hero"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
        >
            {garmentSplash && (
                <img
                    src={garmentSplash}
                    alt=""
                    aria-hidden="true"
                    className="garment-hero__splash garment-hero__splash--garment"
                    loading="lazy"
                />
            )}
            {outputSplash && (
                <img
                    src={outputSplash}
                    alt=""
                    aria-hidden="true"
                    className="garment-hero__splash garment-hero__splash--output"
                    loading="lazy"
                />
            )}
            <div className="garment-hero__halo" aria-hidden="true" />
            <div className="garment-hero__container">
                <motion.div
                    className="garment-hero__column garment-hero__column--left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                >
                    <div className="garment-hero__garment-stack">
                        <motion.div
                            className={`garment-hero__garment-card garment-hero__garment-card--top ${isTransitioning ? 'is-fading' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                            whileHover={{ y: -10, scale: 1.01 }}
                            aria-label={garmentLabels.top}
                        >
                            <span className="garment-hero__garment-label">{garmentLabels.top}</span>
                            {topImages.length ? (
                                <div className="garment-hero__img-wrap">
                                    {prevTopSrc && (
                                        <img src={prevTopSrc} alt="previous top" className="garment-hero__img prev" />
                                    )}
                                    <img src={topImages[activeTopIndex]} alt={`${garmentLabels.top} ${activeTopIndex + 1}`} className="garment-hero__img current" />
                                </div>
                            ) : null}
                        </motion.div>

                        <motion.div
                            className={`garment-hero__garment-card garment-hero__garment-card--bottom ${isTransitioning ? 'is-fading' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            whileHover={{ y: -10, scale: 1.01 }}

                            aria-label={garmentLabels.bottom}
                        >
                            <span className="garment-hero__garment-label">{garmentLabels.bottom}</span>
                            {bottomImages.length ? (
                                <div className="garment-hero__img-wrap">
                                    {prevBottomSrc && (
                                        <img src={prevBottomSrc} alt="previous bottom" className="garment-hero__img prev" />
                                    )}
                                    <img src={bottomImages[activeBottomIndex]} alt={`${garmentLabels.bottom} ${activeBottomIndex + 1}`} className="garment-hero__img current" />
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="garment-hero__column garment-hero__column--center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                >
                    <div className="garment-hero__connector-line first" aria-hidden="true">
                        <svg viewBox="0 0 360 60" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--connector-start)" />
                                    <stop offset="50%" stopColor="var(--connector-mid)" />
                                    <stop offset="100%" stopColor="var(--connector-end)" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0 45 C 90 0, 180 60, 360 15"
                                stroke="url(#connectorGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                className={`garment-hero__connector-path ${isTransitioning ? 'is-animating' : ''}`}
                            />
                        </svg>
                    </div>
                    <motion.h1
                        className="garment-hero__heading"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.45 }}
                    >
                        {heading}
                    </motion.h1>
                    <motion.p
                        className="garment-hero__subheading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.6 }}
                    >
                        {subheading}
                    </motion.p>
                    <div className="garment-hero__connector" role="presentation">
                        <div className="garment-hero__connector-mini garment-hero__connector-mini--top" aria-hidden="true">
                            <svg viewBox="0 0 240 4" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="miniTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--connector-start)" />
                                        <stop offset="100%" stopColor="var(--connector-mid)" />
                                    </linearGradient>
                                </defs>
                                <path d="M0 2 L240 2" stroke="url(#miniTopGrad)" strokeWidth="2" strokeLinecap="round" fill="none" className="garment-hero__connector-mini-path" />
                            </svg>
                        </div>

                        <div className="garment-hero__connector-copy-wrap">
                            <Button size="md" className="garment-hero__connector-cta" onClick={onGetStarted}>
                                {ctaText}
                            </Button>
                        </div>

                        <div className="garment-hero__connector-mini garment-hero__connector-mini--bottom" aria-hidden="true">
                            <svg viewBox="0 0 240 4" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="miniBottomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--connector-mid)" />
                                        <stop offset="100%" stopColor="var(--connector-end)" />
                                    </linearGradient>
                                </defs>
                                <path d="M0 2 L240 2" stroke="url(#miniBottomGrad)" strokeWidth="2" strokeLinecap="round" fill="none" className="garment-hero__connector-mini-path" />
                            </svg>
                        </div>

                        <div className="garment-hero__connector-line" aria-hidden="true">
                            <svg viewBox="0 0 360 60" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--connector-start)" />
                                        <stop offset="50%" stopColor="var(--connector-mid)" />
                                        <stop offset="100%" stopColor="var(--connector-end)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 45 C 90 0, 180 60, 360 15"
                                    stroke="url(#connectorGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    className="garment-hero__connector-path"
                                />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <div className="garment-hero__mobile-arrow" aria-hidden="true">
                    <span>{mobileArrow}</span>
                    <svg viewBox="0 0 60 24">
                        <defs>
                            <linearGradient id="mobileArrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--connector-mid)" />
                                <stop offset="100%" stopColor="var(--connector-end)" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M4 12 L48 12 M36 2 L48 12 L36 22"
                            stroke="url(#mobileArrowGradient)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <motion.div
                    className="garment-hero__column garment-hero__column--right"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7 }}
                >
                    <motion.div
                        className={`garment-hero__model-card ${isTransitioning ? "is-fading" : ""}`}
                        animate={{ scale: isTransitioning ? 0.98 : 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {activeModelSrc && (
                            <div className="garment-hero__img-wrap">
                                {prevModelSrc && <img src={prevModelSrc} alt="previous model" className="garment-hero__img prev" />}
                                <img src={activeModelSrc} alt={`Model preview ${activeModel + 1}`} className="garment-hero__img current garment-hero__model-img" />
                            </div>
                        )}
                        {modelBadge && <span className="garment-hero__model-badge">{modelBadge}</span>}
                        {/* model swatches removed - models still cycle and can be selected via other UI if added */}
                        <div className="garment-hero__model-connector" aria-hidden="true">
                            <svg viewBox="0 0 260 6" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="modelConnectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--connector-mid)" />
                                        <stop offset="50%" stopColor="var(--connector-end)" />
                                        <stop offset="100%" stopColor="var(--cta-start)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 3 L260 3"
                                    className="garment-hero__model-connector-path"
                                    stroke="url(#modelConnectorGradient)"
                                    strokeWidth="4"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* bottom CTA removed — CTA is now placed in the connector area */}
        </motion.section>
    );
}
