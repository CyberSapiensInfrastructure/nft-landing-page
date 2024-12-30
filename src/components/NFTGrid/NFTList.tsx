import { NFT } from './types';
import { NFTListItemContent } from './NFTListItemContent';
import { useWallet } from '../../context/WalletContext';

interface NFTListProps {
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
}

export const NFTList: React.FC<NFTListProps> = ({ nfts, onSelect, selectedNFTId }) => {
  const { connectWallet } = useWallet();

  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-4xl font-bold text-white">nft collection</h1>
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 px-8 py-4 bg-[#7042f861] hover:bg-[#7042f88b] transition-all duration-300 rounded-full text-white"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Connect Wallet to View Your NFTs
        </button>
        <p className="text-[#a8c7fa]/60">connect your wallet to view your nfts</p>
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