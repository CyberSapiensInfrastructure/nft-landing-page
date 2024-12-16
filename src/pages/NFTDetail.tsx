import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NFT } from '../components/NFTGrid';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş NFT verisi - gerçek uygulamada API'den gelecek
    const fetchNFT = async () => {
      setLoading(true);
      try {
        // Mock data
        const mockNFT: NFT = {
          id: Number(id),
          name: `Providence #${id}`,
          image: '/assets/img/nft.jpg',
          price: 0,
          status: 'completed',
          expireDate: "31.12.2024 - 23:59:59",
          missionAmount: 1
        };
        setNft(mockNFT);
      } catch (error) {
        console.error('Error fetching NFT:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nft) {
    return <div>NFT not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] mb-8 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* NFT Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-[#a8c7fa]/20"
          >
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-full object-cover"
            />
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium 
              ${nft.status === 'completed' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
              {nft.status === 'completed' ? 'Completed' : 'Pending'}
            </div>
          </motion.div>

          {/* NFT Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{nft.name}</h1>
              <p className="text-[#a8c7fa]/60">
                This exclusive Providence NFT grants you access to special features and rewards in the Providence ecosystem.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                <div className="text-sm text-[#a8c7fa]/60 mb-1">Amount</div>
                <div className="text-xl text-white">{nft.missionAmount}</div>
              </div>
              <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                <div className="text-sm text-[#a8c7fa]/60 mb-1">Expires</div>
                <div className="text-xl text-white">{nft.expireDate}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!nft.status && (
                <button className="flex-1 px-6 py-3 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                                 rounded-xl text-white/90 transition-all duration-300">
                  Mint Now
                </button>
              )}
              {nft.status === 'completed' && (
                <button className="flex-1 px-6 py-3 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                                 rounded-xl text-white/90 transition-all duration-300">
                  Transfer NFT
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Properties</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                  <div className="text-sm text-[#a8c7fa]/60 mb-1">Collection</div>
                  <div className="text-lg text-white">Providence F8</div>
                </div>
                <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                  <div className="text-sm text-[#a8c7fa]/60 mb-1">Status</div>
                  <div className="text-lg text-white">{nft.status === 'completed' ? 'Minted' : 'Not Minted'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail; 