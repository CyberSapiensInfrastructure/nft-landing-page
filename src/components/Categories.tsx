import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/list?category=${category}`);
  };

  const categories = [
    { id: 'whitelist', name: 'Whitelist', icon: '🎯' },
    { id: 'airdrop', name: 'Airdrop', icon: '🎁' },
    { id: 'reborn', name: 'Reborn', icon: '✨' },
    { id: 'genesis', name: 'Genesis', icon: '🌟' }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold lowercase">browse categories</h2>
          
        

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-4">
         

            {/* View All Button */}
            <button 
              onClick={() => navigate('/list')}
              className="px-6 py-2.5 bg-[#7042f88b] hover:bg-[#7042f88b]/80 text-white rounded-xl 
                        transition-all duration-300 flex items-center gap-2"
            >
              <span className="lowercase">VIEW ALL</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#a8c7fa]/10 bg-[#0c0c0c]/50 p-6 backdrop-blur-sm
                            hover:bg-[#7042f88b]/10 hover:border-[#7042f88b]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <svg className="w-6 h-6 text-[#a8c7fa]/40 group-hover:text-[#7042f88b] transition-colors" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{category.name}</h3>
                <p className="text-[#a8c7fa]/60 text-sm">
                  Explore {category.name} collection and discover unique NFTs
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 