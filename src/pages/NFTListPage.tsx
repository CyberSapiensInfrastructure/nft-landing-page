import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { NFTGrid } from '../components/NFTGrid';
import { BottomSheet } from '../components/BottomSheet';
import { FilterBar } from '../components/FilterBar';
import type { NFT } from '../components/NFTGrid';
import nftImage from '../assets/img/nft.jpg';

const NFTListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  
  // Get initial values from URL or use defaults
  const [view, setView] = useState<'list' | 'grid'>(
    searchParams.get('view') as 'list' | 'grid' || 'grid'
  );
  const [activeTab, setActiveTab] = useState<'all' | 'my'>(
    searchParams.get('tab') as 'all' | 'my' || 'all'
  );
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    category: searchParams.get('category') || 'all',
    sortBy: searchParams.get('sort') || 'newest',
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (view !== 'grid') params.set('view', view);
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.sortBy !== 'newest') params.set('sort', filters.sortBy);
    
    setSearchParams(params, { replace: true });
  }, [view, activeTab, filters, setSearchParams]);

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // Simulated NFT data
        const mockNFTs = [
          {
            id: 1,
            name: "WHITELIST",
            image: nftImage,
            price: 0.5,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0,
          },
          {
            id: 2,
            name: "AIRDROP",
            image: nftImage,
            price: 0.8,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 1,
          },
          {
            id: 3,
            name: "REBORN",
            image: nftImage,
            price: 1.2,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 2,
          },
          {
            id: 4,
            name: "GENESIS",
            image: nftImage,
            price: 2.0,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 3,
          },
        ] as NFT[];

        // Filter NFTs based on activeTab
        const filteredByTab = activeTab === 'my' 
          ? mockNFTs.filter(nft => nft.status === 'completed')
          : mockNFTs;

        setNfts(filteredByTab);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [activeTab]);

  // Filter NFTs based on current filters
  const filteredNFTs = nfts.filter((nft) => {
    if (filters.status !== 'all' && nft.status !== filters.status) {
      return false;
    }
    if (filters.category !== 'all' && nft.name.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return a.id - b.id;
      case 'price_high_low':
        return b.price - a.price;
      case 'price_low_high':
        return a.price - b.price;
      default: // newest
        return b.id - a.id;
    }
  });

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
  };

  const handleTabChange = (newTab: 'all' | 'my') => {
    setActiveTab(newTab);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">nft collection</h1>
          <FilterBar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            filters={filters}
            setFilters={handleFiltersChange}
            view={view}
            setView={handleViewChange}
          />
        </div>

        <NFTGrid
          nfts={filteredNFTs}
          isLoading={isLoading}
          onSelect={handleNFTSelect}
          selectedNFTId={selectedNFT?.id}
          view={view}
          onViewChange={handleViewChange}
          onTabChange={handleTabChange}
        />

        {/* NFT Detail Modal */}
        <AnimatePresence>
          {selectedNFT && (
            <BottomSheet
              selectedNFT={selectedNFT}
              isOpen={!!selectedNFT}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NFTListPage; 