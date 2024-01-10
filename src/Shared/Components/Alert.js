import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { EMPTY_FUNCTION } from '../Constants/System';

function InformativeAlert({
  open, autoHideDuration, onClose, severity, label,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert
        severity={severity}
        sx={{
          width: '100%',
          fontSize: 'h5.fontSize',
          '.MuiAlert-icon': {
            fontSize: '35px;',
          },
        }}
      >
        { label }
      </Alert>
    </Snackbar>
  );
}

InformativeAlert.defaultProps = {
  autoHideDuration: 5000,
  onClose: EMPTY_FUNCTION,
};

InformativeAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  severity: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default InformativeAlert;
