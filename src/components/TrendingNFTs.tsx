import React from 'react';
import type { NFT } from './NFTGrid';
import nftImage from '../assets/img/nft.jpg';

interface TrendingNFTsProps {
  onSelectNFT: (nft: NFT) => void;
}

const trendingNFTs: NFT[] = [
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
];

const TrendingNFTs: React.FC<TrendingNFTsProps> = ({ onSelectNFT }) => {
  return (
    <section className="py-12 bg-[#0c0c0c]/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">trending nfts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNFTs.map((nft) => (
            <div
              key={nft.id}
              onClick={() => onSelectNFT(nft)}
              className="bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 overflow-hidden hover:border-[#7042f88b]/50 transition-all cursor-pointer"
            >
              <div className="aspect-square">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
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
                  <span>{nft.expireDate}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-[#a8c7fa]/60">
                    Missions: {nft.missionAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNFTs; 