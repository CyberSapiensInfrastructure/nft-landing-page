import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const isValidUsername = username === String(import.meta.env.VITE_ADMIN_USERNAME);
    const isValidPassword = password === String(import.meta.env.VITE_ADMIN_PASSWORD);

    if (isValidUsername && isValidPassword) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      onSuccess();
      onClose();
      navigate('/admin');
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Admin Girişi</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adını giriniz"
              fullWidth
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi giriniz"
              fullWidth
            />
            <Button variant="contained" fullWidth onClick={handleLogin}>
              Giriş Yap
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={showError} autoHideDuration={3000} onClose={() => setShowError(false)}>
        <Alert severity="error" onClose={() => setShowError(false)}>
          Kullanıcı adı veya şifre hatalı
        </Alert>
      </Snackbar>
    </>
  );
} 