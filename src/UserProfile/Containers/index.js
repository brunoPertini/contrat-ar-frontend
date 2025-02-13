import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import UserProfile from '../index';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { CLIENTE } from '../../Shared/Constants/System';
import { replaceUserInfo, setUserInfo } from '../../State/Actions/usuario';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';

const stateSelector = (state) => state;

const localStorageService = new LocalStorageService();

function UserProfileContainer({ handleLogout, isAdmin }) {
  const userInfoSelector = createSelector(
    stateSelector,
    (state) => state.usuario,
  );

  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const getUserInfo = () => {
    const client = HttpClientFactory.createUserHttpClient(null, {
      token: userInfo.token,
      handleLogout,
    });

    return client.getUserInfo(userInfo.id).then((info) => dispatch(setUserInfo(info)));
  };

  const editClienteInfo = (info) => {
    const client = HttpClientFactory.createUserHttpClient(null, {
      token: userInfo.token,
      handleLogout,
    });

    return client.updateUserCommonInfo(userInfo.id, info, userInfo.role);
  };

  const confirmPlanChange = (proveedorId, planId) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.updatePlan(proveedorId, planId);
  };

  const editProveedorInfo = (info) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    return client.updateCommonInfo(userInfo.id, info, { token: userInfo.token });
  };

  const editPersonalInfoForAdmin = (info) => {
    const client = HttpClientFactory.createAdminHttpClient({
      alternativeUrl: process.env.REACT_APP_ADMIN_BACKEND_URL,
      token: userInfo.token,
      handleLogout,
    });

    return (userInfo.role === CLIENTE ? client.updateClientePersonalData(userInfo.id, info)
      : client.updateProveedorPersonalData(userInfo.id, info)).then(() => {
      localStorageService.setItem(
        LocalStorageService.PAGES_KEYS.ADMIN.USER_INFO,
        { ...info, id: userInfo.id },
      );
    });
  };

  const callEditCommonInfo = async (info) => {
    const noAminHandlers = {
      CLIENTE: () => editClienteInfo(info),
      PROVEEDOR_PRODUCTOS: () => editProveedorInfo(info),
      PROVEEDOR_SERVICIOS: () => editProveedorInfo(info),
    };

    const toRunFunction = !isAdmin ? noAminHandlers[userInfo.role]
      : editPersonalInfoForAdmin;

    return toRunFunction(info).then(() => {
      dispatch(replaceUserInfo({ ...info, id: userInfo.id }));
      return Promise.resolve();
    }).catch(() => Promise.reject());
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

  return (
    <NavigationContextProvider>
      <UserProfile
        handleLogout={handleLogout}
        userInfo={userInfo}
        editCommonInfo={callEditCommonInfo}
        uploadProfilePhoto={handleUploadProfilePhoto}
        confirmPlanChange={confirmPlanChange}
        requestChangeExists={requestChangeExists}
        getAllPlanes={getAllPlanes}
        isAdmin={isAdmin}
        getUserInfo={getUserInfo}
      />
    </NavigationContextProvider>
  );
}

UserProfileContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default withRouter(UserProfileContainer);
