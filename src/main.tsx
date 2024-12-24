import ReactDOM from "react-dom/client";
import "./assets/fonts/fontinit.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./i18";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ShuffleLoader from "./components/Loader";
import Layout from "./components/Layout";
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

// Contract addresses
const F8_ADDRESS = "0x4684059c10Cc9b9E3013c953182E2e097B8d089d";

// Web3Modal Configuration
const projectId = "25b13b447fae3f9ebc44a23731bf9842";

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
  url: "https://providencewallet.com",
  icons: ["https://providencewallet.com/carbon/logo/logo.jpg"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
});

// Test wallet connection
export const testWalletConnection = async () => {
  try {
    if (!window.ethereum) {
      console.error("❌ MetaMask yüklü değil!");
      return false;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Check if already connected
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      console.log("🔄 Cüzdan bağlantısı isteniyor...");
      await provider.send('eth_requestAccounts', []);
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    
    console.log('✅ Cüzdan Bağlandı:', {
      address,
      balance: ethers.utils.formatEther(balance)
    });
    
    return true;
  } catch (error: any) {
    if (error.code === 4001) {
      console.error("❌ Kullanıcı cüzdan bağlantısını reddetti!");
    } else {
      console.error("❌ Cüzdan bağlantı hatası:", error);
    }
    return false;
  }
};

// Lazy load components
const NFTListPage = lazy(() => import("./pages/NFTListPage"));
const NFTDetail = lazy(() => import("./pages/NFTDetail"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Community = lazy(() => import("./pages/Community"));
const About = lazy(() => import("./pages/About"));
const AdminPage = lazy(() => import("./pages/admin"));
const Error = lazy(() => import("./components/Error"));

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
