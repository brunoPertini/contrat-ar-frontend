import {
  Grid, TextField, Typography,
} from '@mui/material';
import Header from '../Header';
import { signUpLabels } from '../StaticData/SignUp';
import { sharedLabels } from '../StaticData/Shared';

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
          { signUpLabels.title }
        </Typography>
        <Grid item xs={12}>
          <TextField
            id="outlined-controlled"
            label={sharedLabels.name}
            onChange={() => {}}
          />
          {' '}
          <TextField
            id="outlined-controlled"
            label={sharedLabels.surname}
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-controlled"
            label={sharedLabels.email}
            type="email"
            onChange={() => {}}
          />
          {' '}
          <TextField
            id="outlined-controlled"
            label={sharedLabels.password}
            type="password"
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={12} sx={{ width: '31rem' }}>
          <Typography variant="subtitle1" align="left">
            { sharedLabels.birthDate }
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
