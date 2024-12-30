import { NFT } from './types';
import { NFTListItemContent } from './NFTListItemContent';

interface NFTListProps {
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
}

export const NFTList: React.FC<NFTListProps> = ({ nfts, onSelect, selectedNFTId }) => {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="mt-4 text-gray-400">Connect your wallet to view your NFTs</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {nfts.map((nft) => (
        <div 
          key={nft.id}
          onClick={() => onSelect(nft)}
          className={`flex items-center gap-2.5 border border-[#a8c7fa]/10 mx-3
            p-2 rounded-xl hover:bg-[#a8c7fa]/5 transition-all duration-300 cursor-pointer
            ${selectedNFTId === nft.id ? 'ring-2 ring-[#7042f88b] bg-[#7042f88b]/5' : ''}`}
        >
          <img 
            src={nft.image} 
            alt={nft.name}
            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
          />
          <NFTListItemContent nft={nft} />
        </div>
      ))}
    </div>
  );
}; 