import React, { useState } from 'react';
import ConnectButton from './ConnectButton';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed inset-y-0 right-0 w-72 bg-gradient-to-b from-[#0c0c0c]/95 to-[#0c0c0c]/98 
                 backdrop-blur-xl border-l border-[#a8c7fa]/10 z-50 shadow-2xl`}
    >
      <div className="p-8 space-y-8">
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#a8c7fa]/10 rounded-full transition-all duration-300"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {['Explore', 'Marketplace', 'Documentation'].map((item) => (
            <a
              key={item}
              href="#"
              className="group flex items-center px-4 py-3 text-[#a8c7fa]/60 hover:text-[#a8c7fa] 
                         rounded-xl transition-all duration-300 hover:bg-gradient-to-r 
                         from-[#a8c7fa]/5 to-transparent"
            >
              <span className="relative">
                {item}
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#a8c7fa]/50 to-transparent 
                               scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </a>
          ))}
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 bg-gradient-to-r from-[#0c0c0c]/80 to-[#0c0c0c]/70 
                         backdrop-blur-xl border border-[#a8c7fa]/10 rounded-2xl my-4 px-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <a
                href="https://playprovidence.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#7042f88b] transition-all duration-500 group"
              >
                {/* Enhanced Logo Square */}
                <div className="relative w-9 h-9 bg-gradient-to-br from-[#7042f88b]/20 via-[#7042f88b]/10 to-transparent 
                              rounded-xl border border-[#7042f88b]/20 group-hover:border-[#7042f88b]/40 
                              transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#d8624b] rounded-full group-hover:scale-150 
                                  transition-all duration-700 ease-out" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 
                                group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-[#7042f88b]/20 to-transparent opacity-0 
                                group-hover:opacity-100 transition-all duration-500 delay-100" />
                </div>

                {/* Enhanced Brand Name */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium tracking-[0.25em] bg-gradient-to-r from-white to-[#a8c7fa]/80 
                                 bg-clip-text text-transparent">PROVIDENCE</span>
                  <span className="text-[10px] text-[#a8c7fa]/60 tracking-wider">F8 Collection</span>
                </div>
              </a>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm">
                {['Explore', 'Marketplace', 'Documentation'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="group relative text-[#a8c7fa]/60 hover:text-[#a8c7fa] transition-colors duration-300"
                  >
                    {item}
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#7042f88b] to-transparent 
                                   scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Network Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#a8c7fa]/5 to-transparent 
                            rounded-xl border border-[#a8c7fa]/10">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-[#a8c7fa]/60">Ethereum Network</span>
              </div>

              {/* Connect Button */}
              <ConnectButton />

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-[#a8c7fa]/10 rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            <MobileMenu 
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 