import PropTypes from 'prop-types';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Layout from '../../Shared/Components/Layout';
import { flexColumn, flexRow } from '../../Shared/Constants/Styles';
import { sharedLabels } from '../../StaticData/Shared';
import { stringIsEmail } from '../../Shared/Utils/InputUtils';
import { signinLabels } from '../../StaticData/SignIn';
import StaticAlert from '../../Shared/Components/StaticAlert';

export default function ForgotPassword({ sendForgotPasswordEmail }) {
  const [fieldData, setFieldData] = useState({ value: '', hasError: false });

  const [expirationInMinutes, setExpirationInMinutes] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [wasEmailSend, setWasEmailSend] = useState();

  const [errorMessage, setErrorMessage] = useState();

  const onChange = (event) => {
    const { value } = event.target;

    setFieldData((previous) => ({ ...previous, value, hasError: !stringIsEmail(value) }));
  };

  const handleEmailSend = () => {
    setIsLoading(true);
    sendForgotPasswordEmail(fieldData.value).then((expiration) => {
      setExpirationInMinutes(expiration);
      setWasEmailSend(true);
    })
      .catch((response) => {
        setWasEmailSend(false);
        setErrorMessage(response.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout
      isLoading={isLoading}
      gridProps={{
        sx: { ...flexRow, justifyContent: 'center' },
      }}
    >
      <Box sx={{ ...flexColumn, justifyContent: 'space-between' }}>
        {
          wasEmailSend === true && (
          <StaticAlert
            severity="success"
            styles={{
              mt: '15px',
            }}
            label={signinLabels['forgotPassword.emailSend.ok'].replace('{expirationMinutes}', expirationInMinutes)}
          />
          )
        }
        {
          wasEmailSend === false && (
          <StaticAlert
            severity="error"
            styles={{
              mt: '15px',
            }}
            label={errorMessage}
          />
          )
        }
        {
          wasEmailSend === undefined && (
            <>
              <Typography variant="h5">
                {signinLabels['forgotPassword.firstStage.title']}
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
                disabled={!fieldData.value || fieldData.hasError}
                onClick={handleEmailSend}
              >
                {sharedLabels.sendEmail}
              </Button>
            </>
          )
        }

      </Box>

    </Layout>
  );
}

ForgotPassword.propTypes = {
  sendForgotPasswordEmail: PropTypes.func.isRequired,
};
