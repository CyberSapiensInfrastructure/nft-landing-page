import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginModal } from '../components/AdminLoginModal';

export default function AdminPage() {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    if (!auth) {
      setShowModal(true);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLoginModal
        isOpen={showModal}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin panel içeriği */}
    </div>
  );
} 