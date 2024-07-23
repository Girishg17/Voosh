import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type ButtonAppBarProps = {
  buttons: { label: string; onClick: () => void; color?: string }[];
};

const Navbar: React.FC<ButtonAppBarProps> = ({ buttons }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color='inherit'
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              sx={{
                backgroundColor: button.color || 'inherit',
                color: button.color=='white'?'blue':'white',
                marginLeft: 2,
              }}
            >
              {button.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
