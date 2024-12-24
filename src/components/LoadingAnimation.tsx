import { motion } from 'framer-motion';
import React from 'react';

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </motion.div>
  );
}; 