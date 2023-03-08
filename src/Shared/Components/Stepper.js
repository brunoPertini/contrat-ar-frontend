import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Grid } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';

export default function LinearStepper({ steps }) {
  const [completedSteps] = useState(new Set());
  const [activeStep] = useState(0);

  const optionalLabel = <Typography variant="caption">{ sharedLabels.optional}</Typography>;

  return (
    <>
      <Grid
        container
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item sx={{ flexDirection: 'row' }}>
          <Button>{ sharedLabels.back}</Button>
          <Button>{ sharedLabels.next}</Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          mt: '2%',
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map(({ label, isOptional }, index) => (
            <Step key={label} completed={completedSteps.has(index)}>
              <StepLabel optional={isOptional ? optionalLabel : undefined}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </>
  );
}

LinearStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    isOptional: PropTypes.bool,
  })).isRequired,
};
