import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Card } from "@/app/components/ui/Card/card";
import {
    Sparkles,
    Image,
    Video,
    Users,
    TrendingUp,
    Shirt,
    Layers,
    Rocket,
    Zap,
    Camera,
    ShoppingBag,
    MapPin,
    Crown,
    BookOpen,
    Play,
    ChevronDown,
} from "lucide-react";
import dashboardData from "@/appConfig/LandingPage.json/Dashbord.json";
import "@/app/styles/landing-page.css";

function Section({ id, className = "", children }) {
    return (
        <section id={id} className={`relative py-32 px-6 ${className}`.trim()}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="max-w-7xl mx-auto"
            >
                {children}
            </motion.div>
        </section>
    );
}

export function LandingPage({ onGetStarted, onLogin }) {
    const [heroIndex, setHeroIndex] = useState(0);
    const { scrollY } = useScroll();
    const heroParallax = useTransform(scrollY, [0, 600], [0, 120]);
    const heroFade = useTransform(scrollY, [0, 400], [1, 0.6]);

    const landingCopy = dashboardData.landingPage;
    const heroImages = dashboardData.heroGallery?.map((item) => item.url) || [];
    const heroImage =
        heroImages[heroIndex] || dashboardData.virtualTryOn?.baseModel || "";
    const previewImage =
        dashboardData.heroGallery?.[1]?.url || dashboardData.heroGallery?.[0]?.url;
    const tryOnItems = [
        dashboardData.virtualTryOn.garments.shirts[0],
        dashboardData.virtualTryOn.garments.pants[0],
        dashboardData.virtualTryOn.garments.shoes[0],
    ].filter(Boolean);

    useEffect(() => {
        if (!heroImages.length) {
            return undefined;
        }

        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="landing-page relative min-h-screen text-white overflow-hidden">
            <div className="landing-orb landing-orb--one" />
            <div className="landing-orb landing-orb--two" />
            <div className="landing-orb landing-orb--three" />

            {/* Hero Section */}
            <motion.section
                id="home"
                style={{ opacity: heroFade }}
                className="landing-hero relative min-h-screen flex items-center justify-center px-6"
            >
                <motion.div
                    style={{ y: heroParallax }}
                    className="landing-hero-media absolute inset-0 z-0"
                >
                    <div className="landing-hero-overlay absolute inset-0" />
                    <div className="landing-image-wrapper absolute inset-0">
                        <motion.img
                            key={heroImage}
                            src={heroImage}
                            alt={landingCopy.hero.imageAlt}
                            className="landing-image w-full h-full object-cover"
                            loading="eager"
                            decoding="async"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </motion.div>

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <p className="landing-eyebrow uppercase tracking-[0.35em] text-xs text-white/70">
                            {landingCopy.hero.eyebrow}
                        </p>
                        <h1 className="landing-title text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight">
                            {landingCopy.hero.title}
                        </h1>
                        <p className="landing-subtitle text-lg md:text-2xl text-white/80 max-w-3xl mx-auto">
                            {landingCopy.hero.subtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            className="landing-primary-button text-base md:text-lg px-8 py-6"
                            onClick={onGetStarted}
                        >
                            {landingCopy.hero.ctaPrimary}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="landing-secondary-button text-base md:text-lg px-8 py-6"
                            onClick={onLogin}
                        >
                            {landingCopy.hero.ctaSecondary}
                            <Play className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 text-left"
                    >
                        {dashboardData.heroStats.map((stat, index) => {
                            const iconMap = {
                                Image,
                                Video,
                                Users,
                                TrendingUp,
                            };
                            const Icon = iconMap[stat.icon] || Image;
                            return (
                                <div key={stat.label} className="space-y-2">
                                    <Icon className="w-4 h-4 text-white/60" />
                                    <div className="text-2xl md:text-3xl font-semibold">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm text-white/60">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="landing-scroll-indicator"
                    >
                        <span className="text-xs uppercase tracking-[0.35em] text-white/60">
                            {landingCopy.hero.scrollHint}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <Section id="features" className="landing-section">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="landing-section-title text-4xl md:text-6xl font-semibold mb-4">
                        {landingCopy.features.title}
                    </h2>
                    <p className="landing-section-subtitle text-lg md:text-xl text-white/70">
                        {landingCopy.features.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
                    {dashboardData.landingFeatures.map((feature, index) => {
                        const iconMap = {
                            Sparkles,
                            Shirt,
                            Zap,
                            Layers,
                            Users,
                            Rocket,
                        };
                        const Icon = iconMap[feature.icon] || Sparkles;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -6 }}
                            >
                                <Card className="landing-card p-8 h-full border border-white/15 backdrop-blur-xl">
                                    <div className="landing-icon w-12 h-12 rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-5 h-5 text-white/80" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </Section>

            {/* Product Preview Section */}
            <Section id="preview" className="landing-section pt-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="landing-section-title text-4xl md:text-5xl font-semibold">
                            {landingCopy.preview.title}
                        </h2>
                        <p className="text-lg text-white/70">
                            {landingCopy.preview.description}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="landing-card overflow-hidden border border-white/15 backdrop-blur-xl">
                            <div className="landing-image-wrapper landing-preview-media aspect-[16/9]">
                                <img
                                    src={previewImage}
                                    alt={landingCopy.preview.imageAlt}
                                    className="landing-image w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </Section>

            {/* Virtual Try-On Section */}
            <Section id="models" className="landing-section">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="landing-section-title text-4xl md:text-5xl font-semibold">
                            {landingCopy.tryOn.title}
                        </h2>
                        <p className="text-lg text-white/70">
                            {landingCopy.tryOn.description}
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {tryOnItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className="landing-card p-3 border border-white/15 backdrop-blur-xl"
                                >
                                    <div className="landing-image-wrapper aspect-square rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="landing-image w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <p className="text-xs text-white/80 truncate">{item.name}</p>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="landing-card overflow-hidden border border-white/15 backdrop-blur-xl">
                            <div className="landing-image-wrapper aspect-[3/4]">
                                <img
                                    src={dashboardData.virtualTryOn.baseModel}
                                    alt={landingCopy.tryOn.imageAlt}
                                    className="landing-image w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </Section>

            {/* Industry Performance Section */}
            <Section className="landing-section pt-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="landing-section-title text-4xl md:text-6xl font-semibold mb-4">
                        {landingCopy.analytics.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70">
                        {landingCopy.analytics.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dashboardData.fashionAnalytics.stats.slice(0, 6).map((stat) => (
                        <Card
                            key={stat.label}
                            className="landing-card p-8 border border-white/15 backdrop-blur-xl"
                        >
                            <div className="text-3xl md:text-4xl font-semibold mb-3">
                                {stat.value}
                            </div>
                            <div className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">
                                {stat.label}
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {stat.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Quick Templates Section */}
            <Section id="showcase" className="landing-section pt-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="landing-section-title text-4xl md:text-6xl font-semibold mb-4">
                        {landingCopy.templates.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70">
                        {landingCopy.templates.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dashboardData.quickTemplates.map((template, index) => {
                        const iconMap = {
                            Camera,
                            ShoppingBag,
                            Sparkles,
                            MapPin,
                            Crown,
                            BookOpen,
                        };
                        const Icon = iconMap[template.icon] || Camera;
                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -6 }}
                            >
                                <Card className="landing-card overflow-hidden border border-white/15 backdrop-blur-xl">
                                    <div className="landing-image-wrapper relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={template.thumbnail}
                                            alt={template.title}
                                            className="landing-image w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 bg-black/30" />
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-3 text-white/70">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs uppercase tracking-[0.25em]">
                                                {template.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold">
                                            {template.title}
                                        </h3>
                                        <p className="text-white/70 text-sm">
                                            {template.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="landing-secondary-button mt-2"
                                        >
                                            {landingCopy.templates.buttonText}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </Section>

            {/* Final CTA Section */}
            <Section className="landing-section landing-final-cta pt-0">
                <div className="text-center space-y-8">
                    <h2 className="landing-section-title text-4xl md:text-6xl font-semibold">
                        {landingCopy.finalCta.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70">
                        {landingCopy.finalCta.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            size="lg"
                            className="landing-primary-button text-base md:text-lg px-8 py-6"
                            onClick={onGetStarted}
                        >
                            {landingCopy.finalCta.primary}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="landing-secondary-button text-base md:text-lg px-8 py-6"
                            onClick={onLogin}
                        >
                            {landingCopy.finalCta.secondary}
                        </Button>
                    </div>
                </div>
            </Section>
        </div>
    );
}
