import React, { useState } from 'react';
import type { NFT } from '../components/NFTGrid';
import nftImage from '../assets/img/nft.jpg';

const marketplaceNFTs: NFT[] = [
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
];

const Marketplace: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold">marketplace</h1>
          <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                view === 'grid'
                  ? 'bg-[#7042f88b] text-white'
                  : 'text-[#a8c7fa]/60 hover:text-[#a8c7fa]'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                view === 'list'
                  ? 'bg-[#7042f88b] text-white'
                  : 'text-[#a8c7fa]/60 hover:text-[#a8c7fa]'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* NFT Grid/List */}
        <div
          className={`${
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
          }`}
        >
          {marketplaceNFTs.map((nft) => (
            <div
              key={nft.id}
              className={`${
                view === 'grid'
                  ? 'bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 overflow-hidden hover:border-[#7042f88b]/50 transition-all cursor-pointer'
                  : 'flex items-center gap-6 bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 overflow-hidden hover:border-[#7042f88b]/50 transition-all cursor-pointer p-4'
              }`}
            >
              {/* NFT Image */}
              <div
                className={`${
                  view === 'grid'
                    ? 'aspect-square w-full'
                    : 'aspect-square w-24 h-24'
                }`}
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* NFT Info */}
              <div
                className={`${
                  view === 'grid' ? 'p-4' : 'flex-1'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#a8c7fa]/60">
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      nft.status === 'completed'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}
                  >
                    {nft.status}
                  </span>
                  <span>•</span>
                  <span>{nft.price} ETH</span>
                </div>
                {view === 'list' && (
                  <div className="mt-2">
                    <span className="text-sm text-[#a8c7fa]/60">
                      Missions: {nft.missionAmount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 