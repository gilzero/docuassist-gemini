import { Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header 
      role="banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 relative"
      aria-label="Document Analysis Application Header"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 blur-3xl" 
           aria-hidden="true" 
      />
      
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
          <Brain className="w-12 h-12 text-primary" />
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

      <motion.div 
        className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mt-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6 }}
        aria-hidden="true"
      />
    </motion.header>
  );
};