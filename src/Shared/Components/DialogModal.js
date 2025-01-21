import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function DialogModal({
  open, handleAccept, handleDeny, title, onCloseDialog,
  contextText, cancelText, acceptText, showButtons,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
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
      {
        showButtons && (
          <DialogActions>
            <Button autoFocus onClick={() => handleDeny()}>
              { cancelText }
            </Button>
            <Button onClick={() => handleAccept()} autoFocus>
              { acceptText }
            </Button>
          </DialogActions>
        )
      }
    </Dialog>
  );
}

DialogModal.propTypes = {
  showButtons: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDeny: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func,
  title: PropTypes.string,
  contextText: PropTypes.string,
  cancelText: PropTypes.string.isRequired,
  acceptText: PropTypes.string.isRequired,
};

DialogModal.defaultProps = {
  title: '',
  contextText: '',
  showButtons: true,
  onCloseDialog: undefined,
};

export default DialogModal;
