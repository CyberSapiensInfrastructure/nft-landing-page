import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, 
  useMotionTemplate, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from 'framer-motion';

export interface NFT {
  id: number;
  name: string;
  image: string;
  price: number;
  status: 'completed' | 'not_completed';
  expireDate: string;
  missionAmount: number;
}

interface NFTCardProps {
  nft: NFT;
  onSelect: (nft: NFT) => void;
  isSelected: boolean;
}

const ROTATION_RANGE = 32;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;
const PERSPECTIVE = "1200px";

const NFTCard = ({ nft, onSelect, isSelected }: NFTCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {
    stiffness: isSelected ? 400 : 300,
    damping: isSelected ? 25 : 30,
    mass: 1
  };

  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  const sheenOpacity = useTransform(
    ySpring,
    [-HALF_ROTATION_RANGE, 0, HALF_ROTATION_RANGE],
    [0.5, 0, 0.5]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      style={{ perspective: PERSPECTIVE }} 
      className={`group cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-[1.02] -rotate-1' : ''
      }`}
      onClick={() => onSelect(nft)}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-gradient-to-r overflow-hidden rounded-xl transition-all duration-300
          ${isSelected 
            ? 'from-[#7042f8]/30 to-[#7042f8]/20 shadow-lg shadow-[#7042f8]/20 border-2 border-[#7042f8]/30' 
            : 'from-[#a8c7fa]/20 to-[#a8c7fa]/10 border border-[#a8c7fa]/20'
          }
          hover:from-[#a8c7fa]/30 hover:to-[#a8c7fa]/20
          group-hover:shadow-lg group-hover:shadow-[#a8c7fa]/10`}
      >
        <div className="flex items-center gap-8 p-8">
          {/* Left Side - Mission Info */}
          <div className="flex items-center gap-8">
            {/* NFT Image with Sheen Effect */}
            <div className={`relative w-40 h-40 rounded-xl overflow-hidden transition-transform duration-500
              ${isSelected ? 'shadow-lg shadow-[#7042f8]/20 scale-105' : 'shadow-lg shadow-black/50'}
              border ${isSelected ? 'border-[#7042f8]/30' : 'border-[#a8c7fa]/30'}`}
            >
              <img 
                src={nft.image} 
                alt={nft.name}
                className={`w-full h-full object-cover transition-all duration-500
                  ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
              />
              <motion.div
                style={{ opacity: sheenOpacity }}
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/0 to-white/20"
              />
              
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 left-3 w-6 h-6 bg-[#7042f8] rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium 
                ${nft.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                {nft.status === 'completed' ? 'Completed' : 'Pending'}
              </div>
            </div>

            {/* Mission Info */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[#a8c7fa]/60 uppercase tracking-wider mb-1">Mission Name</div>
                <div className="text-xl font-medium text-white/90 tracking-wide">{nft.name}</div>
              </div>
              
              <div className="flex gap-8">
                <div>
                  <div className="text-sm text-[#a8c7fa]/60 uppercase tracking-wider mb-1">Amount</div>
                  <div className="text-lg text-white/80">{nft.missionAmount}</div>
                </div>
                
                <div>
                  <div className="text-sm text-[#a8c7fa]/60 uppercase tracking-wider mb-1">Expires</div>
                  <div className="text-lg text-white/80">{nft.expireDate}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between text-sm text-[#a8c7fa]/60 mb-2">
                  <span>Progress</span>
                  <span>{nft.status === 'completed' ? '100%' : '0%'}</span>
                </div>
                <div className="h-2 bg-[#a8c7fa]/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full
                      ${nft.status === 'completed' 
                        ? 'bg-gradient-to-r from-green-500 to-green-400 w-full' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-400 w-0'
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Status */}
          <div className="flex flex-col items-center gap-3 ml-auto">
            <div className="text-lg font-medium text-[#a8c7fa]/80">Mission Status</div>
            {nft.status === 'completed' ? (
              <div className="w-16 h-16 text-green-400 animate-pulse">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 text-orange-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <div className="text-sm text-[#a8c7fa]/60 text-center max-w-[200px]">
              {nft.status === 'completed' 
                ? 'Mission completed successfully!'
                : 'Mission is still in progress'
              }
            </div>
          </div>
        </div>

        {/* Enhanced Sheen overlay for selected state */}
        <motion.div
          style={{ opacity: sheenOpacity }}
          className={`absolute inset-0 bg-gradient-to-br pointer-events-none
            ${isSelected 
              ? 'from-white/15 via-transparent to-white/15' 
              : 'from-white/10 via-transparent to-white/10'
            }`}
        />
      </motion.div>
    </div>
  );
};

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
}

const NFTGrid: React.FC<NFTGridProps> = ({ nfts, isLoading, onSelect, selectedNFTId }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="h-32 bg-gradient-to-r from-[#a8c7fa]/20 to-[#a8c7fa]/10 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {nfts.map((nft) => (
        <div key={nft.id} className="block">
          <NFTCard 
            nft={nft} 
            onSelect={onSelect}
            isSelected={nft.id === selectedNFTId}
          />
        </div>
      ))}
    </div>
  );
};

export default NFTGrid; 