// src/Components/styles.tsx

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const LoginCard = styled(Box)({
  border: '2px solid #0067cc',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const LoginButton = styled(Button)({
  backgroundColor: '#0067cc',
  color: 'white',
  marginTop: '20px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#005bb5',
  },
});

export const GoogleButton = styled(Button)({
  backgroundColor: '#4285F4',
  color: 'white',
  marginTop: '20px',
  width: '50%',
  '&:hover': {
    backgroundColor: '#357ae8',
  },
});

export const SignupLink = styled(Typography)({
  color: 'blue',
  cursor: 'pointer',
  marginLeft: '5px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const SignupCard = styled(Box)({
  border: '2px solid #0067cc',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const SignupButton = styled(Button)({
  backgroundColor: '#0067cc',
  color: 'white',
  marginTop: '20px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#005bb5',
  },
});

export const LoginLink = styled(Typography)({
  color: 'blue',
  cursor: 'pointer',
  marginLeft: '5px',
  '&:hover': {
    textDecoration: 'underline',
  },
});
