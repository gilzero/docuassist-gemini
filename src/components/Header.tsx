import { Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
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
        >
          <Brain className="w-12 h-12 text-primary" />
        </motion.div>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Dreamer AI
        </h1>
      </div>
      <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
        Editor AI Agent <Sparkles className="w-5 h-5 text-yellow-500" />
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Transform your documents with advanced AI analysis. Upload your file and let our intelligent agent enhance your content.
      </p>
    </motion.div>
  );
};