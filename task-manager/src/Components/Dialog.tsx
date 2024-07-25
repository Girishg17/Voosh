import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';

type DialogsProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
};

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d3d3d3',
  color: 'black',
  '&:hover': {
    backgroundColor: '#a9a9a9',
  },
}));

const Dialogs: React.FC<DialogsProps> = ({ open, onClose, onSave }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

 
  React.useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ title, description });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
      sx={{
        '& .MuiDialog-paper': {
          width: '500px', 
          height: '400px', 
          maxWidth: 'none', 
        },
      }}
    >
      <DialogTitle>Add Tasks</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton type="submit">Save</CustomButton>
        <CustomButton onClick={onClose}>Cancel</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogs;
