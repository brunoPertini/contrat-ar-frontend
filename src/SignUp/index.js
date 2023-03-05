import {
  Grid, TextField, Typography,
} from '@mui/material';
import Header from '../Header';

export default function UserSignUp() {
  return (
    <Grid>
      <Header />
      <Grid
        container
        sx={{
          marginTop: '5%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        spacing={2}
      >
        <Typography variant="h6" align="left">
          Registrate! Sólo llevará unos minutos
        </Typography>
        <Grid item xs={12}>
          <TextField
            id="outlined-controlled"
            label="Nombre"
            onChange={() => {}}
          />
          {' '}
          <TextField
            id="outlined-controlled"
            label="Apellido"
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-controlled"
            label="Email"
            type="email"
            onChange={() => {}}
          />
          {' '}
          <TextField
            id="outlined-controlled"
            label="Contraseña"
            type="password"
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={12} sx={{ width: '31rem' }}>
          <Typography variant="subtitle1" align="left">
            Fecha de nacimiento
          </Typography>
          <TextField
            id="outlined-controlled"
            type="date"
            sx={{ width: '100%' }}
            onChange={() => {}}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
