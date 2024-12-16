import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useDispatch } from "react-redux";
import { ethers, providers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import {
  resetProvider,
  setProvider,
  setSigner,
} from "../app/slices/walletProvider";
import StackedNotifications from "./Notification";
import ShuffleLoader from "./Loader";
import Footer from "./Footer";
import NFTGrid from "./NFTGrid";
import { NFT } from './NFTGrid';
import nftImage from '../assets/img/nft.jpg';

const BackgroundCompiler = React.lazy(
  () => import("../components/BackgroundCompiler")
);

const DecoElements = React.memo(() => (
  <>
    {/* Noise overlay */}
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-soft-light">
      <div className="absolute inset-0 bg-noise animate-noise" />
    </div>

    {/* Particle grid */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#7042f88b]/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>

    {/* Cyber circles */}
    <div className="fixed left-10 top-40 opacity-30 pointer-events-none z-0">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 border border-[#7042f88b]/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-2 border border-[#7042f88b]/10 rounded-full animate-spin-reverse" />
        <div className="absolute inset-4 border border-[#7042f88b]/5 rounded-full animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#7042f88b]/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>

    {/* Energy beams */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="fixed opacity-20 pointer-events-none overflow-hidden"
        style={{
          left: `${30 + i * 30}%`,
          top: "20%",
          transform: "rotate(45deg)",
        }}
      >
        <div
          className="w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#7042f88b] to-transparent animate-energy-beam"
          style={{ animationDelay: `${i * 2}s` }}
        />
      </div>
    ))}
  </>
));

const Layout: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();
  
  // NFT States
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftCollection, setNftCollection] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleDisconnect = () => {
      dispatch(resetProvider());
      setWalletAddress("");
    };

    if (walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(
        walletProvider as providers.ExternalProvider
      );
      dispatch(setProvider(web3Provider));
      const signer = web3Provider.getSigner();
      dispatch(setSigner(signer));

      if ("on" in walletProvider && "removeListener" in walletProvider) {
        (walletProvider as any).on("disconnect", handleDisconnect);
        return () => {
          (walletProvider as any).removeListener("disconnect", handleDisconnect);
        };
      }
    } else {
      handleDisconnect();
    }
  }, [walletProvider, dispatch]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletProvider) {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider as providers.ExternalProvider
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      }
    };
    getAddress();
  }, [walletProvider]);

  // Fetch NFT collection data
  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // Simüle edilmiş NFT verisi
        const mockNFTs = [
          {
            id: 1,
            name: "WHITELIST",
            image: nftImage,
            price: 0,
            status: 'completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0
          },
          {
            id: 2,
            name: "AIRDROP",
            image: nftImage,
            price: 0,
            status: 'not_completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 1
          },
          {
            id: 3,
            name: "REBORN",
            image: nftImage,
            price: 0,
            status: 'not_completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0
          }
        ] as NFT[];
        setNftCollection(mockNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron text-[110%] relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>
      <BackgroundCompiler />
      <ShuffleLoader />
      <DecoElements />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <a
            href="https://playprovidence.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.2em] hover:text-[#7042f88b] transition-all duration-300 group"
          >
            <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
            PROVIDENCE F8
          </a>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        <div className="mt-24 sm:mt-32 relative">
          {/* Title */}
          <div className="text-center flex items-center justify-center gap-2 flex-col mb-12">
            <p className="text-2xl tracking-[0.2em] text-white uppercase font-medium">
              Providence NFT Collection
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-[#d8624b]/30" />
              <div className="w-2 h-2 bg-[#d8624b]/30" />
              <div className="w-2 h-2 bg-[#d8624b]/30" />
            </div>
          </div>

          {/* NFT Grid */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <NFTGrid
              nfts={nftCollection} 
              isLoading={isLoading} 
              onSelect={setSelectedNFT} 
            />
          </main>
        </div>
      </div>

      <Footer />
      <StackedNotifications />
    </div>
  );
};

export default Layout;
