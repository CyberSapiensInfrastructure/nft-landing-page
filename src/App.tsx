import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NFTListPage from './pages/NFTListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/list" element={<NFTListPage />} />
      </Routes>
    </Router>
  );
}

export default App; 