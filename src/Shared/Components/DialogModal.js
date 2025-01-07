import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';

function DialogModal({
  open, handleAccept, handleDeny, title,
  contextText, cancelText, acceptText,
}) {
  return (
    <Dialog
      open={open}
      aria-labelledby="dialog-title"
      PaperProps={{
        sx: {
          backgroundColor: 'rgb(36, 134, 164)',
          color: '#fff',
        },
      }}
    >
      <DialogTitle id="dialog-title">
        { title }
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="#fff">
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
