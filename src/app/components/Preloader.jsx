import { motion } from "motion/react";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center">
        <motion.div
          className="mb-6 inline-block"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent"></div>
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing AI Workspace...
        </motion.p>
      </div>
    </div>
  );
}













