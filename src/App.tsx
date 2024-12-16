import { NFTDetail } from './pages/NFTDetail';

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