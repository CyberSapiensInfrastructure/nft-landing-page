import React from 'react';
import { useWallet } from '../context/WalletContext';

interface WalletNotConnectedProps {
  message?: string;
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({ 
  message = "Connect your wallet to view and participate in missions" 
}) => {
  const { connectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto mb-8">
            <svg className="w-full h-full text-[#7042f88b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm0 3.75h.008v3.75H12V12z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
          <p className="text-[#a8c7fa]/60">{message}</p>
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl text-white transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
              />
            </svg>
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletNotConnected; 