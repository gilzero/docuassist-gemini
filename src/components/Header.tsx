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
        Editor AI Agent 
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
        className="text-lg text-gray-800 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Transform your documents with advanced AI analysis. Upload your file and let our intelligent agent enhance your content.
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