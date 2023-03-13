/* eslint-disable react/prop-types */
import {
  useTheme, useMediaQuery, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';

function DialogModal({ open, handleAccept, handleDeny }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Contract.AR necesita saber su ubicación
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para ser encontrado por tus clientes,
          necesitamos que aceptes los permisos de ubicación en tu navegador
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleDeny()}>
          Cancelar Registro
        </Button>
        <Button onClick={() => handleAccept()} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogModal;
