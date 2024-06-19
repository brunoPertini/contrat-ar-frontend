import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocationMap from './LocationMap';
import { parseLocationForMap } from '../Helpers/UtilsHelper';

function MapModal({
  location, handleClose, open, title,
}) {
  return open ? (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
        }}
      >
        <Typography variant="h3" sx={{ mb: '2%' }}>
          { title }
        </Typography>

        <LocationMap
          enableDragEvents={false}
          location={parseLocationForMap(location)}
          containerStyles={{
            height: '40rem',
            width: '40rem',
          }}
        />
      </Box>
    </Modal>
  ) : null;
}

export default MapModal;

MapModal.defaultProps = {
  location: {},
};

MapModal.propTypes = {
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};
