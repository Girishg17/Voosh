import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../Components/NavBar';
import { Container, TextField, Typography, Box, Button } from '@mui/material';
import { 
  LoginCard, 
  LoginButton, 
  GoogleButton, 
  SignupLink, 
  SignupCard, 
  SignupButton, 
  LoginLink 
} from '../Components/styles';
import { login, register, googleLogin } from '../utils/api';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [activeButton, setActiveButton] = useState('login');
  const [loginButtonColor, setLoginButtonColor] = useState('white');
  const [signupButtonColor, setSignupButtonColor] = useState('blue');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      console.log("login token", data.token);
      console.log("login userid", data.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userid', data.id);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = await register(name, secondName, email, password);
      console.log("signup token", data.token);
      console.log("signup userid", data.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userid', data.id);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const { credential } = response;
      // Call your backend with the Google token to authenticate or register the user
      const data = await googleLogin(credential);
      console.log(data)
      console.log("google token", data.token);
      console.log("google userid", data.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userid', data.id);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleError=()=>{
    console.log("error");
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <LoginButton variant="contained" onClick={handleLogin}>Login</LoginButton>
            <Box display="flex" alignItems="center" marginTop="10px">
              <Typography variant="body2" color="black">Don't have an account?</Typography>
              <SignupLink variant="body2" onClick={handleSignupClick}>
                Signup
              </SignupLink>
            </Box>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleError}
              useOneTap
            />
            
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
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setSecondName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <SignupButton variant="contained" onClick={handleSignup}>Signup</SignupButton>
            <Box display="flex" alignItems="center" marginTop="10px">
              <Typography variant="body2" color="black">Already have an account?</Typography>
              <LoginLink variant="body2" onClick={handleLoginClick}>
                Login
              </LoginLink>
            </Box>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              useOneTap
              onError={handleError}
            />
          </SignupCard>
        </Container>
      )}
    </div>
  );
};

export default Login;
