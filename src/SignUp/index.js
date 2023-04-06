import { useMemo, useState } from 'react';
import {
  Grid, IconButton, Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Header from '../Header';
import { signUpLabels } from '../StaticData/SignUp';
import { Form, Stepper, Tooltip } from '../Shared/Components';
import { LocationFormBuilder, PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';

const locationFormBuilder = new LocationFormBuilder();

const personalDataFormBuilder = new PersonalDataFormBuilder();

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp() {
  const { title } = signUpLabels;

  const [completedSteps] = useState(new Set());

  const [activeStep, setActiveStep] = useState(0);

  const [personalDataFieldsValues, setPersonalDataFieldsValues] = useState(
    personalDataFormBuilder.fields,
  );
  const [location, setLocation] = useState();
  const [readableAddress, setReadableAddress] = useState('');

  const personalDataFields = personalDataFormBuilder.build({
    fieldsValues: personalDataFieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      setPersonalDataFieldsValues({ ...personalDataFieldsValues, [fieldId]: fieldValue });
    },
  });

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
    />,
    backButtonEnabled: false,
    nextButtonEnabled: useMemo(() => Object.values(personalDataFieldsValues)
      .every((value) => value), [[personalDataFields]]),
  },
  {
    label: signUpLabels['steps.your.location'],
    isOptional: false,
    component:
  <Form
    fields={locationFields}
    title={(
      <>
        {signUpLabels['location.proveedor.title']}
        <Tooltip
          title={(
            <Typography variant="h6">
              {signUpLabels['title.disclaimer']}
            </Typography>
            )}
          placement="right-start"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </>
)}
  />,
    nextButtonEnabled: useMemo(() => !!location && Object.values(location)
      .every((value) => value), [[location]]),
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
      { steps[activeStep].component }
      <Stepper
        steps={steps}
        completedSteps={completedSteps}
        activeStep={activeStep}
        onStepChange={handleOnStepChange}
        backButtonEnabled={steps[activeStep].backButtonEnabled}
        nextButtonEnabled={steps[activeStep].nextButtonEnabled}
      />
    </Grid>
  );
}
