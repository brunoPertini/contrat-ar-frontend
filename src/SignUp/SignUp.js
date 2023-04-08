import { useMemo, useState } from 'react';
import {
  IconButton, Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { signUpLabels } from '../StaticData/SignUp';
import {
  DialogModal,
  Form, PlanSelection, Stepper, Tooltip,
} from '../Shared/Components';
import { LocationFormBuilder, PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { systemConstants } from '../Shared/Constants';

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
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  // Steps data
  const [personalDataFieldsValues, setPersonalDataFieldsValues] = useState(
    personalDataFormBuilder.fields,
  );
  const [location, setLocation] = useState();
  const [readableAddress, setReadableAddress] = useState('');

  const [selectedPlan, setSelectedPlan] = useState(systemConstants.PLAN_TYPE_FREE);

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
  },
  {
    label: signUpLabels['steps.planType'],
    isOptional: false,
    component: <PlanSelection
      selectedPlan={selectedPlan}
      setSelectedPlan={setSelectedPlan}
      paidPlanValue={200}
    />,
    backButtonEnabled: true,
    nextButtonEnabled: true,
  }];

  const prepareFormRendering = async (stepIndex) => {
    const functions = {
      0: () => personalDataFormBuilder.prepareForRender(),

      1: () => locationFormBuilder.prepareForRender(),

      2: () => setOpenConfirmationModal(false),

      3: () => setOpenConfirmationModal(true),
    };
    return stepIndex in functions ? functions[stepIndex]() : () => {};
  };

  const handleOnStepChange = async (newStepIndex) => {
    await prepareFormRendering(newStepIndex);
    setActiveStep(newStepIndex);
  };

  const isStepValid = activeStep < steps.length;

  return (
    <>
      { isStepValid ? steps[activeStep].component : null}
      <DialogModal
        title={signUpLabels['confirmation.title']}
        contextText={signUpLabels['confirmation.context']}
        cancelText={signUpLabels['confirmation.cancel']}
        acceptText={signUpLabels['confirmation.ok']}
        open={openConfirmationModal}
        handleAccept={() => {}}
        handleDeny={() => handleOnStepChange(steps.length - 1)}
      />
      {isStepValid && (
      <Stepper
        steps={steps}
        completedSteps={completedSteps}
        activeStep={activeStep}
        onStepChange={handleOnStepChange}
        backButtonEnabled={steps[activeStep].backButtonEnabled}
        nextButtonEnabled={steps[activeStep].nextButtonEnabled}
      />
      )}
    </>
  );
}
