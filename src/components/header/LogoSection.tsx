import { Bird } from 'lucide-react';
import { motion } from 'framer-motion';

export const LogoSection = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-2">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        whileHover={{ scale: 1.2 }}
        className="relative"
        aria-hidden="true"
      >
        <Bird className="w-12 h-12 text-primary" />
        <motion.div
          className="absolute -inset-1 bg-primary/20 rounded-full blur-md -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      <motion.h1 
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-600"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Dreamer AI
      </motion.h1>
    </div>
  );
};