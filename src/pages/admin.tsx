import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AdminLayout } from '../components/AdminLayout';
import { Dashboard } from '../components/admin/Dashboard';
import { Users } from '../components/admin/Users';
import { NFTManagement } from '../components/admin/NFTManagement';
import { Settings } from '../components/admin/Settings';

// Fuji Chain Configuration
const FUJI_CHAIN_ID = "0xa869";
const FUJI_CHAIN_CONFIG = {
  chainId: FUJI_CHAIN_ID,
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
};

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const switchToFuji = async (provider: EthereumProvider) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: FUJI_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // Chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [FUJI_CHAIN_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Fuji chain:', addError);
          return false;
        }
      }
      console.error('Error switching to Fuji chain:', switchError);
      return false;
    }
  };

  const connectWallet = async () => {
    const provider = window.ethereum || window.avalanche;
    
    if (!provider) {
      alert('Please install Core Wallet or MetaMask');
      return;
    }

    try {
      setIsConnecting(true);

      // Switch to Fuji testnet
      const switched = await switchToFuji(provider);
      if (!switched) {
        alert('Failed to switch to Fuji testnet');
        return;
      }

      // Request account access
      await provider.request({ method: 'eth_requestAccounts' });
      
      // Create Web3Provider
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      
      setProvider(web3Provider);
      setAccount(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
  };

  useEffect(() => {
    // Check if wallet is already connected
    const provider = window.ethereum || window.avalanche;
    if (provider) {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      web3Provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setProvider(web3Provider);
          setAccount(accounts[0]);
        }
      });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setProvider(null);
          setAccount(null);
        }
      };

      // Listen for chain changes
      const handleChainChanged = (chainId: string) => {
        if (chainId !== FUJI_CHAIN_ID) {
          setProvider(null);
          setAccount(null);
          alert('Please switch to Avalanche Fuji Testnet');
        }
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);

      return () => {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard provider={provider} account={account} />;
      case 'users':
        return <Users provider={provider} account={account} />;
      case 'nfts':
        return <NFTManagement provider={provider} account={account} />;
      case 'settings':
        return <Settings provider={provider} account={account} />;
      default:
        return <Dashboard provider={provider} account={account} />;
    }
  };

  return (
    <AdminLayout onTabChange={setActiveComponent}>
      <div className="flex justify-end mb-4">
        {!account ? (
          <button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-4 py-2 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl text-white transition-all disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                connecting...
              </div>
            ) : (
              'connect wallet'
            )}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-[#0c0c0c] rounded-xl border border-[#a8c7fa]/10">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <button 
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl transition-all"
            >
              disconnect
            </button>
          </div>
        )}
      </div>
      {renderComponent()}
    </AdminLayout>
  );
} 