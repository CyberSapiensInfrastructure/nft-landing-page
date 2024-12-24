import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
  address: string | null;
  balance: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onDisconnect,
  address,
  balance
}) => {
  if (!isOpen) return null;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                     w-full max-w-md bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl p-6
                     backdrop-blur-xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Wallet</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#a8c7fa]/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="bg-[#a8c7fa]/5 rounded-lg p-4">
                <div className="text-sm text-[#a8c7fa]/60 mb-1">Address</div>
                <div className="text-white font-medium">{address ? formatAddress(address) : '-'}</div>
              </div>

              {/* Balance */}
              <div className="bg-[#a8c7fa]/5 rounded-lg p-4">
                <div className="text-sm text-[#a8c7fa]/60 mb-1">Balance</div>
                <div className="text-white font-medium">{balance} AVAX</div>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <button
                  onClick={onDisconnect}
                  className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-500
                           rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletModal; 