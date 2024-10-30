/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      display="flex"
      flexShrink="unset"
      justifyContent="space-between"
      sx={{
        paddingLeft: '20px',
        bgcolor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        position: 'sticky',
      }}
    >
      <List sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <ListItem disablePadding>
          <ListItemText primary="Sobre Nosotros" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Nuestros planes" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Ayuda" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Términos y condiciones" />
        </ListItem>
      </List>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        sx={{ paddingRight: '20px' }}
      >
        <Link
          variant="body2"
          sx={{
            color: 'white',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          Contactanos
        </Link>
        <Typography variant="body2">
          Copyright ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          - ContractAr
        </Typography>
      </Box>
    </Box>
  );
}
