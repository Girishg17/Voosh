// src/Pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../Components/NavBar';
import { Container, TextField, Typography, Box } from '@mui/material';
import { 
  LoginCard, 
  LoginButton, 
  GoogleButton, 
  SignupLink, 
  SignupCard, 
  SignupButton, 
  LoginLink 
} from '../Components/styles';

const Login: React.FC = () => {
  const [activeButton, setActiveButton] = useState('login');
  const [loginButtonColor, setLoginButtonColor] = useState('white');
  const [signupButtonColor, setSignupButtonColor] = useState('blue');
  
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    setActiveButton('login');
    setLoginButtonColor('white');
    setSignupButtonColor('#0067cc');
   
  };

  const handleSignupClick = () => {
    setActiveButton('signup');
    setLoginButtonColor('#0067cc');
    setSignupButtonColor('white');
  };

  const handleLogin=()=>{
    navigate('/home');
  }

  return (
    <div>
      <Navbar
        buttons={[
          {
            label: 'Login',
            onClick: handleLoginClick,
            color: loginButtonColor,
          },
          {
            label: 'Signup',
            onClick: handleSignupClick,
            color: signupButtonColor,
          },
        ]}
      />
      {activeButton === 'login' ? (
        <Container maxWidth="sm" sx={{ marginTop: '20px' }}>
          <Typography variant="h4" align="left" gutterBottom color="blue">
            Login
          </Typography>
          <LoginCard>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
            />
            <LoginButton variant="contained" onClick={handleLogin}>Login</LoginButton>
            <Box display="flex" alignItems="center" marginTop="10px">
              <Typography variant="body2" color="black">Don't have an account?</Typography>
              <SignupLink variant="body2" onClick={handleSignupClick}>
                Signup
              </SignupLink>
            </Box>
            <GoogleButton variant="contained">Login with Google</GoogleButton>
          </LoginCard>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ marginTop: '20px' }}>
          <Typography variant="h4" align="left" gutterBottom color="blue">
            Signup
          </Typography>
          <SignupCard>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
            />
            <SignupButton variant="contained">Signup</SignupButton>
            <Box display="flex" alignItems="center" marginTop="10px">
              <Typography variant="body2" color="black">Already have an account?</Typography>
              <LoginLink variant="body2" onClick={handleLoginClick}>
                Login
              </LoginLink>
            </Box>
            <GoogleButton variant="contained">Signup with Google</GoogleButton>
          </SignupCard>
        </Container>
      )}
    </div>
  );
};

export default Login;
