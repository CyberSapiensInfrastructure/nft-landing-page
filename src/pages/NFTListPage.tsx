import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NFT } from '../components/NFTGrid';
import { motion, AnimatePresence } from 'framer-motion';
import nftImage from '../assets/img/nft.jpg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DecoElements } from '../components/Layout';
import NFTCard from '../components/NFTCard';
import { BottomSheet } from '../components/BottomSheet';
import { useScrollToTop } from '../hooks/useScrollToTop';

const NFTListPage: React.FC = () => {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "grid">("grid");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // URL'den filtreleri al
  const filters = {
    status: searchParams.get('status') || 'all',
    category: searchParams.get('category') || 'all',
    sortBy: searchParams.get('sort') || 'newest'
  };

  // Mock NFT verisi
  const nftList: NFT[] = [
    { 
      id: 1, 
      name: 'Genesis #1', 
      price: 0.5, 
      image: nftImage,
      status: "completed",
      expireDate: "31.12.2024 - 23:59:59",
      missionAmount: 3
    },
    { 
      id: 2, 
      name: 'Reborn #7', 
      price: 0.8, 
      image: nftImage,
      status: "not_completed",
      expireDate: "31.12.2024 - 23:59:59",
      missionAmount: 2
    },
    { 
      id: 3, 
      name: 'Whitelist #3', 
      price: 0.3, 
      image: nftImage,
      status: "completed",
      expireDate: "31.12.2024 - 23:59:59",
      missionAmount: 1
    },
    { 
      id: 4, 
      name: 'Airdrop #12', 
      price: 0.6, 
      image: nftImage,
      status: "not_completed",
      expireDate: "31.12.2024 - 23:59:59",
      missionAmount: 0
    },
    // Daha fazla NFT eklenebilir
  ];

  // Filtreleri güncelle ve URL'yi değiştir
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    const params = new URLSearchParams();
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== 'all') {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  // Filtrelenmiş NFT'ler
  const filteredNFTs = useMemo(() => {
    let filtered = [...nftList];

    if (filters.status !== 'all') {
      filtered = filtered.filter(nft => nft.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(nft => nft.name.toLowerCase().includes(filters.category));
    }

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
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [nftList, filters]);

  const handleNFTSelect = (nft: NFT) => {
    if (window.innerWidth < 1024) {
      setSelectedNFT((currentNFT) => {
        const newSelection = currentNFT?.id === nft.id ? null : nft;
        setIsBottomSheetOpen(!!newSelection);
        return newSelection;
      });
    } else {
      navigate(`/nft/${nft.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white lowercase">
      <DecoElements />
    

      <div className="container mx-auto px-4 py-8">
        {/* Page Header ve Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="text-3xl font-bold">NFT Collection</h1>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-[#0c0c0c]/50 p-1 rounded-xl border border-[#a8c7fa]/10 backdrop-blur-sm">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  view === "grid"
                    ? "bg-[#7042f88b] text-white shadow-lg shadow-[#7042f88b]/20"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  view === "list"
                    ? "bg-[#7042f88b] text-white shadow-lg shadow-[#7042f88b]/20"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col space-y-6">
            {/* Quick Filter Tabs */}
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2.5 bg-[#7042f88b] text-white rounded-xl flex items-center gap-2 hover:bg-[#7042f8] transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All NFTs
              </button>
              <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#7042f88b]/20 text-[#a8c7fa]/60 hover:text-white rounded-xl flex items-center gap-2 transition-all duration-300 border border-[#a8c7fa]/10">
                My NFTs
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Dropdown */}
              <div className="relative group">
                <button 
                  className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                             border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
                >
                  <span className="text-[#a8c7fa]/60 text-sm">Status:</span>
                  <span className="text-white ml-1">{filters.status === 'all' ? 'All' : filters.status}</span>
                  <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden opacity-0 
                              invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    {['all', 'completed', 'not_completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateFilters({ status })}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                                   ${filters.status === status ? 'text-white bg-[#7042f88b]/10' : 'text-[#a8c7fa]/60'}`}
                      >
                        {status === 'all' ? 'All Status' : status === 'completed' ? 'Completed' : 'Not Completed'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="relative group">
                <button 
                  className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                             border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
                >
                  <span className="text-[#a8c7fa]/60 text-sm">Category:</span>
                  <span className="text-white ml-1">{filters.category === 'all' ? 'All' : filters.category}</span>
                  <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden opacity-0 
                              invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    {['all', 'whitelist', 'airdrop', 'reborn', 'genesis'].map((category) => (
                      <button
                        key={category}
                        onClick={() => updateFilters({ category })}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                                   ${filters.category === category ? 'text-white bg-[#7042f88b]/10' : 'text-[#a8c7fa]/60'}`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group ml-auto">
                <button 
                  className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                             border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
                >
                  <span className="text-[#a8c7fa]/60 text-sm">Sort by:</span>
                  <span className="text-white ml-1">
                    {filters.sortBy === 'newest' ? 'Newest' : 
                     filters.sortBy === 'oldest' ? 'Oldest' :
                     filters.sortBy === 'price_high_low' ? 'Price: High to Low' : 'Price: Low to High'}
                  </span>
                  <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden opacity-0 
                              invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    {[
                      { value: 'newest', label: 'Newest First' },
                      { value: 'oldest', label: 'Oldest First' },
                      { value: 'price_high_low', label: 'Price: High to Low' },
                      { value: 'price_low_high', label: 'Price: Low to High' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilters({ sortBy: option.value })}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                                   ${filters.sortBy === option.value ? 'text-white bg-[#7042f88b]/10' : 'text-[#a8c7fa]/60'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="flex-1">
          <div className={`grid ${
            view === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "grid-cols-1 gap-4"
          }`}>
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                view={view}
                onClick={() => handleNFTSelect(nft)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
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
    </div>
  );
};

export default NFTListPage; 