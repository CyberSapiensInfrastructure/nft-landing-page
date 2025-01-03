import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ethers } from 'ethers';
import Layout from './components/Layout';
import { GlobalLoader } from './components/GlobalLoader';
import './index.css';
import { WalletProvider } from './context/WalletContext';
import { NFTProvider } from './context/NFTContext';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const NFTListPage = lazy(() => import('./pages/NFTListPage'));
const NFTDetail = lazy(() => import('./pages/NFTDetail'));
const Community = lazy(() => import('./pages/Community'));
const About = lazy(() => import('./pages/About'));
const AdminPage = lazy(() => import('./pages/admin'));
const Error = lazy(() => import('./components/Error'));
const Missions = lazy(() => import('./pages/Missions'));

// Wallet connection function
export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // First check if we're already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return { provider, signer };
      }

      // If not connected, request connection
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return { provider, signer };
    } catch (error: any) {
      if (error.code === -32002) {
        console.error('MetaMask is already processing a connection request. Please check your MetaMask wallet.');
      } else {
        console.error('User rejected connection:', error);
      }
      return null;
    }
  } else {
    console.error('Please install MetaMask!');
    return null;
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <NFTProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="list" element={<NFTListPage />} />
                  <Route path="nft/:id" element={<NFTDetail />} />
                  <Route path="missions" element={<Missions />} />
                  <Route path="community" element={<Community />} />
                  <Route path="about" element={<About />} />
                  <Route path="*" element={<Error />} />
                </Route>
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </Provider>
      </NFTProvider>
    </WalletProvider>
  </React.StrictMode>
);
