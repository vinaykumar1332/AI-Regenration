import { motion } from "motion/react";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Modern loader */}
      <div className="relative">
        {/* Spinning rings animation */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid transparent",
              borderTopColor: "hsl(var(--primary))",
              borderRightColor: "hsl(var(--accent))",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              border: "3px solid transparent",
              borderBottomColor: "hsl(var(--accent))",
              borderLeftColor: "hsl(var(--primary))",
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: "hsl(var(--primary))",
              borderBottomColor: "hsl(var(--accent))",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Center pulsing dot */}
          <motion.div
            className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-4px",
              marginLeft: "-4px",
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              },
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              },
            }}
            style={{
              transformOrigin: `${Math.cos((i * Math.PI) / 2) * 60}px ${Math.sin((i * Math.PI) / 2) * 60
                }px`,
            }}
          />
        ))}
      </div>

      {/* Optional minimal loading indicator at bottom */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}