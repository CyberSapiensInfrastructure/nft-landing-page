import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const sortOptions = [
    { value: 'newest', label: 'NEWEST FIRST' },
    { value: 'oldest', label: 'OLDEST FIRST' },
    { value: 'price_high_low', label: 'PRICE: HIGH TO LOW' },
    { value: 'price_low_high', label: 'PRICE: LOW TO HIGH' }
  ];

  const statusOptions = ['ALL', 'COMPLETED', 'NOT COMPLETED'];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold lowercase">Browse Categories</h2>
          
          {/* Filtreler */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="relative group">
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                               flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                               transition-all duration-300 min-w-[160px]">
                <span className="text-[#a8c7fa]/60 text-sm lowercase">STATUS:</span>
                <span className="text-white lowercase">ALL</span>
                <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 
                            rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                               text-[#a8c7fa]/60 hover:text-white lowercase"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="relative group">
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                               flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                               transition-all duration-300 min-w-[160px]">
                <span className="text-[#a8c7fa]/60 text-sm lowercase">SORT BY:</span>
                <span className="text-white lowercase">NEWEST</span>
                <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#a8c7fa]/10 
                            rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                               text-[#a8c7fa]/60 hover:text-white lowercase"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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