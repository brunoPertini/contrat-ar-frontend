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
        <Grid item xs={8}>
          <TextField
            id="outlined-controlled"
            label="Nombre"
            onChange={() => {}}
          />
          <TextField
            id="outlined-controlled"
            label="Apellido"
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            id="outlined-controlled"
            label="Email"
            type="email"
            onChange={() => {}}
          />
          <TextField
            id="outlined-controlled"
            label="Contraseña"
            type="password"
            onChange={() => {}}
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-controlled"
            label="Nacimiento"
            type="date"
            onChange={() => {}}
            sx={{ width: '200%' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
