import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import TrendingNFTs from '../components/TrendingNFTs';
import { NFTGrid } from '../components/NFTGrid';
import { BottomSheet } from '../components/BottomSheet';
import type { NFT } from '../components/NFTGrid';
import nftImage from '../assets/img/nft.jpg';

const Home: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');

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
        setNfts(mockNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div>
      <Hero />
      <Categories />
      <TrendingNFTs onSelectNFT={handleNFTSelect} />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">featured nfts</h2>
          <Link
            to="/list"
            className="px-6 py-2.5 bg-[#7042f88b] hover:bg-[#7042f88b]/80 text-white rounded-xl 
                     transition-all duration-300 flex items-center gap-2"
          >
            view all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <NFTGrid
          nfts={nfts}
          isLoading={isLoading}
          onSelect={handleNFTSelect}
          selectedNFTId={selectedNFT?.id}
          view={view}
          onViewChange={setView}
          onTabChange={() => {}}
        />
      </div>

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
  );
};

export default Home; 