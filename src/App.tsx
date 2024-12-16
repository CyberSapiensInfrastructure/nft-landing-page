import Layout from './components/Layout';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { NFTDetail } from './pages/NFTDetail';
import { Error } from './components/Error';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/nft/:id" element={<NFTDetail />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App; 