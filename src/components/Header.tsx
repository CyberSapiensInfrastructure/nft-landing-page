import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from './ConnectButton';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  path: string;
  icon?: string;
  description?: string;
  featured?: boolean;
  stats?: string;
}

interface NavItem {
  path: string;
  label: string;
  dropdown?: DropdownItem[];
}

interface HeaderProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConnect, onDisconnect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { path: '/', label: 'home' },
    { 
      path: '/list', 
      label: 'nfts',
      dropdown: [
        { 
          label: 'All NFTs', 
          path: '/list', 
          icon: 'grid',
          description: 'Browse all available NFTs',
          featured: true,
          stats: '2.5k+ NFTs'
        },
        { 
          label: 'My Collection', 
          path: '/collection', 
          icon: 'collection',
          description: 'View your NFT collection',
          stats: '3 NFTs'
        },
        { 
          label: 'Staked NFTs', 
          path: '/staked', 
          icon: 'stake',
          description: 'Check your staked assets',
          stats: '1 Staked'
        }
      ]
    },
    { 
      path: '/missions', 
      label: 'missions',
      dropdown: [
        { label: 'Active Missions', path: '/missions', icon: 'mission' },
        { label: 'Completed', path: '/missions/completed', icon: 'check' },
        { label: 'Rewards', path: '/missions/rewards', icon: 'reward' }
      ]
    },
    { 
      path: '/marketplace', 
      label: 'marketplace',
      dropdown: [
        { label: 'Browse', path: '/marketplace', icon: 'browse' },
        { label: 'Create', path: '/marketplace/create', icon: 'create' },
        { label: 'Activity', path: '/marketplace/activity', icon: 'activity' }
      ]
    },
    { path: '/community', label: 'community' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'grid':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'mission':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'reward':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <motion.div 
              className="w-3 h-3 bg-gradient-to-tr from-purple-500 via-purple-400 to-purple-600 rounded-full ring-2 ring-purple-500/20"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <span className="text-sm tracking-[0.2em] text-white/90 group-hover:text-white transition-all duration-300 font-medium">
              PROVIDENCE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.path}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                    location.pathname === item.path
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 pt-2 w-[280px] z-50"
                    style={{ top: "calc(100% + 5px)" }}
                  >
                    <div className="relative">
                      <div 
                        className="absolute -top-2 left-[28px] w-[12px] h-[12px] bg-[#1a1a1a] rotate-45 ring-1 ring-white/5"
                        style={{ boxShadow: "-1px -1px 0 0 rgba(255,255,255,0.05)" }}
                      />
                      <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden ring-1 ring-white/5">
                        <div className="p-1">
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.path}
                              to={dropItem.path}
                              className="flex items-center justify-between p-3 text-sm text-white/70 hover:text-white transition-all duration-200 hover:bg-white/[0.03] rounded-lg group"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">{dropItem.label}</span>
                                {dropItem.description && (
                                  <span className="text-[11px] text-white/40">
                                    {dropItem.description}
                                  </span>
                                )}
                              </div>
                              <div className="text-white/20 group-hover:text-purple-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </motion.button>

            <ConnectButton onConnect={onConnect} onDisconnect={onDisconnect} />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            <div className="w-5 h-5 relative">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 w-full h-0.5 bg-current transform transition-transform"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-[8px] w-full h-0.5 bg-current"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="absolute left-0 bottom-0 w-full h-0.5 bg-current transform transition-transform"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4"
            >
              <motion.div 
                className="bg-gradient-to-b from-slate-800/95 to-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-2 space-y-1">
                  {navItems.map((item) => (
                    <div key={item.path}>
                      {item.dropdown ? (
                        <div className="rounded-xl overflow-hidden">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                            className="w-full flex items-center justify-between p-3 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-xl"
                          >
                            <span className="text-sm font-medium">{item.label}</span>
                            <motion.svg
                              animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-900/50 p-2"
                              >
                                {item.dropdown.map((dropItem) => (
                                  <Link
                                    key={dropItem.path}
                                    to={dropItem.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                                  >
                                    {dropItem.icon && (
                                      <span className="p-2 rounded-lg bg-slate-900/50 text-white/40 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-all duration-300">
                                        {renderIcon(dropItem.icon)}
                                      </span>
                                    )}
                                    {dropItem.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block p-3 text-sm font-medium transition-all duration-300 rounded-xl ${
                            location.pathname === item.path
                              ? 'text-purple-400 bg-purple-500/10'
                              : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-white/5 mt-2">
                  <ConnectButton onConnect={onConnect} onDisconnect={onDisconnect} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header; 