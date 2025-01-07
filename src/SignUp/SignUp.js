import {
  useCallback, useEffect,
  useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { signUpLabels } from '../StaticData/SignUp';
import { labels as locationMapLabels } from '../StaticData/LocationMap';

import {
  DialogModal,
  Form, LocationMap, PlanSelection, Stepper,
} from '../Shared/Components';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { routes, systemConstants } from '../Shared/Constants';
import { getPlanId } from '../Shared/Helpers/PlanesHelper';
import { planShape } from '../Shared/PropTypes/Proveedor';
import ProfilePhoto from '../Shared/Components/ProfilePhoto';
import { flexColumn, flexRow } from '../Shared/Constants/Styles';

const personalDataFormBuilder = new PersonalDataFormBuilder();

const geoSettings = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 20000,
};

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp({
  signupType, dispatchSignUp, hasError, planesInfo, handleUploadProfilePhoto,
}) {
  const { title } = signUpLabels;

  const [activeStep, setActiveStep] = useState(0);

  const [personalDataFieldsValues, setPersonalDataFieldsValues] = useState(
    personalDataFormBuilder.fields,
  );

  const [errorFields, setErrorFields] = useState({
    email: false,
  });

  const [location, setLocation] = useState();
  const [readableAddress, setReadableAddress] = useState('');

  const [selectedPlan, setSelectedPlan] = useState(
    getPlanId(planesInfo, systemConstants.PLAN_TYPE_FREE),
  );

  const [profilePhoto, setProfilePhoto] = useState();

  const [dialogLabels, setDialogLabels] = useState({
    title: locationMapLabels['dialog.permission.request.title'],
    contextText: locationMapLabels['dialog.permission.request.textContext'],
    cancelText: locationMapLabels['dialog.permission.request.cancelText'],
    acceptText: locationMapLabels['dialog.permission.request.acceptText'],
  });

  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleGranted = (position) => {
    setLocation({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    setOpenPermissionDialog(false);
  };

  const handleDialogDenied = () => {
    window.location.href = routes.index;
  };

  const getCurentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      handleGranted,
      handleDialogDenied,
      geoSettings,
    );
  };

  const handlePermission = useCallback(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        getCurentLocation();
      }
      if (result.state === 'prompt') {
        setDialogLabels({

          title: locationMapLabels['dialog.permission.request.title'],
          contextText: locationMapLabels['dialog.permission.request.textContext'],
          cancelText: locationMapLabels['dialog.permission.request.cancelText'],
          acceptText: locationMapLabels['dialog.permission.request.acceptText'],

        });
        setOpenPermissionDialog(true);
      }

      if (result.state === 'denied') {
        setDialogLabels({
          title: locationMapLabels['dialog.permission.revoke.title'],
          contextText: <span dangerouslySetInnerHTML={{ __html: locationMapLabels['dialog.permission.revoke.textContext'] }} />,
          acceptText: locationMapLabels['dialog.permission.revoke.finish'],
        });
        setOpenPermissionDialog(true);
      }
    });
  }, [handleGranted]);

  const personalDataFields = personalDataFormBuilder.build({
    showConfirmPasswordInput: true,
    showInlineLabels: true,
    usuarioType: signupType,
    fieldsValues: personalDataFieldsValues,
    gridStyles: { mt: '2%' },
    errorFields,
    onChangeFields: (fieldId, fieldValue, fieldsHasError) => {
      if (fieldId === 'password' || fieldId === 'confirmPassword') {
        const passwordsNotMatching = fieldId === 'password' ? fieldValue !== personalDataFieldsValues.confirmPassword : fieldValue !== personalDataFieldsValues.password;
        setErrorFields((previous) => ({
          ...previous,
          password: fieldsHasError || passwordsNotMatching,
          confirmPassword: fieldsHasError || passwordsNotMatching,
        }));
      } else {
        setErrorFields((previous) => ({ ...previous, [fieldId]: fieldsHasError }));
      }
      setPersonalDataFieldsValues({ ...personalDataFieldsValues, [fieldId]: fieldValue });
    },
  });

  const callUploadProfilePhoto = (
    file,
  ) => handleUploadProfilePhoto(personalDataFieldsValues.dni, file);

  const steps = [{
    label: signUpLabels['steps.your.data'],
    isOptional: false,
    component: <Form
      fields={personalDataFields}
      title={title}
    />,
    backButtonEnabled: false,
    nextButtonEnabled: useMemo(() => {
      const allFieldsHaveValue = Object.values(personalDataFieldsValues)
        .every((value) => value && !(errorFields[value]));

      const someFieldWithError = Object.values(errorFields).some((key) => key);

      const passwordsMatch = personalDataFieldsValues.password
      === personalDataFieldsValues.confirmPassword;

      return !someFieldWithError && allFieldsHaveValue && passwordsMatch;
    }, [personalDataFieldsValues, errorFields]),
  },
  {
    label: signUpLabels['steps.your.location'],
    isOptional: false,
    component:
  <Box
    display="flex"
    flexDirection="column"
    sx={{ mt: '5%' }}
  >
    <Box {...flexRow}>
      <Tooltip
        title={(
          <Typography variant="h6">
            {signUpLabels['title.disclaimer']}
          </Typography>
            )}
        placement="top-end"
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
      {signupType
         && signupType !== systemConstants.USER_TYPE_CLIENTE
        ? signUpLabels['location.proveedor.title'] : signUpLabels['location.cliente.title']}
    </Box>
    <LocationMap
      containerStyles={{
        height: '25rem',
        width: '100%',
      }}
      showTranslatedAddress
      location={location}
      setLocation={setLocation}
      readableAddress={readableAddress}
      setReadableAddress={setReadableAddress}
    />
  </Box>,
    nextButtonEnabled: useMemo(() => !!location && Object.values(location)
      .every((value) => value), [[location]]),
  }];

  if (signupType !== systemConstants.USER_TYPE_CLIENTE) {
    const profilePhotoStep = {
      label: signUpLabels['steps.profilePhoto'],
      isOptional: false,
      component: <Form
        title={signUpLabels['profilePhoto.title']}
        styles={{ alignItems: 'center ' }}
        fields={[<ProfilePhoto
          src={profilePhoto}
          alt={`${personalDataFieldsValues.name} ${personalDataFieldsValues.surname}`}
          onUpload={callUploadProfilePhoto}
          onSuccess={setProfilePhoto}
        />]}
      />,
      backButtonEnabled: true,
      nextButtonEnabled: !!(profilePhoto),
    };

    steps.splice(1, 0, profilePhotoStep);

    steps.push({
      label: signUpLabels['steps.planType'],
      isOptional: false,
      component: <PlanSelection
        userLocation={location}
        planesInfo={planesInfo}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />,
      backButtonEnabled: true,
      nextButtonEnabled: true,
    });
  }

  const prepareFormRendering = async (stepIndex) => {
    const commonSteps = {
      0: () => personalDataFormBuilder.prepareForRender(),

    };

    const nonClientFunctions = {
      ...commonSteps,

      4: () => setOpenConfirmationModal(true),
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

  useEffect(() => {
    handlePermission();
  }, []);

  return (
    <Box {...flexColumn}>
      { isStepValid ? steps[activeStep].component : null}
      <DialogModal
        title={signUpLabels['confirmation.title']}
        contextText={signUpLabels['confirmation.context']}
        cancelText={signUpLabels['confirmation.cancel']}
        acceptText={signUpLabels['confirmation.ok']}
        open={openConfirmationModal && !hasError}
        handleAccept={() => dispatchSignUp({
          ...personalDataFieldsValues,
          plan: selectedPlan,
          fotoPerfilUrl: profilePhoto,
          location,
        })}
        handleDeny={() => handleOnStepChange(steps.length - 1)}
      />
      <DialogModal
        title={dialogLabels.title}
        contextText={dialogLabels.contextText}
        cancelText={dialogLabels.cancelText}
        acceptText={dialogLabels.acceptText}
        open={openPermissionDialog}
        handleAccept={getCurentLocation}
        handleDeny={() => handleDialogDenied()}
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
    </Box>
  );
}

UserSignUp.defaultProps = {
  hasError: false,
  handleUploadProfilePhoto: undefined,
};

UserSignUp.propTypes = {
  signupType: PropTypes.string.isRequired,
  dispatchSignUp: PropTypes.func.isRequired,
  handleUploadProfilePhoto: PropTypes.func,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  hasError: PropTypes.bool,
};
