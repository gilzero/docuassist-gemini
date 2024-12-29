import { motion } from 'framer-motion';
import { LogoSection } from './header/LogoSection';
import { HeaderContent } from './header/HeaderContent';

export const Header = () => {
  return (
    <motion.header 
      role="banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
      aria-label="Document Analysis Application Header"
    >
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 blur-3xl" 
        aria-hidden="true" 
      />
      
      <LogoSection />
      <HeaderContent />

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