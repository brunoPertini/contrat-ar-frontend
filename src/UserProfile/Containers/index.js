import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import UserProfile from '../index';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { CLIENTE } from '../../Shared/Constants/System';
import { replaceUserInfo, setUserInfo } from '../../State/Actions/usuario';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { signinLabels } from '../../StaticData/SignIn';
import usePaymentQueryParams from '../../Shared/Hooks/usePaymentQueryParams';
import usePaymentDialogModal from '../../Shared/Hooks/usePaymentDialogModal';
import { paymentLabels } from '../../StaticData/Payment';
import { TABS_NAMES } from '../Constants';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const localStorageService = new LocalStorageService();

function UserProfileContainer({ handleLogout, isAdmin }) {
  const [paySubscriptionServiceResult, setPaySubscriptionServiceResult] = useState(null);
  const [openPaymentDialogModal, setOpenPaymentDialogModal] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [temporalToken, setTemporalToken] = useState();

  const [changedPlanWithPromotionFull, setChangedPlanWithPromotionFull] = useState(false);

  const paymentParams = usePaymentQueryParams(paySubscriptionServiceResult);

  const queryParams = new URLSearchParams(window.location.search);

  const returnTab = queryParams.get('returnTab');

  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const openPaymentDialog = () => {
    setOpenPaymentDialogModal(true);
  };

  const getUserInfo = () => {
    const client = HttpClientFactory.createUserHttpClient(null, {
      token: userInfo.token,
      handleLogout,
    });

    return client.getUserInfo(userInfo.id).then((info) => dispatch(setUserInfo(info)));
  };

  const confirmPlanChange = (proveedorId, planId, promotionId) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.createSubscription(proveedorId, planId, promotionId).then((suscripcionData) => {
      if (promotionId) {
        setChangedPlanWithPromotionFull(true);
      }
      return Promise.resolve(suscripcionData);
    }).catch((error) => Promise.reject(error));
  };

  const editClienteInfo = (info) => {
    const client = HttpClientFactory.createUserHttpClient(null, {
      token: userInfo.token,
      handleLogout,
    });

    return client.updateUserCommonInfo(userInfo.id, info, userInfo.role);
  };

  const editProveedorInfo = (info) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.updateCommonInfo(userInfo.id, info, { token: userInfo.token });
  };

  const editPersonalInfoForAdmin = (info) => (userInfo.role === CLIENTE ? editClienteInfo(info)
    : editProveedorInfo(info)).then(() => {
    localStorageService.setItem(
      LocalStorageService.PAGES_KEYS.ADMIN.USER_INFO,
      { ...info, id: userInfo.id },
    );
  });

  const callEditCommonInfo = async (info, tabName) => {
    const noAminHandlers = {
      CLIENTE: () => editClienteInfo(info),
      PROVEEDOR_PRODUCTOS: () => editProveedorInfo(info),
      PROVEEDOR_SERVICIOS: () => editProveedorInfo(info),
    };

    const toRunFunction = !isAdmin ? noAminHandlers[userInfo.role]
      : editPersonalInfoForAdmin;

    return toRunFunction(info).then(() => {
      dispatch(replaceUserInfo({ ...info, id: userInfo.id }));
      if (tabName === TABS_NAMES.SECURITY) {
        handleLogout({ errorMessage: signinLabels['session.closed.signin'] });
      }
    }).catch(() => {
      dispatch(replaceUserInfo({ is2FaValid: false }));
      return Promise.reject();
    });
  };

  const handleUploadProfilePhoto = (file) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.uploadProfilePhoto(userInfo.id, file);
  };

  const requestChangeExists = (ids, attributes) => {
    const client = HttpClientFactory.createAdminHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.requestChangeExists(ids, attributes);
  };

  const getAllPlanes = () => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });
    return client.getAllPlanes();
  };

  const getPaymentsOfUser = () => {
    const client = HttpClientFactory.createPaymentHttpClient({ token: userInfo.token, handleLogout });

    return client.getPaymentsOfUser(userInfo.id);
  };

  const paySubscription = (subscriptionId, sourceTab) => {
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.USER_PROFILE.TOKEN, userInfo.token);
    const client = HttpClientFactory.createPaymentHttpClient({ token: userInfo.token, handleLogout });

    return client.paySubscriptionFromUserProfile(subscriptionId, userInfo.id, sourceTab).then((checkoutUrl) => {
      setPaySubscriptionServiceResult(true);
      return checkoutUrl;
    })
      .catch((error) => {
        setPaySubscriptionServiceResult(false);
        return Promise.reject(error);
      });
  };

  const getPaymentInfo = (id) => {
    const client = HttpClientFactory.createPaymentHttpClient({
      token: userInfo.token,
    });

    return client.getPaymentInfo(id);
  };

  const closePaymentDialogModal = useCallback(
    () => {
      setOpenPaymentDialogModal(false);
      setPaySubscriptionServiceResult(null);
      setChangedPlanWithPromotionFull(false);
    },
    [setOpenPaymentDialogModal],
  );

  const checkPaymentExistence = () => {
    setTemporalToken((currentToken) => {
      getPaymentInfo(paymentParams.paymentId, currentToken || userInfo.token).then((info) => {
        if (info.id === +paymentParams.paymentId && info.state === paymentParams.status) {
          openPaymentDialog();
        }
      }).catch(() => setOpenPaymentDialogModal(false));
      return currentToken;
    });
  };

  const cancelPlanChange = (changeRequestId) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.cancelPlanChange(changeRequestId);
  };

  const changeUserActive = (isActive) => {
    const client = HttpClientFactory.createAdminHttpClient({
      token: userInfo.token,
      alternativeUrl: process.env.REACT_APP_ADMIN_BACKEND_URL,
      handleLogout,
    });

    return client.changeIsUserActive(userInfo.id, isActive).then(() => {
      dispatch(replaceUserInfo({ active: isActive }));
      return Promise.resolve();
    }).catch(() => Promise.reject());
  };

  const restoreTokenInMemory = () => {
    const restoredToken = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.USER_PROFILE.TOKEN,
    )?.replaceAll('"', '');

    if (restoredToken) {
      setTemporalToken(restoredToken);
      localStorageService.removeItem(LocalStorageService.PAGES_KEYS.USER_PROFILE.TOKEN);
    }
  };

  const getSitePromotions = () => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });
    return client.getUserPromotions(userInfo.id);
  };

  // Coming back from payment page or pay subscription service
  useEffect(() => {
    if (paymentParams.paymentId && paymentParams.status) {
      checkPaymentExistence();
    } else if (paySubscriptionServiceResult === false) {
      openPaymentDialog();
    }
  }, [paymentParams, paySubscriptionServiceResult]);

  useEffect(() => {
    if (changedPlanWithPromotionFull) {
      openPaymentDialog();
    }
  }, [changedPlanWithPromotionFull]);

  useEffect(() => {
    restoreTokenInMemory();
  }, []);

  const resolvedPaymentLabels = useMemo(() => {
    if (changedPlanWithPromotionFull) {
      return {
        success: 'Tu plan fue cambiado correctamente',
        error: 'No fue posible cambiar tu plan. Por favor, intentalo de nuevo mas tarde',
      };
    }

    if (returnTab === TABS_NAMES.MY_PAYMENTS) {
      return {
        success: paymentLabels['payment.done'],
        error: paymentLabels['payment.notDone'].replace('{paymentId}', paymentParams.paymentId),
        unknown: paymentLabels['payment.unknownError'],

      };
    }

    if (returnTab === TABS_NAMES.PLAN) {
      return {
        success: paymentLabels['payment.plan.done'],
        error: paymentLabels['payment.plan.notDone'].replace('{paymentId}', paymentParams.paymentId),
        unknown: paymentLabels['payment.plan.unknownError'],

      };
    }

    return null;
  }, [paymentParams, changedPlanWithPromotionFull]);

  const paymentDialogModal = usePaymentDialogModal(
    openPaymentDialogModal,
    closePaymentDialogModal,
    resolvedPaymentLabels,
    paySubscriptionServiceResult,
    changedPlanWithPromotionFull,
  );

  return (
    <NavigationContextProvider>
      { paymentDialogModal }
      <UserProfile
        handleLogout={handleLogout}
        userInfo={userInfo}
        editCommonInfo={callEditCommonInfo}
        uploadProfilePhoto={handleUploadProfilePhoto}
        confirmPlanChange={confirmPlanChange}
        requestChangeExists={requestChangeExists}
        getAllPlanes={getAllPlanes}
        getPaymentsOfUser={getPaymentsOfUser}
        isAdmin={isAdmin}
        getUserInfo={getUserInfo}
        paySubscription={paySubscription}
        cancelPlanChange={cancelPlanChange}
        changeUserActive={changeUserActive}
        getSitePromotions={getSitePromotions}
      />
    </NavigationContextProvider>
  );
}

UserProfileContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default withRouter(UserProfileContainer);
