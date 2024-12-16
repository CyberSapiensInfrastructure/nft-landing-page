import { NFT } from './types';

interface NFTListItemContentProps {
  nft: NFT;
}

export const NFTListItemContent: React.FC<NFTListItemContentProps> = ({ nft }) => (
  <div className="flex-1 flex justify-between items-center min-w-0">
    <div className="space-y-0.5 min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <h3 className="text-base font-medium text-white truncate">{nft.name}</h3>
        <div className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap
          ${nft.status === 'completed' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          }`}>
          {nft.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-[#a8c7fa]/60">Mission:</span>
          <span className="text-white font-medium">{nft.missionAmount}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#a8c7fa]/60">Expires:</span>
          <span className="text-white font-medium truncate">{nft.expireDate}</span>
        </div>
      </div>
    </div>
  </div>
); 