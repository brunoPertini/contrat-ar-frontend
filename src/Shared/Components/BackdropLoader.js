import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function BackdropLoader({ open, label = null }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" sx={{ mr: '1%' }} />
      { label }
    </Backdrop>
  );
}

BackdropLoader.propTypes = {
  open: PropTypes.bool.isRequired,
  label: PropTypes.node.isRequired,
};

export default BackdropLoader;
