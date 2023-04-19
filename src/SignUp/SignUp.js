import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { signUpLabels } from '../StaticData/SignUp';
import {
  DialogModal,
  Form, PlanSelection, Stepper,
} from '../Shared/Components';
import { LocationFormBuilder, PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { routes, systemConstants } from '../Shared/Constants';

const locationFormBuilder = new LocationFormBuilder();

const personalDataFormBuilder = new PersonalDataFormBuilder();

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp({
  signupType, dispatchSignUp, hasError, router,
}) {
  const { title } = signUpLabels;

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
    usuarioType: signupType,
    fieldsValues: personalDataFieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      setPersonalDataFieldsValues({ ...personalDataFieldsValues, [fieldId]: fieldValue });
    },
  });

  const locationFields = locationFormBuilder.build({
    usuarioType: signupType,
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
    title={locationFormBuilder.getTitle()}
  />,
    nextButtonEnabled: useMemo(() => !!location && Object.values(location)
      .every((value) => value), [[location]]),
  }];

  if (signupType !== systemConstants.USER_TYPE_CLIENTE) {
    steps.push({
      label: signUpLabels['steps.planType'],
      isOptional: false,
      component: <PlanSelection
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        paidPlanValue={200}
      />,
      backButtonEnabled: true,
      nextButtonEnabled: true,
    });
  }

  const prepareFormRendering = async (stepIndex) => {
    const commonSteps = {
      0: () => personalDataFormBuilder.prepareForRender(),

      1: () => locationFormBuilder.prepareForRender(),

    };

    const nonClientFunctions = {
      ...commonSteps,

      3: () => setOpenConfirmationModal(true),
    };

    const clientFunctions = {
      ...commonSteps,

      2: () => setOpenConfirmationModal(true),

    };

    const functions = {
      [systemConstants.USER_TYPE_PROVEEDOR_PRODUCTS]: nonClientFunctions,
      [systemConstants.USER_TYPE_PROVEEDOR_SERVICES]: nonClientFunctions,
      [systemConstants.USER_TYPE_CLIENTE]: clientFunctions,
    };

    return stepIndex in functions[signupType] ? functions[signupType][stepIndex]() : () => {};
  };

  const handleOnStepChange = async (newStepIndex) => {
    const returningFromLastStep = activeStep === steps.length && newStepIndex === steps.length - 1;
    if (returningFromLastStep) {
      setOpenConfirmationModal(false);
    } else {
      await prepareFormRendering(newStepIndex);
    }
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
        open={openConfirmationModal && !hasError}
        handleAccept={() => dispatchSignUp({ ...personalDataFieldsValues, selectedPlan, location })}
        handleDeny={() => handleOnStepChange(steps.length - 1)}
      />
      <DialogModal
        title={signUpLabels['signup.error.title']}
        contextText={signUpLabels['signup.error.context']}
        acceptText={signUpLabels['confirmation.ok']}
        open={hasError}
        handleAccept={() => router.navigate(routes.index)}
      />
      {isStepValid && (
      <Stepper
        steps={steps}
        activeStep={activeStep}
        onStepChange={handleOnStepChange}
        backButtonEnabled={steps[activeStep].backButtonEnabled}
        nextButtonEnabled={steps[activeStep].nextButtonEnabled}
      />
      )}
    </>
  );
}

UserSignUp.defaultProps = {
  hasError: false,
};

UserSignUp.propTypes = {
  signupType: PropTypes.string.isRequired,
  dispatchSignUp: PropTypes.func.isRequired,
  router: PropTypes.any.isRequired,
  hasError: PropTypes.bool,
};
