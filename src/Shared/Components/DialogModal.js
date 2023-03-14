/* eslint-disable react/prop-types */
import {
  useTheme, useMediaQuery, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';

function DialogModal({
  open,
  handleAccept, handleDeny, title, contextText, cancelText, acceptText,
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

export default DialogModal;
