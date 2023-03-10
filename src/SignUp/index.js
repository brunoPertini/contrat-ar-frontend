/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Grid, TextField, Typography,
} from '@mui/material';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
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
    () => (
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: 500, width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup.
            {' '}
            <br />
            {' '}
            Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    ),
  ];

  const onLocationFormLoading = () => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
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
      onLoad={() => {}}
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
          document.body.prepend(mapJS);
        }

        onLocationFormLoading();
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
