import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
  onTabChange: (tab: string) => void;
}

export function AdminLayout({ children, onTabChange }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Ekran boyutunu kontrol et
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'nfts', label: 'NFT Management', icon: '🖼️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex font-['Poppins']">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1E293B] shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Providence
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen) && (
          <>
            {/* Overlay for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}
            
            <motion.aside
              initial={isMobile ? { x: -280 } : { x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`bg-[#1E293B] text-white w-[280px] fixed z-50 ${
                isMobile ? 'top-0 h-full' : 'top-0 h-screen'
              }`}
            >
              <div className="p-6 hidden lg:block">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                  Providence
                </motion.h2>
                <p className="text-gray-400 text-sm mt-1">Providence Admin</p>
              </div>

              <nav className={`mt-8 ${isMobile ? 'mt-16' : ''}`}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Menu
                </div>
                {menuItems.map((item) => (
                  <motion.a
                    key={item.id}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-r-4 border-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-[#2D3B52]'
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </nav>

              <motion.div 
                whileHover={{ y: -2 }}
                className="absolute bottom-0 w-full bg-[#1E293B] p-4 hidden lg:block"
              >
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
                >
                  Logout
                </button>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className={`flex-1 ${isMobile ? 'mt-14' : ''}`}
        animate={{ 
          marginLeft: isSidebarOpen ? '280px' : '0',
          width: isSidebarOpen ? 'calc(100% - 280px)' : '100%'
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        {/* Desktop Header */}
        <header className="bg-[#1E293B] shadow-lg sticky top-0 z-10 hidden lg:block">
          <div className="flex items-center justify-between px-6 py-4">
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, Admin</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 bg-[#0F172A]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1E293B] rounded-xl shadow-xl p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
} 