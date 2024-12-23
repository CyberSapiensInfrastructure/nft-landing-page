import { useState } from 'react';
import { ethers } from 'ethers';

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

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  // Verify and switch to Fuji network
  const ensureFujiNetwork = async (provider: ethers.providers.Web3Provider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = "0x" + network.chainId.toString(16);
      
      if (chainId !== FUJI_CHAIN_ID) {
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: FUJI_CHAIN_ID }
          ]);
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await provider.send("wallet_addEthereumChain", [FUJI_CHAIN_CONFIG]);
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Failed to switch to Fuji network:", error);
      setError("Please switch to the Avalanche Fuji Testnet to continue.");
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError("");

      const isCoreAvailable = typeof window.avalanche !== 'undefined';
      const isMetaMaskAvailable = typeof window.ethereum !== 'undefined';

      if (!isCoreAvailable && !isMetaMaskAvailable) {
        throw new Error("Please install MetaMask or Core Wallet");
      }

      let walletProvider: any;
      
      if (isCoreAvailable && window.avalanche) {
        walletProvider = window.avalanche;
      } else if (isMetaMaskAvailable && window.ethereum) {
        walletProvider = window.ethereum;
      } else {
        throw new Error("No wallet provider found");
      }

      await walletProvider.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(walletProvider);

      const isCorrectNetwork = await ensureFujiNetwork(web3Provider);
      if (!isCorrectNetwork) return;

      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setUserAddress(address);

      // Setup event listeners
      walletProvider.on("accountsChanged", (accounts: string[]) => {
        setUserAddress(accounts[0]);
      });
      walletProvider.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setError("");
  };

  return {
    provider,
    signer,
    userAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  };
}; 