import React, { useState } from 'react';
import ConnectButton from './ConnectButton';
import { motion } from 'framer-motion';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className={`fixed inset-y-0 right-0 w-64 bg-[#0c0c0c]/95 backdrop-blur-lg border-l border-[#a8c7fa]/10 z-50
                 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#a8c7fa]/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-4">
          <a href="#" className="block px-4 py-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-[#a8c7fa]/5 rounded-lg transition-colors">
            Explore
          </a>
          <a href="#" className="block px-4 py-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-[#a8c7fa]/5 rounded-lg transition-colors">
            Marketplace
          </a>
          <a href="#" className="block px-4 py-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-[#a8c7fa]/5 rounded-lg transition-colors">
            Documentation
          </a>
        </nav>
      </div>
    </motion.div>
  );
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className=" mx-auto">
          <div className="flex items-center justify-between bg-[#0c0c0c]/50 backdrop-blur-md border border-[#a8c7fa]/10 p-2">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <a
                href="https://playprovidence.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#7042f88b] transition-all duration-300 group"
              >
                {/* Logo Square */}
                <div className="relative w-8 h-8 bg-gradient-to-br from-[#7042f88b]/20 to-[#7042f88b]/5 
                              rounded-xl border border-[#7042f88b]/20 group-hover:border-[#7042f88b]/40 
                              transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#d8624b] rounded-full group-hover:scale-150 transition-all duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 
                                group-hover:opacity-100 transition-all duration-300" />
                </div>

                {/* Brand Name */}
                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-[0.2em]">PROVIDENCE</span>
                  <span className="text-[10px] text-[#a8c7fa]/60">F8 Collection</span>
                </div>
              </a>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-4 text-xs text-[#a8c7fa]/60">
                <a href="#" className="hover:text-[#a8c7fa] transition-colors duration-300">Explore</a>
                <a href="#" className="hover:text-[#a8c7fa] transition-colors duration-300">Marketplace</a>
                <a href="#" className="hover:text-[#a8c7fa] transition-colors duration-300">Documentation</a>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Network Indicator */}
              <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-[#a8c7fa]/5 
                            rounded-lg border border-[#a8c7fa]/10">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-[#a8c7fa]/60">Ethereum Network</span>
              </div>

              {/* Connect Button */}
              <ConnectButton />

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 hover:bg-[#a8c7fa]/10 rounded-lg transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
};

export default Header; 