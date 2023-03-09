/* eslint-disable no-unused-vars */
import { useState } from 'react';
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

  const [completedSteps] = useState(new Set());

  const [activeStep, setActiveStep] = useState(0);

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

  const personalDataFields = [nameAndSurnameRow, emailAndPasswordRow, birthDateRow];

  const locationFields = [
    () => <div id="map"> </div>,
  ];

  const onLocationFormLoading = () => {
    if (typeof window.L !== 'undefined') {
      const map = window.L.map('map').setView([51.505, -0.09], 13);
    }
  };

  const steps = [{
    label: 'Tus datos',
    isOptional: false,
    component: <Form fields={personalDataFields} title={title} onLoad={() => {}} />,
  },
  {
    label: 'Confirmanos tu ubicación',
    isOptional: false,
    component: <Form
      fields={locationFields}
      title={signUpLabels['location.proveedor.title']}
      onLoad={onLocationFormLoading}
    />,
  }];

  const prepareFormRendering = async (stepIndex) => {
    const functions = {
      1: () => {
        if (!document.querySelector('#leafletCSS')) {
          const mapCSS = document.createElement('link');
          mapCSS.id = 'leafletCSS';
          mapCSS.rel = 'stylesheet';
          mapCSS.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
          mapCSS.integrity = 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=';
          mapCSS.crossOrigin = '';

          document.head.appendChild(mapCSS);
        }

        if (!document.querySelector('#leafletJS')) {
          const mapJS = document.createElement('script');
          mapJS.id = 'leafletJS';
          mapJS.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
          mapJS.integrity = 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=';
          mapJS.crossOrigin = '';
          document.head.appendChild(mapJS);
        }
      },
    };
    return stepIndex in functions ? functions[stepIndex]() : () => {};
  };

  const handleOnStepChange = async (newStepIndex) => {
    await prepareFormRendering(newStepIndex);
    setActiveStep(newStepIndex);
  };

  return (
    <Grid>
      <Header />
      { steps[activeStep].component }
      <Stepper
        steps={steps}
        completedSteps={completedSteps}
        activeStep={activeStep}
        onStepChange={handleOnStepChange}
      />
    </Grid>
  );
}
