import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NFT } from '../components/NFTGrid';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFT = async () => {
      setLoading(true);
      try {
        // Mock data - gerçek uygulamada API'den gelecek
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
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514]">
      <Header />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Image */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#a8c7fa]/20">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* NFT Properties */}
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

            {/* Right Column - Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-medium mb-4">{nft.name}</h1>
                <p className="text-[#a8c7fa]/60">
                  This exclusive Providence NFT grants you access to special features and rewards in the Providence ecosystem.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Mission Amount</div>
                    <div className="text-xl text-white">{nft.missionAmount}</div>
                  </div>
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Expires In</div>
                    <div className="text-xl text-white">{nft.expireDate}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-[#a8c7fa]/60 mb-2">
                    <span>Completion Progress</span>
                    <span>{nft.status === 'completed' ? '100%' : '0%'}</span>
                  </div>
                  <div className="h-2 bg-[#a8c7fa]/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: nft.status === 'completed' ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        nft.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : 'bg-gradient-to-r from-orange-500 to-orange-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {!nft.status && (
                    <button className="w-full px-6 py-4 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                                     rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Mint NFT
                    </button>
                  )}
                  
                  {nft.status === 'completed' && (
                    <button className="w-full px-6 py-4 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                                     rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Transfer NFT
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NFTDetail; 