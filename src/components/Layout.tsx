import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ethers, providers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import {
  resetProvider,
  setProvider,
  setSigner,
} from "../app/slices/walletProvider";
import StackedNotifications from "./Notification";
import ShuffleLoader from "./Loader";
import Footer from "./Footer";
import { NFTGrid, NFT } from "./NFTGrid";
import nftImage from "../assets/img/nft.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "./Header";
import Hero from './Hero';
import Categories from './Categories';
import TrendingNFTs from './TrendingNFTs';
import { BottomSheet } from './BottomSheet';
import { useScrollToTop } from '../hooks/useScrollToTop';

const BackgroundCompiler = React.lazy(
  () => import("../components/BackgroundCompiler")
);

export const DecoElements = () => (
  <div className="pointer-events-none fixed inset-0 z-30 transition duration-300" aria-hidden="true">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-[--gradient-left,0] top-0 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
      <div className="absolute right-1/4 top-1/4 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 h-[--gradient-size,_400px] w-[--gradient-size,_400px] rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-50 blur-[100px]" />
    </div>
  </div>
);

const Layout: React.FC = () => {
  useScrollToTop();
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const dispatch = useDispatch();
  // NFT States
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftCollection, setNftCollection] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");

  // Yeni filtreleme state'i
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    sortBy: 'newest'
  });

  // NFT koleksiyonunu filtreleme
  const displayedNFTs = useMemo(() => {
    return activeTab === "all" ? nftCollection : myNFTs;
  }, [activeTab, nftCollection, myNFTs]);

  // Filtrelenmiş NFT'leri hesapla
  const filteredNFTs = useMemo(() => {
    let filtered = [...displayedNFTs];

    // Status filtresi
    if (filters.status !== 'all') {
      filtered = filtered.filter(nft => nft.status === filters.status);
    }

    // Category filtresi
    if (filters.category !== 'all') {
      filtered = filtered.filter(nft => nft.name.toLowerCase() === filters.category);
    }

    // Sıralama
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'price_high_low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price_low_high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [displayedNFTs, filters]);

  useEffect(() => {
    const handleDisconnect = () => {
      dispatch(resetProvider());
      setWalletAddress("");
    };

    if (walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(
        walletProvider as providers.ExternalProvider
      );
      dispatch(setProvider(web3Provider));
      const signer = web3Provider.getSigner();
      dispatch(setSigner(signer));

      if ("on" in walletProvider && "removeListener" in walletProvider) {
        (walletProvider as any).on("disconnect", handleDisconnect);
        return () => {
          (walletProvider as any).removeListener(
            "disconnect",
            handleDisconnect
          );
        };
      }
    } else {
      handleDisconnect();
    }
  }, [walletProvider, dispatch]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletProvider) {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider as providers.ExternalProvider
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      }
    };
    getAddress();
  }, [walletProvider]);

  // Fetch NFT collection data
  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // Simüle edilmiş NFT verisi
        const mockNFTs = [
          {
            id: 1,
            name: "WHITELIST",
            image: nftImage,
            price: 0,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0,
          },
          {
            id: 2,
            name: "AIRDROP",
            image: nftImage,
            price: 0,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 1,
          },
          {
            id: 3,
            name: "REBORN",
            image: nftImage,
            price: 0,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 2,
          },
          {
            id: 4,
            name: "GENESIS",
            image: nftImage,
            price: 0,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 3,
          },
        ] as NFT[];
        setNftCollection(mockNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  // My NFTs için veri çekme
  useEffect(() => {
    const fetchMyNFTs = async () => {
      if (walletAddress) {
        setIsLoading(true);
        try {
          // Simüle edilmiş veri - gerçek uygulamada API'den gelecek
          const mockMyNFTs = nftCollection.filter(
            (nft) => nft.status === "completed"
          );
          setMyNFTs(mockMyNFTs);
        } catch (error) {
          console.error("Error fetching my NFTs:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMyNFTs([]);
      }
    };

    fetchMyNFTs();
  }, [walletAddress, nftCollection]);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT((currentNFT) => {
      const newSelection = currentNFT?.id === nft.id ? null : nft;
      setIsBottomSheetOpen(!!newSelection);
      return newSelection;
    });
  };

  return (
    <div className="site-font lowercase w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>
      <BackgroundCompiler />
      <ShuffleLoader />
      <DecoElements />
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Categories */}
      <Categories />

      {/* Trending NFTs */}
      <TrendingNFTs onSelectNFT={handleNFTSelect} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Yeni filtre tasarımı */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2.5 ${activeTab === "all" ? 'bg-[#7042f88b]' : 'bg-[#0c0c0c] border border-[#a8c7fa]/10'} 
                         text-white rounded-xl flex items-center gap-2 hover:bg-[#7042f88b]/80 transition-all duration-300`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              all nfts
            </button>
            <button 
              onClick={() => setActiveTab("my")}
              className={`px-6 py-2.5 ${activeTab === "my" ? 'bg-[#7042f88b]' : 'bg-[#0c0c0c] border border-[#a8c7fa]/10'} 
                         text-white rounded-xl flex items-center gap-2 hover:bg-[#7042f88b]/80 transition-all duration-300`}
            >
              my nfts
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="relative group">
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                               flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                               transition-all duration-300 min-w-[160px]">
                <span className="text-[#a8c7fa]/60 text-sm">status:</span>
                <span className="text-white">{filters.status}</span>
                <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 
                            rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {['all', 'completed', 'not_completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters(prev => ({ ...prev, status }))}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                               text-[#a8c7fa]/60 hover:text-white"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                               flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                               transition-all duration-300 min-w-[160px]">
                <span className="text-[#a8c7fa]/60 text-sm">category:</span>
                <span className="text-white">{filters.category}</span>
                <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 
                            rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {['all', 'whitelist', 'airdrop', 'reborn', 'genesis'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilters(prev => ({ ...prev, category }))}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                               text-[#a8c7fa]/60 hover:text-white"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group ml-auto">
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                               flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                               transition-all duration-300 min-w-[160px]">
                <span className="text-[#a8c7fa]/60 text-sm">sort by:</span>
                <span className="text-white">{filters.sortBy}</span>
                <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#a8c7fa]/10 
                            rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {[
                    { value: 'newest', label: 'newest first' },
                    { value: 'oldest', label: 'oldest first' },
                    { value: 'price_high_low', label: 'price: high to low' },
                    { value: 'price_low_high', label: 'price: low to high' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                               text-[#a8c7fa]/60 hover:text-white"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <NFTGrid
          nfts={filteredNFTs}
          isLoading={isLoading}
          onSelect={handleNFTSelect}
          selectedNFTId={selectedNFT?.id}
          view={view}
          onViewChange={setView}
        />
      </div>

      {/* Bottom Sheet (Mobile) */}
      <AnimatePresence>
        {selectedNFT && (
          <>
            <BottomSheet
              selectedNFT={selectedNFT}
              isOpen={isBottomSheetOpen}
              onClose={() => {
                setIsBottomSheetOpen(false);
                setSelectedNFT(null);
              }}
            />
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsBottomSheetOpen(false);
                setSelectedNFT(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      <Footer />
      <StackedNotifications />
    </div>
  );
};

export default Layout;
