import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Disclaimer({ text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <InfoOutlinedIcon sx={{ color: '#f5c242', mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        { text }
      </Typography>
    </Box>
  );
}

Disclaimer.propTypes = {
  text: PropTypes.string.isRequired,
};
