import React, { useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Grid } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';

export default function LinearStepper({
  steps, completedSteps, activeStep, onStepChange,
}) {
  const optionalLabel = <Typography variant="caption">{ sharedLabels.optional}</Typography>;

  const onButtonClick = useCallback((newStep) => onStepChange(newStep), [onStepChange]);

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
          <Button
            onClick={() => onButtonClick(activeStep - 1)}
            disabled={activeStep === 0}
          >
            { sharedLabels.back}
          </Button>
          <Button
            onClick={() => onButtonClick(activeStep + 1)}
            disabled={activeStep === steps.length - 1}
          >
            { sharedLabels.next}
          </Button>
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

  completedSteps: PropTypes.instanceOf(Set).isRequired,
  activeStep: PropTypes.number.isRequired,
  onStepChange: PropTypes.func.isRequired,
};
