import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import nftImage from '../assets/img/nft.jpg';
import { DecoElements } from '../components/Layout';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const NFTDetail = () => {
  useScrollToTop();
  const { id } = useParams();

  const nft = {
    id: Number(id),
    name: ["WHITELIST", "AIRDROP", "REBORN", "GENESIS"][Number(id) - 1],
    image: nftImage,
    status: Number(id) % 2 === 0 ? 'not_completed' : 'completed',
    expireDate: "31.12.2024 - 23:59:59",
    missionAmount: Number(id) - 1,
    description: "This exclusive NFT grants you special access and privileges in the Providence ecosystem. Complete missions to unlock full potential.",
    rarity: "Legendary",
    creator: "Providence Labs",
    collection: "Genesis Collection",
    blockchain: "Avalanche",
    missions: [
      { name: "Join Discord", completed: true },
      { name: "Follow Twitter", completed: true },
      { name: "Share Announcement", completed: false },
      { name: "Invite Friends", completed: false }
    ]
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={id}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white relative overflow-hidden"
      >
        <DecoElements />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to NFTs
            </Link>
          </motion.div>

          {/* NFT Content */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column */}
              <motion.div 
                variants={itemVariants}
                className="lg:w-1/2 space-y-8"
              >
                {/* Image Container with hover effect */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7042f88b]/0 to-[#7042f88b]/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full aspect-square object-cover rounded-2xl border border-[#a8c7fa]/10"
                  />
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        {nft.collection}
                      </span>
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        #{nft.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10 backdrop-blur-sm">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Mission Amount</div>
                    <div className="text-xl text-white">{nft.missionAmount}</div>
                  </div>
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10 backdrop-blur-sm">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Expires In</div>
                    <div className="text-xl text-white">{nft.expireDate}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div 
                variants={itemVariants}
                className="lg:w-1/2 space-y-8"
              >
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">{nft.name}</h1>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium 
                      ${nft.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                      {nft.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  <p className="text-[#a8c7fa]/60 text-lg">{nft.description}</p>
                </div>

                {/* Properties */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Properties</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Rarity</div>
                      <div className="text-white mt-1">{nft.rarity}</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Creator</div>
                      <div className="text-white mt-1">{nft.creator}</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Collection</div>
                      <div className="text-white mt-1">{nft.collection}</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Blockchain</div>
                      <div className="text-white mt-1">{nft.blockchain}</div>
                    </div>
                  </div>
                </div>

                {/* Missions Progress */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Missions</h2>
                  <div className="space-y-3">
                    {nft.missions.map((mission, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10"
                      >
                        <span className="text-white">{mission.name}</span>
                        {mission.completed ? (
                          <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#a8c7fa]/30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons with enhanced animations */}
                <div className="space-y-3 pt-6">
                  {nft.status !== 'completed' && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                        hover:shadow-lg hover:shadow-[#d8624b]/20"
                    >
                      <motion.svg 
                        className="w-5 h-5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </motion.svg>
                      Mint NFT
                    </motion.button>
                  )}
                  
                  {nft.status === 'completed' && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                        hover:shadow-lg hover:shadow-[#7042f8]/20"
                    >
                      <motion.svg 
                        className="w-5 h-5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </motion.svg>
                      Transfer NFT
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFTDetail; 