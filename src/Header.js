import React from 'react';
import {
  AppBar, Box, Toolbar, Button, IconButton,
} from '@mui/material';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'right' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          />
          <Button color="inherit">Registrarse</Button>
          <Button color="inherit">Iniciar Sesión</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
