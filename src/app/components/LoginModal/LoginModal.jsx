import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Label } from "@/app/components/ui/Label/label";
import { X, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAppConfig } from "@/appConfig/useAppConfig";
import "./LoginModal.css";

const STATIC_PASSWORD = import.meta.env.VITE_APP_LOGIN_PASSWORD || "V123@";

export function LoginModal({ isOpen, onClose, onLogin }) {
    const { text } = useAppConfig();
    const loginCopy = text?.login || {};
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) {
            setError("");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.username.trim() || !formData.password.trim()) {
            setError(loginCopy?.errors?.missing || "Enter both username and password to continue.");
            return;
        }

        if (formData.password !== STATIC_PASSWORD) {
            setError(loginCopy?.errors?.invalidPassword || "Invalid username or password");
            return;
        }

        setError("");
        onLogin({ ...formData, rememberMe });
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
                        className="login-modal__backdrop"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="login-modal"
                    >
                        <div className="login-modal__card">
                            <div className="login-modal__header">
                                <div className="login-modal__logo">
                                    {loginCopy.logoText || "AI Studio"}
                                </div>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    aria-label={loginCopy.closeAriaLabel || "Close login dialog"}
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
                                    <h2
                                        id="login-modal-title"
                                        className="login-modal__title"
                                    >
                                        {loginCopy.title || "Secure login"}
                                    </h2>
                                    <p className="login-modal__subtitle">
                                        {loginCopy.subtitle || "Access your AI workspace"}
                                    </p>
                                </motion.div>
                                <p className="login-modal__helper">
                                    {loginCopy.helperText || "Use your account credentials to continue"}
                                </p>

                                <form
                                    onSubmit={handleSubmit}
                                    className="login-modal__form"
                                    aria-describedby={error ? "login-error" : undefined}
                                >
                                    <div>
                                        <Label htmlFor="username" className="login-modal__label">
                                            {loginCopy?.fields?.username?.label || "Email or username"}
                                        </Label>
                                        <div className="relative mt-2">
                                            <User className="login-modal__icon" aria-hidden="true" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder={loginCopy?.fields?.username?.placeholder || "you@example.com"}
                                                value={formData.username}
                                                onChange={(event) =>
                                                    handleFieldChange("username", event.target.value)
                                                }
                                                className="login-modal__input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="password" className="login-modal__label">
                                            {loginCopy?.fields?.password?.label || "Password"}
                                        </Label>
                                        <div className="relative mt-2">
                                            <Lock className="login-modal__icon" aria-hidden="true" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder={loginCopy?.fields?.password?.placeholder || "Enter password"}
                                                value={formData.password}
                                                onChange={(event) =>
                                                    handleFieldChange("password", event.target.value)
                                                }
                                                className="login-modal__input login-modal__input--password"
                                                unstyled
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="login-modal__toggle"
                                                aria-label={
                                                    showPassword
                                                        ? (loginCopy.hidePassword || "Hide password")
                                                        : (loginCopy.showPassword || "Show password")
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.p
                                            id="login-error"
                                            className="login-modal__error"
                                            role="status"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <label className="login-modal__remember">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(event) => setRememberMe(event.target.checked)}
                                            className="login-modal__checkbox"
                                        />
                                        <span>{loginCopy.rememberMe || "Keep me signed in"}</span>
                                    </label>

                                    <Button
                                        type="submit"
                                        className="login-modal__submit w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                        size="lg"
                                    >
                                        {loginCopy.primaryButton || "Sign in"}
                                    </Button>
                                </form>

                                <div className="login-modal__footer">
                                    <a
                                        href={loginCopy?.supportLink?.href || "/contact"}
                                        className="login-modal__support"
                                    >
                                        {loginCopy?.supportLink?.label || "Need help?"}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
