import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeaderContent = () => {
  return (
    <>
      <motion.h2 
        className="text-2xl font-medium text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Agentic AI Editor 
        <motion.span
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          aria-hidden="true"
        >
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </motion.span>
      </motion.h2>

      <motion.p 
        className="text-lg text-gray-800 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="font-medium bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Unleash the power of AI
        </span>

        <span>
          to transform your documents into actionable insights.
        </span>

        <span>
          Drop your files and watch as our{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-semibold text-primary">intelligent agent</span>
            <motion.span 
              className="absolute bottom-0 left-0 w-full h-2 bg-primary/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>{' '}
          extract insights for you.
        </span>
      </motion.p>
    </>
  );
};