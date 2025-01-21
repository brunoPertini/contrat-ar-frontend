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
import CircularProgress from '@mui/material/CircularProgress';
import isEmpty from 'lodash/isEmpty';
import { signUpLabels } from '../StaticData/SignUp';
import { labels as locationMapLabels } from '../StaticData/LocationMap';

import DialogModal from '../Shared/Components/DialogModal';
import Form from '../Shared/Components/Form';
import LocationMap from '../Shared/Components/LocationMap';
import PlanSelection from '../Shared/Components/PlanSelection';
import Stepper from '../Shared/Components/Stepper';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { routes, systemConstants } from '../Shared/Constants';
import { getPlanId, getPlanType } from '../Shared/Helpers/PlanesHelper';
import { planShape } from '../Shared/PropTypes/Proveedor';
import ProfilePhoto from '../Shared/Components/ProfilePhoto';
import AccountMailConfirmation from './AccountMailConfirmation';
import { sharedLabels } from '../StaticData/Shared';
import { flexColumn, flexRow } from '../Shared/Constants/Styles';
import { PLAN_TYPE_PAID } from '../Shared/Constants/System';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';

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
  signupType, dispatchSignUp, hasError, planesInfo, handleUploadProfilePhoto, externalStep,
  sendAccountConfirmEmail, createSubscription, localStorageService, handlePaySubscription,
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

  const [isLoading, setIsLoading] = useState(false);
  const [createdUserInfo, setCreatedUserInfo] = useState({});

  const [subscriptionInfo, setSubscriptionInfo] = useState();

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

  const saveSignupDataInLocalStorage = () => {
    localStorageService.setItem(
      LocalStorageService.PAGES_KEYS.SIGNUP.PERSONAL_DATA,
      personalDataFieldsValues,
    );
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.SIGNUP.LOCATION, location);
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.SIGNUP.PROFILE_PHOTO, profilePhoto);
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.SIGNUP.PLAN_ID, selectedPlan);
    localStorageService.setItem(
      LocalStorageService.PAGES_KEYS.SIGNUP.CREATION_TOKEN,
      createdUserInfo.creationToken,
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

  const handlePostPlanChosen = () => {
    setIsLoading(true);
    if (isEmpty(subscriptionInfo)) {
      createSubscription(
        createdUserInfo.id,
        selectedPlan,
        createdUserInfo.creationToken,
      ).then((response) => {
        const planLabel = getPlanType(planesInfo, response.planId);
        if (planLabel === PLAN_TYPE_PAID) {
          // removeOnLeavingTabHandlers();
          saveSignupDataInLocalStorage();
          handlePaySubscription(
            response.id,
          ).then((checkoutUrl) => {
            window.location.href = checkoutUrl;
          });
        }
        setSubscriptionInfo(response);
      });
    }
  };

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
  },
  {
    label: signUpLabels['account.confirmation.email'],
    isOptional: false,
    component: <AccountMailConfirmation
      email={personalDataFieldsValues.email}
      sendAccountConfirmEmail={sendAccountConfirmEmail}
    />,
    backButtonEnabled: false,
    nextButtonEnabled: false,
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

    steps.splice(2, 0, profilePhotoStep);

    const planTypeStep = {
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
    };

    steps.splice(3, 0, planTypeStep);
  }

  const manageSignUp = () => {
    setIsLoading(true);
    dispatchSignUp({
      ...personalDataFieldsValues,
      fotoPerfilUrl: profilePhoto,
      location,
    }).then((response) => setCreatedUserInfo(response))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const prepareFormRendering = async (stepIndex) => {
    const commonSteps = {
      0: () => personalDataFormBuilder.prepareForRender(),

    };

    const handleOpenConfirmationModal = () => {
      if (isEmpty(createdUserInfo)) {
        setOpenConfirmationModal(true);
      }
    };

    const nonClientFunctions = {
      ...commonSteps,

      3: handleOpenConfirmationModal,

      4: handlePostPlanChosen,

    };

    const clientFunctions = {
      ...commonSteps,

      2: handleOpenConfirmationModal,

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

  const isStepValid = useMemo(
    () => activeStep < steps.length && !!steps[activeStep],
    [activeStep, steps],
  );

  useEffect(() => {
    handlePermission();
  }, []);

  useEffect(() => {
    if (externalStep) {
      setActiveStep(externalStep);
    }
  }, [externalStep]);

  return (
    <Box {...flexColumn} sx={{ alignItems: 'center' }}>
      { isLoading && (
      <>
        <CircularProgress />
        <Typography variant="h6">
          { sharedLabels.loading }
        </Typography>
      </>
      ) }
      { !isLoading && isStepValid ? steps[activeStep].component : null}
      <DialogModal
        title={signUpLabels['confirmation.title']}
        contextText={signUpLabels['confirmation.context']}
        cancelText={signUpLabels['confirmation.cancel']}
        acceptText={signUpLabels['confirmation.ok']}
        open={openConfirmationModal && !hasError}
        handleAccept={() => {
          if (isEmpty(createdUserInfo)) {
            manageSignUp();
          }
          setOpenConfirmationModal(false);
        }}
        handleDeny={() => {
          setOpenConfirmationModal(false);
          handleOnStepChange(0);
        }}
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
      {!isLoading && isStepValid && (
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
  externalStep: undefined,
};

UserSignUp.propTypes = {
  signupType: PropTypes.string.isRequired,
  dispatchSignUp: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  sendAccountConfirmEmail: PropTypes.func.isRequired,
  handleUploadProfilePhoto: PropTypes.func,
  handlePaySubscription: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  hasError: PropTypes.bool,
  externalStep: PropTypes.number,
  localStorageService: PropTypes.instanceOf(LocalStorageService).isRequired,
};
