import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { sharedLabels } from '../../StaticData/Shared';
import { indexLabels } from '../../StaticData/Index';
import Layout from './Layout';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import InformativeAlert from './Alert';

const mandatoryFields = ['fromName', 'fromEmail', 'message'];

const userClient = HttpClientFactory.createUserHttpClient();

const initialFormData = {
  fromName: '',
  fromEmail: '',
  phoneField: '',
  message: '',
};

const defaultAlertData = {
  open: false,
  severity: undefined,
  label: null,

};

function ContactForm({ containerStyles }) {
  const [formData, setFormData] = useState(initialFormData);
  const [wasSend, setWasSend] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    userClient.sendContactFormEmail(formData).then(() => setWasSend(true))
      .catch(() => setWasSend(false))
      .finally(() => {
        setIsLoading(false);
        setFormData(initialFormData);
      });
  };

  const commonProps = {
    helperText: sharedLabels.mandatoryField,
    FormHelperTextProps: {
      sx: { color: 'red' },
    },
    fullWidth: true,
    onChange: handleChange,
  };

  const isButtonDisabled = useMemo(() => mandatoryFields.some((field) => !formData[field]), [formData]);

  const alertData = useMemo(() => {
    if (wasSend === null) {
      return defaultAlertData;
    }

    if (wasSend) {
      return {
        open: true,
        severity: 'success',
        label: indexLabels['contact.success'],
      };
    }

    return {
      open: true,
      severity: 'error',
      label: indexLabels['contact.error'],
    };
  }, [wasSend]);

  return (
    <Layout
      isLoading={isLoading}
      gridProps={{
        sx: {
          mt: 5, mb: 5, px: { xs: 2, sm: 4 }, ...containerStyles,
        },
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        { indexLabels['contact.title']}
      </Typography>
      <InformativeAlert
        {...alertData}
        sx={{ mb: 2 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setWasSend(null)}
      />

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label={sharedLabels.name}
            name="fromName"
            value={formData.fromName}
            {...commonProps}
          />
          <TextField
            label={sharedLabels.email}
            name="fromEmail"
            type="email"
            value={formData.fromEmail}
            {...commonProps}
          />
          <TextField
            label={sharedLabels.phone}
            name="phoneField"
            type="tel"
            value={formData.phoneField}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={sharedLabels.message}
            name="message"
            value={formData.message}
            multiline
            rows={4}
            {...commonProps}
          />
          <Button
            disabled={isButtonDisabled}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            { sharedLabels.sendMessage }
          </Button>
        </Stack>
      </form>
    </Layout>
  );
}

ContactForm.defaultProps = {
  containerStyles: {},
};

ContactForm.propTypes = {
  containerStyles: PropTypes.object,
};

export default ContactForm;
