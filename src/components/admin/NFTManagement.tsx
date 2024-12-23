import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Add type declarations for Core Wallet and MetaMask
declare global {
  interface Window {
    avalanche?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      isConnected: () => boolean;
    };
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      isConnected: () => boolean;
    };
  }
}

// Contract addresses for Fuji testnet
const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';
const LAUNCH_ADDRESS = '0x5Da9f3af025808Ec69702Ee45cd315241432b2F6';

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

// ABIs
const F8_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "baseUri_",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "intfLP",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mintF8",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getList",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const LAUNCH_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "buyToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "buyTokenStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const NFTManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [nftInfo, setNftInfo] = useState({
    symbol: "",
    name: "",
    totalSupply: ""
  });
  const [mintAddress, setMintAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [nftMetadata, setNftMetadata] = useState("");
  const [nftImage, setNftImage] = useState("");

  // Verify and switch to Fuji network
  const ensureFujiNetwork = async (provider: ethers.providers.Web3Provider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = "0x" + network.chainId.toString(16);
      
      if (chainId !== FUJI_CHAIN_ID) {
        try {
          // Try to switch to Fuji
          await provider.send("wallet_switchEthereumChain", [
            { chainId: FUJI_CHAIN_ID }
          ]);
        } catch (switchError: any) {
          // If Fuji is not added to the wallet, add it
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
      alert("Please switch to the Avalanche Fuji Testnet to continue.");
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      // Check if Core Wallet is available
      const isCoreAvailable = typeof window.avalanche !== 'undefined';
      // Check if MetaMask is available
      const isMetaMaskAvailable = typeof window.ethereum !== 'undefined';

      if (!isCoreAvailable && !isMetaMaskAvailable) {
        alert("Please install MetaMask or Core Wallet");
        return;
      }

      let web3Provider: ethers.providers.Web3Provider;
      
      if (isCoreAvailable && window.avalanche) {
        // Use Core Wallet with proper modal
        try {
          await window.avalanche.request({ method: 'eth_requestAccounts' });
          web3Provider = new ethers.providers.Web3Provider(window.avalanche, {
            chainId: parseInt(FUJI_CHAIN_ID, 16),
            name: 'Avalanche Fuji Testnet',
            ensAddress: null // Disable ENS
          });
        } catch (err) {
          console.error("User rejected Core Wallet connection");
          return;
        }
      } else if (isMetaMaskAvailable && window.ethereum) {
        // Use MetaMask
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          web3Provider = new ethers.providers.Web3Provider(window.ethereum, {
            chainId: parseInt(FUJI_CHAIN_ID, 16),
            name: 'Avalanche Fuji Testnet',
            ensAddress: null // Disable ENS
          });
        } catch (err) {
          console.error("User rejected MetaMask connection");
          return;
        }
      } else {
        throw new Error("No wallet provider found");
      }

      // Ensure we're on Fuji network
      const isCorrectNetwork = await ensureFujiNetwork(web3Provider);
      if (!isCorrectNetwork) return;

      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setUserAddress(address);

      // Get initial contract info
      await getContractInfo(web3Provider, web3Signer);

      // Setup event listeners
      web3Provider.on("accountsChanged", (accounts: string[]) => {
        setUserAddress(accounts[0]);
      });
      web3Provider.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Get contract info
  const getContractInfo = async (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => {
    try {
      const f8Contract = new ethers.Contract(F8_ADDRESS, F8_ABI, signer);
      
      const [symbol, name, totalSupply] = await Promise.all([
        f8Contract.symbol(),
        f8Contract.name(),
        f8Contract.totalSupply()
      ]);

      setNftInfo({
        symbol,
        name,
        totalSupply: totalSupply.toString()
      });
    } catch (error) {
      console.error("Failed to get contract info:", error);
    }
  };

  // Mint NFT
  const handleMint = async () => {
    if (!signer || !mintAddress) return;
    
    try {
      setIsLoading(true);
      
      // Create contract with signer
      const f8Contract = new ethers.Contract(
        F8_ADDRESS, 
        F8_ABI, 
        signer
      );
      
      // Validate the address
      try {
        ethers.utils.getAddress(mintAddress); // Will throw if invalid address
      } catch (err) {
        throw new Error("Invalid Ethereum address");
      }
      
      // Call mint function with the specified address
      const tx = await f8Contract.mintF8(mintAddress, {
        gasLimit: 500000 // Add explicit gas limit
      });
      
      console.log("Mint transaction sent:", tx.hash);
      const receipt = await tx.wait(1);
      
      if (receipt.status) {
        console.log("Mint successful:", tx.hash);
        // Refresh total supply
        const totalSupply = await f8Contract.totalSupply();
        setNftInfo(prev => ({ ...prev, totalSupply: totalSupply.toString() }));
        alert("NFT minted successfully!");
      }
    } catch (error: any) {
      console.error("Failed to mint:", error);
      alert(error.message || "Failed to mint NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get NFT metadata
  const getNFTMetadata = async () => {
    if (!signer || !tokenId) return;

    try {
      setIsLoading(true);
      const f8Contract = new ethers.Contract(F8_ADDRESS, F8_ABI, signer);
      const tokenURI = await f8Contract.tokenURI(tokenId);
      
      // Log the URI for debugging
      console.log("Token URI:", tokenURI);
      
      // Add CORS proxy if needed
      const corsProxy = "https://cors-anywhere.herokuapp.com/";
      const metadataUrl = `${corsProxy}${tokenURI}.json`;
      
      // Fetch metadata with proper headers
      const response = await fetch(metadataUrl, {
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const metadata = await response.json();
      console.log("Metadata:", metadata);
      
      setNftMetadata(JSON.stringify(metadata, null, 2));
      if (metadata.image) {
        // Add CORS proxy to image URL if needed
        setNftImage(`${corsProxy}${metadata.image}`);
      }
    } catch (error: any) {
      console.error("Failed to get NFT metadata:", error);
      alert("Failed to fetch NFT metadata: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's NFTs
  const getMyNFTs = async () => {
    if (!signer || !userAddress) return;

    try {
      setIsLoading(true);
      const f8Contract = new ethers.Contract(F8_ADDRESS, F8_ABI, signer);
      const nftList = await f8Contract.getList(userAddress);
      
      console.log("NFT List:", nftList);
      
      // Get metadata for each NFT
      const corsProxy = "https://cors-anywhere.herokuapp.com/";
      const metadataPromises = nftList.map(async (tokenId: string) => {
        const tokenURI = await f8Contract.tokenURI(tokenId);
        console.log(`Token ${tokenId} URI:`, tokenURI);
        
        const response = await fetch(`${corsProxy}${tokenURI}.json`, {
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch metadata for token ${tokenId}`);
          return null;
        }
        
        return response.json();
      });

      const allMetadata = (await Promise.all(metadataPromises)).filter(Boolean);
      console.log("All metadata:", allMetadata);
      setNftMetadata(JSON.stringify(allMetadata, null, 2));
    } catch (error: any) {
      console.error("Failed to get NFT list:", error);
      alert("Failed to fetch NFT list: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setNftInfo({
      symbol: "",
      name: "",
      totalSupply: ""
    });
    setNftMetadata("");
    setNftImage("");
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">Wallet Connection</h2>
        {!userAddress ? (
          <button
            onClick={connectWallet}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium text-white"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-white">
              <p>Connected Address: {userAddress}</p>
              <p>Symbol: {nftInfo.symbol}</p>
              <p>Name: {nftInfo.name}</p>
              <p>Total Supply: {nftInfo.totalSupply}</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium text-white"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Mint NFT */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">Mint NFT</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter address to mint to"
            className="w-full p-2 rounded-lg bg-slate-700 text-white"
          />
          <button
            onClick={handleMint}
            disabled={isLoading || !userAddress || !mintAddress}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
                      ${isLoading || !userAddress || !mintAddress
                          ? "bg-purple-500/50 cursor-not-allowed"
                          : "bg-purple-500 hover:bg-purple-600"}`}
          >
            {isLoading ? "Minting..." : "Mint NFT"}
          </button>
        </div>
      </div>

      {/* NFT Metadata */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">NFT Information</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
            className="w-full p-2 rounded-lg bg-slate-700 text-white"
          />
          <div className="flex space-x-4">
            <button
              onClick={getNFTMetadata}
              disabled={isLoading || !userAddress}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                        ${isLoading || !userAddress
                            ? "bg-purple-500/50 cursor-not-allowed"
                            : "bg-purple-500 hover:bg-purple-600"}`}
            >
              Get NFT Metadata
            </button>
            <button
              onClick={getMyNFTs}
              disabled={isLoading || !userAddress}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                        ${isLoading || !userAddress
                            ? "bg-purple-500/50 cursor-not-allowed"
                            : "bg-purple-500 hover:bg-purple-600"}`}
            >
              Get My NFTs
            </button>
          </div>
        </div>
      </div>

      {/* Display Results */}
      {(nftMetadata || nftImage) && (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Results</h2>
          {nftImage && (
            <img src={nftImage} alt="NFT" className="max-w-sm mx-auto mb-4 rounded-lg" />
          )}
          {nftMetadata && (
            <pre className="bg-slate-700 p-4 rounded-lg overflow-auto text-white">
              {nftMetadata}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
