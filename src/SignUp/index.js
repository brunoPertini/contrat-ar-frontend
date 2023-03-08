import {
  Grid, TextField, Typography,
} from '@mui/material';
import Header from '../Header';
import { signUpLabels } from '../StaticData/SignUp';
import { sharedLabels } from '../StaticData/Shared';
import { Form, Stepper } from '../Shared/Components';

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp() {
  const { title } = signUpLabels;
  const nameAndSurnameRow = () => (
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
  );

  const emailAndPasswordRow = () => (
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
  );

  const birthDateRow = () => (
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
  );

  const fields = [nameAndSurnameRow, emailAndPasswordRow, birthDateRow];

  const steps = [{ label: 'Tus datos', isOptional: false },
    { label: 'Confirmanos tu ubicación', isOptional: false }];

  return (
    <Grid>
      <Header />
      <Form fields={fields} title={title} />
      <Stepper steps={steps} />
    </Grid>
  );
}
