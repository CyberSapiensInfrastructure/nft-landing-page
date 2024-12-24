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

// Contract addresses
const F8_ADDRESS = "0x4684059c10Cc9b9E3013c953182E2e097B8d089d";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Custom wallet connection
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    return {
      provider,
      signer,
      address
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
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
