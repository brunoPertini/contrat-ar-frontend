import PropTypes from 'prop-types';
import {
  Box, Modal, Slide, Typography,
} from '@mui/material';
import { flexColumn } from '../Constants/Styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 400,
  },
  bgcolor: 'rgb(36, 134, 164)',
  p: 4,
  gap: '50px',
  border: 'none',
  outline: 'none',
};

export default function AnimatedModal({
  open = false, title = null, footer = null, onClose = () => {}, children,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...flexColumn, ...style }}>
        {title && (
          <Typography variant="h5" fontWeight="bold" color="#f5c242">
            {title}
          </Typography>
        )}
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <Box>
            { children }
          </Box>
        </Slide>
        {footer && (
        <Typography variant="caption" color="white">
          {footer}
        </Typography>
        )}
      </Box>
    </Modal>
  );
}

AnimatedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.element.isRequired,
  footer: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
};
