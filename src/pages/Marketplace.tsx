import React, { useState, useMemo } from 'react';
import { DecoElements } from '../components/Layout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { FilterBar } from '../components/FilterBar';
import { NFTGrid } from '../components/NFTGrid';
import nftImage from "../assets/img/nft.jpg";
import { NFT } from '../components/NFTGrid';

const Marketplace: React.FC = () => {
  useScrollToTop();

  // State'ler
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    sortBy: "newest",
  });
  const [view, setView] = useState<"grid" | "list">("list");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nftCollection, setNftCollection] = useState<NFT[]>([
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
  ]);

  // Filtreleme mantığı
  const filteredNFTs = useMemo(() => {
    let filtered = [...nftCollection];

    // Status filtresi
    if (filters.status !== "all") {
      filtered = filtered.filter((nft) => nft.status === filters.status);
    }

    // Category filtresi
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (nft) => nft.name.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Sıralama
    switch (filters.sortBy) {
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price_low_high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [nftCollection, filters]);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white lowercase">
      <DecoElements />
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
        
        <FilterBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          setFilters={setFilters}
          view={view}
          setView={setView}
        />
        
        <NFTGrid
          nfts={filteredNFTs}
          isLoading={isLoading}
          onSelect={handleNFTSelect}
          selectedNFTId={selectedNFT?.id}
          view={view}
          onViewChange={setView}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace; 