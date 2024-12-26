import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { resetProvider, setProvider, setSigner } from "../app/slices/walletProvider";
import { ScrollToTop } from './ScrollToTop';
import { GlobalLoader } from './GlobalLoader';
import Header from "./Header";
import Footer from "./Footer";
import { connectWallet } from '../main';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const DecoElements = () => (
  <div
    className="pointer-events-none fixed inset-0 z-30 transition duration-300"
    aria-hidden="true"
  >
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-[--gradient-left,0] top-0 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
      <div className="absolute right-1/4 top-1/4 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
    </div>
  </div>
);

const Layout: React.FC = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const provider = useSelector((state: any) => state.provider.provider);

  const handleConnect = async (address: string) => {
    setWalletAddress(address);
    const wallet = await connectWallet();
    if (wallet) {
      dispatch(setProvider(wallet.provider));
      dispatch(setSigner(wallet.signer));
      localStorage.setItem('walletAddress', address);
    }
  };

  const handleDisconnect = () => {
    dispatch(resetProvider());
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
  };

  // Check for saved wallet connection on mount and show initial loader
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress && window.ethereum) {
      handleConnect(savedAddress);
    }
    // Show loader for at least 2 seconds
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle wallet events
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && walletAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch(setProvider(provider));
      const signer = provider.getSigner();
      dispatch(setSigner(signer));

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          handleConnect(accounts[0]);
        } else {
          handleDisconnect();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    } else {
      handleDisconnect();
    }
  }, [walletAddress, dispatch]);

  return (
    <>
      {/* Global Loader */}
      <AnimatePresence>
        {isLoading && <GlobalLoader />}
      </AnimatePresence>

      {/* Scroll To Top Button */}
      <ScrollToTop />

      <div className="site-font lowercase w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron relative">
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
          <div className="absolute inset-0 bg-noise animate-noise" />
        </div>
        <DecoElements />
        
        {/* Header */}
        <Header onConnect={handleConnect} onDisconnect={handleDisconnect} />
        
        {/* Main Content with Page Transitions */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="relative"
              style={{ position: 'relative' }}
            >
              <Outlet context={{ provider, account: walletAddress }} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
