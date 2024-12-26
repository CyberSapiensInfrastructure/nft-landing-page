import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import TrendingNFTs from '../components/TrendingNFTs';
import { NFTGrid } from '../components/NFTGrid';
import { BottomSheet } from '../components/BottomSheet';
import { Missions } from '../components/Missions';
import type { NFT } from '../components/NFTGrid';
import nftImage from '../assets/img/nft.jpg';

interface ContextType {
  provider: any;
  account: string | null;
}

const Home: React.FC = () => {
  const { provider, account } = useOutletContext<ContextType>();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);

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

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <Hero />

      {/* Categories */}
      <Categories />

      {/* Trending NFTs */}
      <TrendingNFTs onSelectNFT={(nft) => setSelectedNFT(nft)} />

      {/* Missions Section */}
      <Missions provider={provider} account={account} />

      {/* NFT Grid */}
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
          onSelect={(nft) => setSelectedNFT(nft)}
          selectedNFTId={selectedNFT?.id}
          view={view}
          onViewChange={setView}
          onTabChange={setActiveTab}
        />
      </div>

      {/* NFT Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedNFT && (
          <BottomSheet
            selectedNFT={selectedNFT}
            isOpen={!!selectedNFT}
            onClose={() => setSelectedNFT(null)}
          >
            {/* Bottom sheet content */}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home; 