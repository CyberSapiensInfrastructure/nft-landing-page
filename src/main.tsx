import ReactDOM from "react-dom/client";
import "./assets/fonts/fontinit.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./i18";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ShuffleLoader from "./components/Loader";
import Layout from "./components/Layout";
import NFTListPage from "./pages/NFTListPage";
import { NFTDetail } from "./pages/NFTDetail";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import About from "./pages/About";
import { Error } from "./components/Error";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import AdminPage from "./pages/admin";
import { ethers, providers } from 'ethers';
import { F8__factory } from 'typechain-types/factories/F8__factory';
import {  Launchpad__factory } from 'typechain-types/factories/Launchpad__factory';

// Ethereum window type
declare global {
    interface Window {
        ethereum?: any;
    }
}

// Contract addresses
const LAUNCHPAD_ADDRESS = "0xC7A2880F40537bbe25C060282159BcCB46cD9537";
const F8_ADDRESS = "0xeAF4c15D2f4c9563F3c6D5eCCf217BBAE2052063";

const mainnet = {
  chainId: 43114,
  name: "Avalanche",
  currency: "AVAX",
  explorerUrl: "https://subnets.avax.network/c-chain",
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
};

const metadata = {
  name: "PROVIDENCE",
  description: "PROVIDENCE",
  url: "https://stake-vesting-panel.onrender.com/",
  icons: ["https://providencewallet.com/carbon/logo/logo.jpg"],
};

// Initialize providers
const provider = new ethers.providers.JsonRpcProvider(mainnet.rpcUrl);
export const globalProvider = provider;

// Initialize contracts with typechain factories
export const getLaunchpadContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    return Launchpad__factory.connect(LAUNCHPAD_ADDRESS, signerOrProvider);
};

export const getF8Contract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    return F8__factory.connect(F8_ADDRESS, signerOrProvider);
};

// Test functions
export const testConnection = async () => {
    try {
        // Test 1: Get Network
        const network = await globalProvider.getNetwork();
        console.log('Network Connection:', {
            chainId: network.chainId,
            name: network.name
        });

        // Test 2: Get Block Number
        const blockNumber = await globalProvider.getBlockNumber();
        console.log('Current Block Number:', blockNumber);

        // Test 3: Get Gas Price
        const gasPrice = await globalProvider.getGasPrice();
        console.log('Current Gas Price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

       

        console.log('✅ Kontrat Adresleri:', {
            Launchpad: LAUNCHPAD_ADDRESS,
            F8: F8_ADDRESS
        });

        return true;
    } catch (error) {
        console.error('Connection Test Failed:', error);
        return false;
    }
};

// Test wallet connection
export const getSigner = async () => {
  if (window.ethereum) {
    const web3Provider = new (ethers.providers.Web3Provider as unknown as { new(provider: any): ethers.providers.Web3Provider })(window.ethereum);
    await web3Provider.send('eth_requestAccounts', []);
    return web3Provider.getSigner();
  }
  return null;
};

export const testWalletConnection = async () => {
    try {
        if (!window.ethereum) {
            console.error("❌ MetaMask yüklü değil!");
            return false;
        }

        const web3Provider = new (ethers.providers.Web3Provider as unknown as { new(provider: any): ethers.providers.Web3Provider })(window.ethereum);
        
        // Check if already connected
        const accounts = await web3Provider.listAccounts();
        if (accounts.length === 0) {
            console.log("🔄 Cüzdan bağlantısı isteniyor...");
            await web3Provider.send('eth_requestAccounts', []);
        }

        const signer = await getSigner();
        if (signer) {
            const address = await signer.getAddress();
            const balance = await signer.getBalance();
            console.log('✅ Cüzdan Bağlandı:', {
                address,
                balance: ethers.utils.formatEther(balance) + " PrvL1"
            });
            return true;
        }
        return false;
    } catch (error: any) {
        if (error.code === 4001) {
            console.error("❌ Kullanıcı cüzdan bağlantısını reddetti!");
        } else {
            console.error("❌ Cüzdan bağlantı hatası:", error);
        }
        return false;
    }
};

const projectId = "25b13b447fae3f9ebc44a23731bf9842";

const ethersConfig = defaultConfig({
  metadata,
  rpcUrl: mainnet.rpcUrl,
});

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
});

// Helper function for F8 minting
export const mintF8NFT = async (toAddress: string) => {
    try {
        const signer = await getSigner();
        if (!signer) {
            console.error("Cüzdan bağlantısı gerekli!")
            return
        }

        // Use F8__factory to create contract instance
        const f8Contract = F8__factory.connect(F8_ADDRESS, signer);
        
        // Check if caller is owner
        const owner = await f8Contract.owner();
        const callerAddress = await signer.getAddress();
        
        if (owner.toLowerCase() !== callerAddress.toLowerCase()) {
            console.error("sadece kontrat sahibi mint yapabilir!")
        }

        // Mint NFT
        console.log("🔄 NFT mint ediliyor...");
        const tx = await f8Contract.mintF8(toAddress);
        
        // Wait for transaction
        console.log("⏳ İşlem onayı bekleniyor...");
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log("✅ NFT başarıyla mint edildi!");
            console.log("Transaction Hash:", tx.hash);
            console.log("Gas Used:", receipt.gasUsed.toString());
            return {
                success: true,
                hash: tx.hash,
                gasUsed: receipt.gasUsed.toString()
            };
        } else {
            console.error("Mint işlemi başarısız!");
        }
    } catch (error: any) {
        console.error("❌ Mint Hatası:", error.message || error);
        return {
            success: false,
            error: error.message || "Bilinmeyen hata"
        };
    }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Suspense fallback={<ShuffleLoader />}>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/list" element={<NFTListPage />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  </Provider>
);
