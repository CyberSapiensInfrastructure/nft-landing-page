import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DecoElements } from './DecoElements';
import nftImage from '../assets/img/nft.jpg';

export const Error = () => {
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
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white relative overflow-hidden"
      >
        <DecoElements />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Collection
            </Link>
          </motion.div>

          {/* NFT Content */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column */}
              <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
                {/* Image Container */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7042f88b]/0 to-[#7042f88b]/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <img 
                    src={nftImage} 
                    alt="404 NFT"
                    className="w-full aspect-square object-cover rounded-2xl border border-[#a8c7fa]/10 grayscale"
                  />
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        Lost Collection
                      </span>
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        #404
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Status</div>
                    <div className="text-xl text-white">Not Found</div>
                  </div>
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60 mb-1">Location</div>
                    <div className="text-xl text-white">Unknown</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">Lost NFT</h1>
                    <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      404 Not Found
                    </div>
                  </div>
                  <p className="text-[#a8c7fa]/60 text-lg">
                    This NFT seems to have wandered off into the digital void. It might be exploring other blockchains or taking a break in the metaverse.
                  </p>
                </div>

                {/* Properties */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Properties</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Rarity</div>
                      <div className="text-white mt-1">Mythical</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Type</div>
                      <div className="text-white mt-1">Ghost NFT</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Collection</div>
                      <div className="text-white mt-1">Lost & Found</div>
                    </div>
                    <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                      <div className="text-sm text-[#a8c7fa]/60">Last Seen</div>
                      <div className="text-white mt-1">Never</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6">
                  <Link to="/">
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
                        whileHover={{ x: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </motion.svg>
                      Return to Collection
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 