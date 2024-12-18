import React from 'react';
import { motion } from 'framer-motion';
import nftImage from '../assets/img/nft.jpg';
import { NFT } from './NFTGrid';
import { useNavigate } from 'react-router-dom';

interface TrendingNFTsProps {
  onSelectNFT: (nft: NFT) => void;
}

const TrendingNFTs: React.FC<TrendingNFTsProps> = ({ onSelectNFT }) => {
  const navigate = useNavigate();

  const trendingNFTs: NFT[] = [
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
  ];

  return (
    <div className="py-12 bg-[#0c0c0c]/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending NFTs</h2>
          <button 
            onClick={() => navigate('/list')}
            className="text-sm text-[#a8c7fa]/60 hover:text-[#a8c7fa] transition-colors"
          >
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectNFT(nft)}
              className="bg-[#0c0c0c]/50 border border-[#a8c7fa]/10 rounded-xl overflow-hidden group 
                         cursor-pointer hover:border-[#a8c7fa]/30 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <img 
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 z-20 px-2 py-1 rounded-full text-xs font-medium 
                  ${nft.status === "completed" 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {nft.status === "completed" ? "Completed" : "In Progress"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{nft.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#a8c7fa]/60">Floor Price</span>
                  <span className="text-sm font-medium">{nft.price} ETH</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingNFTs; 