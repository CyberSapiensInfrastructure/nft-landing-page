import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    avalanche?: any;
    ethereum?: any;
  }
}

interface ConnectButtonProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ onConnect, onDisconnect }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            onConnect(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, [onConnect]);

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        onConnect(accounts[0]);
      } catch (error) {
        console.error('Error connecting:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  const handleDisconnect = async () => {
    try {
      setAddress(null);
      setIsConnecting(false);

      const walletProvider = window.ethereum || window.avalanche;
      if (walletProvider) {
        // Remove event listeners
        walletProvider.removeAllListeners('accountsChanged');
        walletProvider.removeAllListeners('chainChanged');
        walletProvider.removeAllListeners('disconnect');

        // If using Core Wallet
        if (window.avalanche) {
          await window.avalanche.disconnect();
        }
      }

      // Clear local storage
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');

      // Call parent's disconnect handler
      onDisconnect();

      // Force reload to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-[#0c0c0c] text-[#a8c7fa]/60 rounded-xl border border-[#a8c7fa]/10">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-[#a8c7fa]/60 hover:text-white 
                   rounded-xl border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300"
        >
          disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-6 py-2.5 bg-[#7042f88b] hover:bg-[#7042f88b]/80 text-white rounded-xl 
               transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          connecting...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          connect wallet
        </>
      )}
    </button>
  );
};
