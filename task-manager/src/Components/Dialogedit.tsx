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

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d3d3d3',
  color: 'black',
  '&:hover': {
    backgroundColor: '#a9a9a9',
  },
}));

const Dialogedit: React.FC<DialogsProps> = ({ open, onClose, onSave, heading, title = '', description = '' }) => {
  const [formValues, setFormValues] = React.useState({title  ,description});

  // Update form values when props change
  React.useEffect(() => {
    setFormValues({ title, description });
  }, [title, description]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("form valued",formValues);
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
      sx={{
        '& .MuiDialog-paper': {
          width: '500px', // Adjust width
          height: '400px', // Adjust height
          maxWidth: 'none', // Ensure the width is not restricted by the maxWidth property
        },
      }}
    >
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={formValues.title} // Correctly bind to formValues
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
          value={formValues.description} // Correctly bind to formValues
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

export default Dialogedit;
