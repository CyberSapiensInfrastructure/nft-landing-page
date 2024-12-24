import React from 'react';
import { Link } from 'react-router-dom';
import ConnectButton from './ConnectButton';

interface HeaderProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConnect, onDisconnect }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/20 border-b border-[#a8c7fa]/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            PROVIDENCE
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/list" className="text-[#a8c7fa]/60 hover:text-white transition-colors">
              nfts
            </Link>
            <Link to="/marketplace" className="text-[#a8c7fa]/60 hover:text-white transition-colors">
              marketplace
            </Link>
            <Link to="/community" className="text-[#a8c7fa]/60 hover:text-white transition-colors">
              community
            </Link>
            <Link to="/about" className="text-[#a8c7fa]/60 hover:text-white transition-colors">
              about
            </Link>
          </nav>

          {/* Connect Wallet */}
          <ConnectButton onConnect={onConnect} onDisconnect={onDisconnect} />
        </div>
      </div>
    </header>
  );
};

export default Header; 