import { NFT } from './types';
import { NFTListItemContent } from './NFTListItemContent';

interface NFTListProps {
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
}

export const NFTList: React.FC<NFTListProps> = ({ nfts, onSelect, selectedNFTId }) => (
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