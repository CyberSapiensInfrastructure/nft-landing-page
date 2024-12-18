import React, { useState } from 'react';
import ConnectButton from './ConnectButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isConnected } = useWeb3ModalAccount();
  
  const navItems = [
    { path: '/', label: 'home' },
    { path: '/marketplace', label: 'marketplace' },
    { path: '/community', label: 'community' },
    { path: '/about', label: 'about' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed inset-y-0 right-0 w-full sm:w-80 bg-gradient-to-b from-[#0c0c0c]/95 to-[#0c0c0c]/98 
                backdrop-blur-xl border-l border-[#a8c7fa]/10 z-50 shadow-2xl"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#a8c7fa]/10">
          <Link to="/" onClick={onClose} className="text-xl font-bold bg-gradient-to-r from-white to-[#a8c7fa] bg-clip-text text-transparent">
            providencef8
          </Link>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#a8c7fa]/10 rounded-full transition-all duration-300"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 
                           hover:bg-gradient-to-r from-[#a8c7fa]/5 to-transparent
                           ${location.pathname === item.path 
                             ? 'text-white bg-[#7042f88b]/10' 
                             : 'text-[#a8c7fa]/60 hover:text-[#a8c7fa]'}`}
              >
                <span className="relative">
                  {item.label}
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#a8c7fa]/50 to-transparent 
                                 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-[#a8c7fa]/10">
          {!isConnected ? (
            <ConnectButton className="w-full btn btn-primary" />
          ) : (
            <div className="space-y-4">
              <Link
                to="/list"
                onClick={onClose}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <span>explore nfts</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <ConnectButton className="w-full" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'home' },
    { path: '/marketplace', label: 'marketplace' },
    { path: '/community', label: 'community' },
    { path: '/about', label: 'about' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-[#a8c7fa] bg-clip-text text-transparent lowercase">
              providence
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors duration-300 lowercase
                    ${location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-[#a8c7fa]/60 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <ConnectButton className="btn btn-secondary" />
              </div>
              <Link
                to="/list"
                className="btn btn-primary lowercase"
              >
                explore
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 md:hidden hover:bg-[#a8c7fa]/10 rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
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