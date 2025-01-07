import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';

export default function LinearStepper({
  steps, activeStep, onStepChange,
  backButtonEnabled, nextButtonEnabled,
}) {
  const optionalLabel = <Typography variant="caption">{ sharedLabels.optional}</Typography>;

  const onButtonClick = useCallback((newStep) => onStepChange(newStep), [onStepChange]);

  const buttonStyles = { color: '#c68e29' };

  return (
    <>
      <Grid
        container
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Grid item sx={{ flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center' }}>
          <Button
            onClick={() => onButtonClick(activeStep - 1)}
            disabled={!backButtonEnabled}
            sx={buttonStyles}
          >
            { sharedLabels.back}
          </Button>
          <Button
            onClick={() => onButtonClick(activeStep + 1)}
            disabled={!nextButtonEnabled}
            sx={buttonStyles}
          >
            { sharedLabels.next}
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          mt: '2%',
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{ flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center' }}
        >
          {steps.map(({ label, isOptional }) => (
            <Step key={label}>
              <StepLabel optional={isOptional ? optionalLabel : undefined}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </>
  );
}

LinearStepper.defaultProps = {
  backButtonEnabled: true,
};

LinearStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    isOptional: PropTypes.bool,
  })).isRequired,

  activeStep: PropTypes.number.isRequired,
  onStepChange: PropTypes.func.isRequired,
  backButtonEnabled: PropTypes.bool,
  nextButtonEnabled: PropTypes.bool.isRequired,
};
