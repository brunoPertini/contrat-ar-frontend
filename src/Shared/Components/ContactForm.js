import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { sharedLabels } from '../../StaticData/Shared';
import { indexLabels } from '../../StaticData/Index';

const mandatoryFields = ['name', 'email', 'message'];

function ContactForm({ containerStyles }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = mandatoryFields.reduce((acc, key) => {
      if (!formData[key]) {
        acc[key] = true;
      }

      return acc;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  const commonProps = {
    helperText: sharedLabels.mandatoryField,
    FormHelperTextProps: {
      sx: { color: 'red' },
    },
    fullWidth: true,
    onChange: handleChange,
  };

  return (
    <Box sx={{
      mt: 5, mb: 5, px: { xs: 2, sm: 4 }, ...containerStyles,
    }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        { indexLabels['contact.title']}
      </Typography>
      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          { indexLabels['contact.success'] }
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label={sharedLabels.name}
            name="name"
            value={formData.name}
            error={errors.name}
            {...commonProps}
          />
          <TextField
            label={sharedLabels.email}
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            {...commonProps}
          />
          <TextField
            label={sharedLabels.phone}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={sharedLabels.message}
            name="message"
            value={formData.message}
            error={errors.message}
            multiline
            rows={4}
            {...commonProps}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            { sharedLabels.sendMessage }
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

ContactForm.defaultProps = {
  containerStyles: {},
};

ContactForm.propTypes = {
  containerStyles: PropTypes.object,
};

export default ContactForm;
