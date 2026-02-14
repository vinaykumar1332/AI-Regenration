import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Label } from "@/app/components/ui/Label/label";
import {
    X,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Github,
    Chrome,
    Apple,
} from "lucide-react";

export function LoginModal({ isOpen, onClose, onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login
        onLogin(formData);
        onClose();
    };

    const handleSocialLogin = (provider) => {
        // Simulate social login
        onLogin({ provider });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden pointer-events-auto">
                            {/* Gradient header */}
                            <div className="relative h-32 bg-gradient-to-br from-primary via-accent to-primary overflow-hidden">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 opacity-30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                </motion.div>

                                {/* Close button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>

                                {/* Logo */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                    >
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mb-8"
                                >
                                    <h2 className="text-3xl font-bold mb-2">
                                        {isSignUp ? "Create Account" : "Welcome Back"}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {isSignUp
                                            ? "Start your creative journey today"
                                            : "Sign in to continue creating"}
                                    </p>
                                </motion.div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                className="mt-2"
                                            />
                                        </motion.div>
                                    )}

                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address
                                        </Label>
                                        <div className="relative mt-2">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </Label>
                                        <div className="relative mt-2">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        password: e.target.value,
                                                    })
                                                }
                                                className="pl-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {!isSignUp && (
                                        <div className="flex items-center justify-end">
                                            <button
                                                type="button"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                        size="lg"
                                    >
                                        {isSignUp ? "Create Account" : "Sign In"}
                                    </Button>
                                </form>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-card text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-3 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSocialLogin("google")}
                                        className="flex items-center justify-center p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                                    >
                                        <Chrome className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSocialLogin("github")}
                                        className="flex items-center justify-center p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSocialLogin("apple")}
                                        className="flex items-center justify-center p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                                    >
                                        <Apple className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <div className="mt-6 text-center text-sm">
                                    <span className="text-muted-foreground">
                                        {isSignUp
                                            ? "Already have an account?"
                                            : "Don't have an account?"}
                                    </span>{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        className="text-primary font-medium hover:underline"
                                    >
                                        {isSignUp ? "Sign In" : "Sign Up"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
