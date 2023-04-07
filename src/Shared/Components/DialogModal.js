import PropTypes from 'prop-types';
import {
  useTheme, useMediaQuery, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';

function DialogModal({
  open, handleAccept, handleDeny, title,
  contextText, cancelText, acceptText,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        { title }
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          { contextText }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleDeny()}>
          { cancelText }
        </Button>
        <Button onClick={() => handleAccept()} autoFocus>
          { acceptText }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDeny: PropTypes.func.isRequired,
  title: PropTypes.string,
  contextText: PropTypes.string,
  cancelText: PropTypes.string.isRequired,
  acceptText: PropTypes.string.isRequired,
};

DialogModal.defaultProps = {
  title: '',
  contextText: '',
};

export default DialogModal;
