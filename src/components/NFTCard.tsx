import React from 'react';
import { motion } from 'framer-motion';
import { NFT } from './NFTGrid';

interface NFTCardProps {
  nft: NFT;
  view: 'grid' | 'list';
  onClick: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, view, onClick }) => {
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="bg-[#0c0c0c]/50 border border-[#a8c7fa]/10 rounded-xl overflow-hidden group 
                   cursor-pointer hover:border-[#a8c7fa]/30 transition-all duration-300"
      >
        <div className="flex items-center p-4">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden">
            <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium">{nft.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-[#a8c7fa]/60">Floor Price: {nft.price} ETH</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium 
                ${nft.status === "completed" 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                }`}
              >
                {nft.status === "completed" ? "Completed" : "In Progress"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
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
  );
};

export default NFTCard; 