import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        {/* Animated logo container */}
        <motion.div
          className="flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Main glowing circle */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Middle rotating ring */}
            <motion.div
              className="absolute inset-3 rounded-full border-2 border-transparent border-b-primary border-l-accent"
              animate={{ rotate: -360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Inner pulsing glow */}
            <motion.div
              className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Center icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-12 h-12 text-primary relative z-10" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title with gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Media Studio
          </h1>
        </motion.div>

        {/* Loading text with animation */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="space-y-2"
        >
          <p className="text-lg font-medium text-foreground">
            Initializing Workspace
          </p>
          <p className="text-sm text-muted-foreground">
            Setting up your AI generation platform...
          </p>
        </motion.div>

        {/* Animated dots */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent"
              animate={{
                y: [0, -12, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading progress bar */}
        <motion.div className="w-48 h-1 bg-card/50 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}