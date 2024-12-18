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

const NFTListPage: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white">
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
          <div className="flex flex-wrap items-center gap-4 p-6 bg-[#0c0c0c]/30 backdrop-blur-sm rounded-2xl border border-[#a8c7fa]/10">
            {/* Status Filter */}
            <div className="flex-1 min-w-[180px]">
              <div className="relative group">
                <label className="inline-flex items-center gap-2 text-sm font-medium mb-2 text-[#a8c7fa] group-hover:text-[#7042f88b] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilters({ status: e.target.value })}
                    className="w-full appearance-none bg-[#0c0c0c]/80 border border-[#a8c7fa]/10 rounded-xl px-4 py-3 text-white/90
                             focus:outline-none focus:border-[#7042f88b] focus:ring-1 focus:ring-[#7042f88b] hover:border-[#7042f88b]/50
                             transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <option value="all" className="bg-[#0c0c0c]">All Status</option>
                    <option value="completed" className="bg-[#0c0c0c]">Completed</option>
                    <option value="not_completed" className="bg-[#0c0c0c]">Not Completed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8c7fa]/60 group-hover:text-[#7042f88b] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 min-w-[180px]">
              <div className="relative group">
                <label className="inline-flex items-center gap-2 text-sm font-medium mb-2 text-[#a8c7fa] group-hover:text-[#7042f88b] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="w-full appearance-none bg-[#0c0c0c]/80 border border-[#a8c7fa]/10 rounded-xl px-4 py-3 text-white/90
                             focus:outline-none focus:border-[#7042f88b] focus:ring-1 focus:ring-[#7042f88b] hover:border-[#7042f88b]/50
                             transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <option value="all" className="bg-[#0c0c0c]">All Categories</option>
                    <option value="whitelist" className="bg-[#0c0c0c]">Whitelist</option>
                    <option value="airdrop" className="bg-[#0c0c0c]">Airdrop</option>
                    <option value="reborn" className="bg-[#0c0c0c]">Reborn</option>
                    <option value="genesis" className="bg-[#0c0c0c]">Genesis</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8c7fa]/60 group-hover:text-[#7042f88b] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-[180px]">
              <div className="relative group">
                <label className="inline-flex items-center gap-2 text-sm font-medium mb-2 text-[#a8c7fa] group-hover:text-[#7042f88b] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="w-full appearance-none bg-[#0c0c0c]/80 border border-[#a8c7fa]/10 rounded-xl px-4 py-3 text-white/90
                             focus:outline-none focus:border-[#7042f88b] focus:ring-1 focus:ring-[#7042f88b] hover:border-[#7042f88b]/50
                             transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <option value="newest" className="bg-[#0c0c0c]">Newest First</option>
                    <option value="oldest" className="bg-[#0c0c0c]">Oldest First</option>
                    <option value="price_high_low" className="bg-[#0c0c0c]">Price: High to Low</option>
                    <option value="price_low_high" className="bg-[#0c0c0c]">Price: Low to High</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8c7fa]/60 group-hover:text-[#7042f88b] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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