import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarComponentProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, message, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Snackbar will close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
