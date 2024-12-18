import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

interface ConnectButtonProps {
  className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ className = "" }) => {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [chainName, setChainName] = useState<string>("");

  useEffect(() => {
    const getChainInfo = async () => {
      if (walletProvider) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const network = await provider.getNetwork();
        setChainName(network.name);
      }
    };
    getChainInfo();
  }, [walletProvider]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      {isConnected ? (
        <div className={`flex items-center gap-3 ${className}`}>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0c0c0c]/50 rounded-lg border border-[#a8c7fa]/10">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-[#a8c7fa]/60">{chainName}</span>
          </div>
          <button
            onClick={() => open()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 
                     border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 rounded-xl transition-all duration-300"
          >
            <span className="text-sm">{formatAddress(address || "")}</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => open()}
          className={`inline-flex items-center justify-center gap-2 ${className}`}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>connect</span>
        </button>
      )}
    </>
  );
};

export default ConnectButton;
