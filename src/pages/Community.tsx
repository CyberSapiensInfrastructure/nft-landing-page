import React from 'react';
import { DecoElements } from '../components/Layout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Community: React.FC = () => {
  useScrollToTop();

  const communityLinks = [
    { 
      title: 'discord',
      description: 'join our active discord community',
      icon: '💬',
      url: '#'
    },
    {
      title: 'twitter',
      description: 'follow us for latest updates',
      icon: '🐦',
      url: '#'
    },
    {
      title: 'medium',
      description: 'read our latest articles and updates',
      icon: '📝',
      url: '#'
    },
    {
      title: 'telegram',
      description: 'join our telegram group',
      icon: '📱',
      url: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white lowercase">
      <DecoElements />
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            join our community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#a8c7fa]/60"
          >
            be part of the providence ecosystem and connect with fellow collectors
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {communityLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-[#a8c7fa]/10 bg-[#0c0c0c]/50 p-6 
                         hover:bg-[#7042f88b]/10 hover:border-[#7042f88b]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{link.icon}</span>
                <div>
                  <h3 className="text-xl font-medium mb-2">{link.title}</h3>
                  <p className="text-[#a8c7fa]/60">{link.description}</p>
                </div>
                <svg 
                  className="w-6 h-6 ml-auto text-[#a8c7fa]/40 group-hover:text-[#7042f88b] group-hover:translate-x-1 transition-all" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Community; 