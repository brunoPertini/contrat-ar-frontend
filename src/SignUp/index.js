import { useState } from 'react';
import {
  Grid,
} from '@mui/material';
import Header from '../Header';
import { signUpLabels } from '../StaticData/SignUp';
import { Form, Stepper } from '../Shared/Components';
import { LocationFormBuilder, PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';

const locationFormBuilder = new LocationFormBuilder();

const personalDataFormBuilder = new PersonalDataFormBuilder();

let location = {};

function setLocation(newLocation) {
  location = newLocation;
}

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp() {
  const { title } = signUpLabels;

  const [completedSteps] = useState(new Set());

  const [activeStep, setActiveStep] = useState(0);

  // LocationMap data
  const [readableAddress, setReadableAddress] = useState('');

  const personalDataFields = personalDataFormBuilder.build();

  const locationFields = locationFormBuilder.build({
    showTranslatedAddress: true,
    location,
    setLocation,
    readableAddress,
    setReadableAddress,
  });

  const steps = [{
    label: signUpLabels['steps.your.data'],
    isOptional: false,
    component: <Form
      fields={personalDataFields}
      title={title}
      styles={{ display: activeStep === 0 ? 'flex' : 'none' }}
    />,
  },
  {
    label: signUpLabels['steps.your.location'],
    isOptional: false,
    component: <Form
      containerId="locationMapContainer"
      fields={locationFields}
      title={signUpLabels['location.proveedor.title']}
      styles={{ display: activeStep === 1 ? 'flex' : 'none' }}
    />,
  }];

  const prepareFormRendering = async (stepIndex) => {
    const functions = {
      0: () => {
        personalDataFormBuilder.prepareForRender();
      },

      1: () => {
        locationFormBuilder.prepareForRender();
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
      { steps.map((step) => step.component) }
      <Stepper
        steps={steps}
        completedSteps={completedSteps}
        activeStep={activeStep}
        onStepChange={handleOnStepChange}
      />
    </Grid>
  );
}
