import { Bird } from 'lucide-react';
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
        Unleash the Power of AI
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
          <Bird className="w-5 h-5 text-yellow-500" />
        </motion.span>
      </motion.h2>

      <motion.p 
        className="text-lg text-gray-800 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Transform your documents into <span className="font-semibold">actionable insights</span>. 
        Simply <span className="font-semibold">drop your files</span> and let our intelligent agent 
        extract valuable information for you.
      </motion.p>
    </>
  );
};