import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Card } from "@/app/components/ui/Card/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/Avatar/avatar";
import { X, Mail, Calendar, LogOut, Settings } from "lucide-react";

export function UserProfileModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Premium Member",
    joinDate: "January 2026",
    avatar: "JD",
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="p-0 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 hover:bg-background/50 rounded-md transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-semibold">
                      {userData.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{userData.name}</h2>
                    <p className="text-sm text-primary font-medium">{userData.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Email</p>
                    <p className="text-sm font-medium break-all">{userData.email}</p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Member Since</p>
                    <p className="text-sm font-medium">{userData.joinDate}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs text-muted-foreground font-medium">Generations</p>
                    <p className="text-xl font-semibold text-primary mt-1">9,260</p>
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
                    <p className="text-xs text-muted-foreground font-medium">Credits</p>
                    <p className="text-xl font-semibold text-accent mt-1">5,740</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-border bg-card/50 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={onClose}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>

              {/* Close Hint */}
              <div className="px-6 py-3 text-center border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">Click outside or press ESC to close</p>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
