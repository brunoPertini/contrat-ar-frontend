import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {
  useCallback, useEffect, useState,
} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Groups2Icon from '@mui/icons-material/Groups2';
import BuildIcon from '@mui/icons-material/Build';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Header from '../../Header';
import { ExpandableCard, withRouter } from '../../Shared/Components';
import { signUpLabels } from '../../StaticData/SignUp';
import UserSignUp from '../SignUp';
import { routes, systemConstants } from '../../Shared/Constants';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { USER_TYPE_CLIENTE } from '../../Shared/Constants/System';
import usePaymentQueryParams from '../../Shared/Hooks/usePaymentQueryParams';
import usePaymentDialogModal from '../../Shared/Hooks/usePaymentDialogModal';

const localStorageService = new LocalStorageService();

const iconStyles = { fontSize: '2.5rem' };

const titleStyles = { fontSize: '1.5rem' };

const cardStyles = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 30%',
  cursor: 'pointer',
  '&:hover': { boxShadow: 6 },
  border: '1px solid rgb(36, 134, 164)',
};

/**
 * Business logic component. It holds signup type and starts the flow for registration process.
 */
function SignUpContainer({ router }) {
  const [signupType, setSignupType] = useState();
  const [planesInfo, setPlanesInfo] = useState([]);
  const [activeStep, setActiveStep] = useState();

  const [temporalToken, setTemporalToken] = useState();

  const [openPaymentDialogModal, setOpenPaymentDialogModal] = useState(false);

  const [paySubscriptionServiceResult, setPaySubscriptionServiceResult] = useState(null);

  const paymentParams = usePaymentQueryParams(paySubscriptionServiceResult);

  const dispatchSignUp = (body) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.crearUsuario(signupType, {}, {
      ...body,
      proveedorType: signupType,
    }).then((response) => {
      setTemporalToken(response.creationToken);
      return response;
    })
      .catch(() => {
        localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.COMES_FROM_SIGNUP, true);
        localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.SUCCESS, false);
        window.location.href = routes.index;
      });
  };

  const handleSetSignupType = useCallback((type) => {
    setSignupType(type);
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.SIGNUP.SIGNUP_TYPE, type);
  }, [setSignupType]);

  const getAllPlanes = () => {
    const client = HttpClientFactory.createProveedorHttpClient();
    return client.getAllPlanes();
  };

  const fetchPlanesInfo = async () => {
    const fetchedInfo = await getAllPlanes();
    setPlanesInfo(fetchedInfo);
  };

  const handleUploadProfilePhoto = (dni, file) => {
    const client = HttpClientFactory.createProveedorHttpClient();

    return client.uploadTemporalProfilePhoto(dni, file);
  };

  const sendAccountConfirmEmail = (email) => {
    const client = HttpClientFactory.createUserHttpClient();

    return client.sendRegistrationConfirmEmail(email);
  };

  const handleCreateSubscription = (proveedorId, planId) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: temporalToken });

    return client.createSubscription(proveedorId, planId);
  };

  const handlePaySubscription = (id) => {
    const client = HttpClientFactory.createPaymentHttpClient({ token: temporalToken });

    return client.paySubscription(id)
      .then(() => setPaySubscriptionServiceResult(true))
      .catch((error) => {
        setPaySubscriptionServiceResult(false);
        return Promise.reject(error);
      });
  };

  const getPaymentInfo = (id, restoredToken) => {
    const client = HttpClientFactory.createPaymentHttpClient({
      token: temporalToken || restoredToken,
    });

    return client.getPaymentInfo(id);
  };

  const signupTypeColumns = (
    <>
      <Card
        sx={{
          ...cardStyles,
        }}
        onClick={() => handleSetSignupType(systemConstants.USER_TYPE_CLIENTE)}
      >
        <CardHeader
          title={signUpLabels['signup.want.to.client']}
          avatar={<Groups2Icon sx={{ ...iconStyles }} />}
          titleTypographyProps={{ ...titleStyles }}
        />
        <CardContent>
          <Typography variant="body1">
            { signUpLabels['client.content.text']}
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{ ...cardStyles }}
        onClick={() => handleSetSignupType(systemConstants.USER_TYPE_PROVEEDOR_SERVICES)}
      >
        <CardHeader
          title={signUpLabels['signup.want.to.offer.services']}
          avatar={<BuildIcon sx={{ ...iconStyles }} />}
          titleTypographyProps={{ ...titleStyles }}
        />
        <CardContent>
          <Typography variant="body1">
            {signUpLabels['provider.service.context.text']}
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{ ...cardStyles }}
        onClick={() => handleSetSignupType(systemConstants.USER_TYPE_PROVEEDOR_PRODUCTS)}
      >
        <CardHeader
          title={signUpLabels['signup.want.to.offer.products']}
          avatar={<HandshakeIcon sx={{ ...iconStyles }} />}
          titleTypographyProps={{ ...titleStyles }}
        />
        <CardContent>
          <Typography variant="body1">
            { signUpLabels['provider.product.context.text']}
          </Typography>
        </CardContent>
      </Card>
    </>
  );

  const innerComponent = !signupType
    ? (
      <ExpandableCard
        title={(
          <Typography variant="h5">
            {signUpLabels['signup.selection.title']}
          </Typography>
        )}
        gridStyles={{
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
        collapsableContent={signupTypeColumns}
        keepCollapsableAreaOpen
      />
    ) : (
      <UserSignUp
        planesInfo={planesInfo}
        signupType={signupType}
        dispatchSignUp={dispatchSignUp}
        router={router}
        localStorageService={localStorageService}
        handleUploadProfilePhoto={handleUploadProfilePhoto}
        sendAccountConfirmEmail={sendAccountConfirmEmail}
        createSubscription={handleCreateSubscription}
        handlePaySubscription={handlePaySubscription}
        externalStep={activeStep}
      />
    );

  const closePaymentDialogModal = useCallback(
    () => {
      setOpenPaymentDialogModal(false);
      setPaySubscriptionServiceResult(null);
    },
    [setOpenPaymentDialogModal],
  );

  const openPaymentDialog = () => {
    const storedSignupType = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.SIGNUP.SIGNUP_TYPE,
    )?.replaceAll('"', '');

    if (storedSignupType) {
      setSignupType(storedSignupType);
    }
    setActiveStep(4);
    setOpenPaymentDialogModal(true);
  };

  const checkPaymentExistence = () => {
    const restoredToken = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.SIGNUP.CREATION_TOKEN,
    )?.replaceAll('"', '');
    setTemporalToken(restoredToken);
    getPaymentInfo(paymentParams.paymentId, restoredToken).then((info) => {
      if (info.id === +paymentParams.paymentId && info.state === paymentParams.status) {
        openPaymentDialog();
      }
    }).catch(() => setOpenPaymentDialogModal(false))
      .finally(() => localStorageService.removeItem(
        LocalStorageService.PAGES_KEYS.SIGNUP.CREATION_TOKEN,
      ));
  };

  useEffect(() => {
    if (signupType !== USER_TYPE_CLIENTE) {
      fetchPlanesInfo();
    }
  }, []);

  // Coming back from payment page or pay subscription service
  useEffect(() => {
    if (paymentParams.paymentId && paymentParams.status) {
      checkPaymentExistence();
    } else if (paySubscriptionServiceResult === false) {
      openPaymentDialog();
    }
  }, [paymentParams, paySubscriptionServiceResult]);

  const paymentDialogModal = usePaymentDialogModal(openPaymentDialogModal, closePaymentDialogModal);

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        { paymentDialogModal }
        {innerComponent}
      </Box>

    </>
  );
}

export default withRouter(SignUpContainer);

SignUpContainer.propTypes = {
  router: PropTypes.any.isRequired,
};
