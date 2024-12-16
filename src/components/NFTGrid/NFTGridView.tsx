import { NFT } from './types';

interface NFTGridViewProps {
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
}

export const NFTGridView: React.FC<NFTGridViewProps> = ({ nfts, onSelect, selectedNFTId }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {nfts.map((nft) => (
      <div 
        key={nft.id}
        onClick={() => onSelect(nft)}
        className={`relative group bg-[#0c0c0c]/50 backdrop-blur-md border border-[#a8c7fa]/10 rounded-xl p-3 
          hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer
          ${selectedNFTId === nft.id ? 'ring-2 ring-[#7042f88b]' : ''}`}
      >
        <img src={nft.image} alt={nft.name} className="w-full aspect-square object-cover rounded-lg" />
        {/* ... rest of grid item content ... */}
      </div>
    ))}
  </div>
); 