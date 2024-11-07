import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EmailIcon from '@mui/icons-material/Email';
import Link from '@mui/material/Link';

export default function Footer({ options }) {
  const textProps = {
    disablePadding: true,
    sx: {
      color: '#f5c242',
      cursor: 'pointer',
    },
  };

  return (
    <Box
      component="footer"
      display="flex"
      justifyContent="space-between"
      marginTop="auto"
      sx={{
        paddingLeft: '20px',
        bgcolor: 'primary.main',
        textAlign: 'center',
        position: 'sticky',
      }}
    >
      <List sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        {
          options.map(({ label, onClick }) => (
            <ListItem {...textProps} onClick={onClick}>
              <ListItemText primary={label} />
            </ListItem>
          ))
        }
      </List>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        sx={{ paddingRight: '20px' }}
      >
        <Box display="flex" flexDirection="row">
          <EmailIcon fontSize="small" sx={{ fill: '#f5c242' }} />
          <Link
            variant="body2"
            href="mailto:hola@contratar.com.ar"
            sx={{
              color: '#f5c242',
              textAlign: 'left',
              cursor: 'pointer',
              ml: '2%',
            }}
          >
            hola@contratar.com.ar
          </Link>
        </Box>

        <Typography variant="body2" sx={{ color: '#f5c242' }}>
          Copyright ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          - ContratAr
        </Typography>
      </Box>
    </Box>
  );
}

Footer.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  })).isRequired,
};
