import { useEffect, useState } from "react";
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

    const topImage = inputImages.top || "";
    const bottomImage = inputImages.bottom || "";
    const garmentSplash = splashImages.garment || "";
    const outputSplash = splashImages.output || "";
    const [activeModel, setActiveModel] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (!outputModels.length) {
            return undefined;
        }

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
            if (transitionTimeout) {
                clearTimeout(transitionTimeout);
            }
        };
    }, [outputModels.length]);

    const activeModelSrc = outputModels[activeModel] || outputModels[0] || "";

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
                            className="garment-hero__garment-card garment-hero__garment-card--top"
                            whileHover={{ y: -10, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 120 }}
                            aria-label={garmentLabels.top}
                        >
                            <span className="garment-hero__garment-label">{garmentLabels.top}</span>
                            {topImage && (
                                <img src={topImage} alt={garmentLabels.top} className="garment-hero__garment-img" />
                            )}
                        </motion.div>
                        <motion.div
                            className="garment-hero__garment-card garment-hero__garment-card--bottom"
                            whileHover={{ y: -10, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 120 }}
                            aria-label={garmentLabels.bottom}
                        >
                            <span className="garment-hero__garment-label">{garmentLabels.bottom}</span>
                            {bottomImage && (
                                <img src={bottomImage} alt={garmentLabels.bottom} className="garment-hero__garment-img" />
                            )}
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
                                className="garment-hero__connector-path"
                            />
                        </svg>
                    </div>
                    <motion.h1
                        className="garment-hero__heading"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {heading}
                    </motion.h1>
                    <motion.p
                        className="garment-hero__subheading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
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

                        <span className="garment-hero__connector-copy">{connectorCopy}</span>

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
                    transition={{ duration: 0.9, delay: 0.6 }}
                >
                    <motion.div
                        className={`garment-hero__model-card ${isTransitioning ? "is-fading" : ""}`}
                        animate={{ scale: isTransitioning ? 0.98 : 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {activeModelSrc && (
                            <img
                                src={activeModelSrc}
                                alt={`Model preview ${activeModel + 1}`}
                                className="garment-hero__model-img"
                            />
                        )}
                        {modelBadge && <span className="garment-hero__model-badge">{modelBadge}</span>}
                        <div className="garment-hero__model-swatches">
                            {outputModels.slice(0, 4).map((model, index) => (
                                <span key={`${model}-${index}`} className={index === activeModel ? "is-active" : ""} />
                            ))}
                        </div>
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

            <div className="garment-hero__cta-wrapper">
                <Button
                    size="lg"
                    className="garment-hero__cta-button"
                    onClick={onGetStarted}
                >
                    {ctaText}
                </Button>
            </div>
        </motion.section>
    );
}
