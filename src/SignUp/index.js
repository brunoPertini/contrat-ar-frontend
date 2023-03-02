import {
  Grid, FormControl, TextField,
} from '@mui/material';
import Header from '../Header';

export default function UserSignUp() {
  return (
    <Grid container sx={{ justifyContent: 'center' }}>
      <Header />
      <Grid item sx={{ marginTop: '5%' }}>
        <FormControl>
          <TextField
            id="outlined-controlled"
            label="Nombre"
            onChange={() => {}}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}
