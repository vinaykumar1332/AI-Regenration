import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Label } from "@/app/components/ui/Label/label";
import { X, Lock, Eye, EyeOff, User } from "lucide-react";
import loginCopy from "@/appConfig/LoginPage/LoginPage.json";
import "./LoginModal.css";

export function LoginModal({ isOpen, onClose, onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login
        onLogin(formData);
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
                        className="login-modal__backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="login-modal fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="login-modal__card w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden pointer-events-auto">
                            <div className="login-modal__header">
                                <div className="login-modal__logo">
                                    {loginCopy.logoText}
                                </div>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    aria-label={loginCopy.closeAriaLabel}
                                    className="login-modal__close"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="login-modal__body">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="login-modal__intro"
                                >
                                    <h2 className="login-modal__title">
                                        {loginCopy.title}
                                    </h2>
                                    <p className="login-modal__subtitle">
                                        {loginCopy.subtitle}
                                    </p>
                                </motion.div>

                                <form onSubmit={handleSubmit} className="login-modal__form">
                                    <div>
                                        <Label htmlFor="username" className="login-modal__label">
                                            {loginCopy.fields.username.label}
                                        </Label>
                                        <div className="relative mt-2">
                                            <User className="login-modal__icon" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder={loginCopy.fields.username.placeholder}
                                                value={formData.username}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        username: e.target.value,
                                                    })
                                                }
                                                className="login-modal__input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="password" className="login-modal__label">
                                            {loginCopy.fields.password.label}
                                        </Label>
                                        <div className="relative mt-2">
                                            <Lock className="login-modal__icon" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder={loginCopy.fields.password.placeholder}
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        password: e.target.value,
                                                    })
                                                }
                                                className="login-modal__input login-modal__input--password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="login-modal__toggle"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="login-modal__submit w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                        size="lg"
                                    >
                                        {loginCopy.primaryButton}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
