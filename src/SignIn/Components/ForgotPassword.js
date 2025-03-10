import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Layout } from '../../Shared/Components';
import { flexColumn, flexRow } from '../../Shared/Constants/Styles';
import { sharedLabels } from '../../StaticData/Shared';
import { stringIsEmail } from '../../Shared/Utils/InputUtils';
import { signinLabels } from '../../StaticData/SignIn';

export default function ForgotPassword() {
  const [fieldData, setFieldData] = useState({ value: '', hasError: false });

  const onChange = (event) => {
    const { value } = event.target;

    setFieldData((previous) => ({ ...previous, value, hasError: !stringIsEmail(value) }));
  };

  return (
    <Layout gridProps={{
      sx: { ...flexRow, justifyContent: 'center' },
    }}
    >
      <Box sx={{ ...flexColumn, justifyContent: 'space-between' }}>
        <Typography variant="h5">
          { signinLabels['forgotPassword.firstStage.title']}
        </Typography>
        <TextField
          id="form-email"
          value={fieldData.value}
          error={fieldData.hasError}
          label={sharedLabels.email}
          type="email"
          onChange={onChange}
          helperText={fieldData?.hasError ? sharedLabels.invalidEmail : undefined}
          InputProps={{
            sx: {
              border: '1px solid rgb(36, 134, 164)',
              '&:focus-within': {
                border: '1px solid transparent',
                boxShadow: 'none',
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{ marginTop: '20px' }}
          disabled={!fieldData.value}
        >
          { sharedLabels.sendEmail}
        </Button>
      </Box>

    </Layout>
  );
}
