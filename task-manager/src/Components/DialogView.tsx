import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

type DialogsProps = {
  open: boolean;
  onClose: () => void;
  heading?: string;
  title?: string;
  description?: string;
};


const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'blue', 
  color: 'white',
  '&:hover': {
    backgroundColor: 'skyblue', 
  },
}));

const DialogViews: React.FC<DialogsProps> = ({ open, onClose, heading, title = '', description = '' }) => {
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '500px', // Adjust width
          height: '400px', // Adjust height
          maxWidth: 'none', // Ensure the width is not restricted by the maxWidth property
        },
      }}
      
    >
      <DialogTitle>{heading }</DialogTitle>
      <DialogContent>
        <Typography>{title}</Typography>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onClose}>Cancel</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogViews;
