import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 1, name: 'Whitelist', count: 12 },
  { id: 2, name: 'Airdrop', count: 8 },
  { id: 3, name: 'Reborn', count: 15 },
  { id: 4, name: 'Genesis', count: 5 },
];

const Categories: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-[#a8c7fa]/5 hover:bg-[#a8c7fa]/10 border border-[#a8c7fa]/10 
                         rounded-xl transition-all duration-300 cursor-pointer group"
            >
              <h3 className="text-lg font-medium mb-2">{category.name}</h3>
              <p className="text-sm text-[#a8c7fa]/60">{category.count} NFTs</p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#7042f88b] to-transparent 
                            transition-all duration-300 mt-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories; 