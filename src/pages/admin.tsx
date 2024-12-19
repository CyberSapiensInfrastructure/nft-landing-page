import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Dashboard } from '../components/admin/Dashboard';
import { ContractActions } from '../components/admin/ContractActions';
import { Users } from '../components/admin/Users';
import { NFTManagement } from '../components/admin/NFTManagement';
import { Settings } from '../components/admin/Settings';

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'contract':
        return <ContractActions />;
      case 'users':
        return <Users />;
      case 'nfts':
        return <NFTManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout onTabChange={setActiveComponent}>
      {renderComponent()}
    </AdminLayout>
  );
} 