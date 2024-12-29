import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-2"
    >
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {progress}% uploaded
      </p>
    </motion.div>
  );
};