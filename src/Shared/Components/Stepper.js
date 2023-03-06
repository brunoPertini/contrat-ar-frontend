import * as React from 'react';
import { Grid } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = ['Tus datos', 'Confirmanos tu ubicación'];

export default function HorizontalLinearStepper() {
  return (
    <Grid
      container
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Stepper activeStep={1}>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          if (true) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (false) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Grid>
  );
}
