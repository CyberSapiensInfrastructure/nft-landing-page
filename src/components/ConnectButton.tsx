import React, { useState, useEffect } from 'react';
import { connectWallet } from '../main';
import WalletModal from './WalletModal';
import { ethers } from 'ethers';

interface ConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ onConnect, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await signer.getBalance();
            setAddress(address);
            setBalance(ethers.utils.formatEther(balance));
            onConnect?.(address);
            localStorage.setItem('walletAddress', address);
          }
        } catch (error) {
          console.error("Failed to restore wallet connection:", error);
          localStorage.removeItem('walletAddress');
        }
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const wallet = await connectWallet();
      if (wallet) {
        const balance = await wallet.provider.getBalance(wallet.address);
        setAddress(wallet.address);
        setBalance(ethers.utils.formatEther(balance));
        onConnect?.(wallet.address);
        localStorage.setItem('walletAddress', wallet.address);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance("0");
    setIsModalOpen(false);
    localStorage.removeItem('walletAddress');
    onDisconnect?.();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <button
        onClick={address ? () => setIsModalOpen(true) : handleConnect}
        disabled={isConnecting}
        className="px-6 py-2 bg-[#7042f88b] hover:bg-[#7042f8] text-white rounded-xl 
                  flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : address ? (
          <>
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            {formatAddress(address)}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDisconnect={handleDisconnect}
        address={address}
        balance={balance}
      />
    </>
  );
};

export default ConnectButton;
