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
  heading?: string;
  title?: string;
  description?: string;
};

// Styled button components
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d3d3d3', // Light gray
  color: 'black',
  '&:hover': {
    backgroundColor: '#a9a9a9', // Dark gray
  },
}));

const Dialogs: React.FC<DialogsProps> = ({ open, onClose, onSave, heading, title = '', description = '' }) => {
  const [formValues, setFormValues] = React.useState({ title, description });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(formValues);
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
    >
      <DialogTitle>{heading || 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={formValues.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={formValues.description}
          onChange={handleChange}
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
