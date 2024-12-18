import React from 'react';
import { DecoElements } from '../components/Layout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

const About: React.FC = () => {
  useScrollToTop();
  const features = [
    {
      title: 'unique nfts',
      description: 'each nft in our collection is uniquely crafted with special attributes',
      icon: '🎨'
    },
    {
      title: 'community driven',
      description: 'our community plays a vital role in shaping the future of providence',
      icon: '🤝'
    },
    {
      title: 'secure platform',
      description: 'built on blockchain technology ensuring maximum security',
      icon: '🔒'
    },
    {
      title: 'regular updates',
      description: 'constant improvements and new features based on community feedback',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white lowercase">
      <DecoElements />
      <Header />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">about providence</h1>
            <p className="text-lg text-[#a8c7fa]/60">
              providence is a next-generation nft platform built for collectors and creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-[#a8c7fa]/10 bg-[#0c0c0c]/50 backdrop-blur-sm"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-[#a8c7fa]/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold mb-6">our vision</h2>
            <p className="text-[#a8c7fa]/60 mb-6">
              providence aims to revolutionize the nft space by creating a seamless and engaging platform
              for digital collectibles. our mission is to empower creators and collectors through
              blockchain technology while building a sustainable and vibrant ecosystem.
            </p>
            <div className="flex justify-center">
              <button className="px-8 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl transition-all duration-300">
                join our journey
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About; 