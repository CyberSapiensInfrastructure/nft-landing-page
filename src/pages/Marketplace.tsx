import React from 'react';
import { DecoElements } from '../components/Layout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Marketplace: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white lowercase">
      <DecoElements />
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
        
        {/* Marketplace Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Marketplace cards ve içerikler buraya gelecek */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace; 