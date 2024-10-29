import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        height: '200px',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Contacto
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="Sobre Nosotros" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Servicios" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Contacto" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Soporte" />
        </ListItem>
      </List>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />
      <Typography variant="body2">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        - Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
