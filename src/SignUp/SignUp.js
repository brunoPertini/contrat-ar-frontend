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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
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
import { sharedLabels } from '../StaticData/Shared';

const personalDataFormBuilder = new PersonalDataFormBuilder();

const geoSettings = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 20000,
};

/**
 * TODO: sacar el modal de error de acá,
 * y chequear que el mail que pongan sea un string de mail válido

/**
 * FormBuilder for user signup. Responsible of defining form fields, titles, and application
 * logic for signup (like steps control)
 */
export default function UserSignUp({
  signupType, dispatchSignUp, hasError, planesInfo,
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
    usuarioType: signupType,
    fieldsValues: personalDataFieldsValues,
    errorFields,
    onChangeFields: (fieldId, fieldValue, fieldsHasError) => {
      setErrorFields((previous) => ({ ...previous, [fieldId]: fieldsHasError }));
      setPersonalDataFieldsValues({ ...personalDataFieldsValues, [fieldId]: fieldValue });
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadProfilePhoto(file).then((response) => {
        setProfilePhoto(response);
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  const userProfilePhotoMarkup = (
    <>
      <Avatar
        alt={`${personalDataFieldsValues.name} ${personalDataFieldsValues.surname}`}
        src={profilePhoto}
        sx={{
          height: 100,
          width: 100,
        }}
      />
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: '5%' }}
      >
        {sharedLabels.changeImage}
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            height: 1,
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            left: 0,
            whiteSpace: 'nowrap',
            width: 1,
          }}
        />
      </Button>
    </>
  );

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

      return someFieldWithError === false && allFieldsHaveValue;
    }, [personalDataFieldsValues, errorFields]),
  },
  {
    label: signUpLabels['steps.profilePhoto'],
    isOptional: false,
    component: <Form
      fields={[userProfilePhotoMarkup]}
    />,
  },
  {
    label: signUpLabels['steps.your.location'],
    isOptional: false,
    component:
  <Box display="flex" flexDirection="column">
    <Box display="flex" flexDirection="row" alignItems="center">
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
    steps.push({
      label: signUpLabels['steps.planType'],
      isOptional: false,
      component: <PlanSelection
        userLocation={location}
        planesInfo={planesInfo}
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

      1: () => {},

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

  useEffect(() => {
    handlePermission();
  }, []);

  return (
    <Box display="flex" flexDirection="column">
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
};

UserSignUp.propTypes = {
  signupType: PropTypes.string.isRequired,
  dispatchSignUp: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  hasError: PropTypes.bool,
};
