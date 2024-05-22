import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import UserProfile from '../index';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { CLIENTE } from '../../Shared/Constants/System';
import { replaceUserInfo } from '../../State/Actions/usuario';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function UserProfileContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const editClienteInfo = (info) => {
    const client = HttpClientFactory.createUserHttpClient(null, { token: userInfo.token });

    return client.updateUserCommonInfo(userInfo.id, info, userInfo.role);
  };

  const confirmPlanChange = (newPlan) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });

    return client.updatePlan(userInfo.id, newPlan);
  };

  const editProveedorInfo = (info) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });

    return client.updateCommonInfo(userInfo.id, info, { token: userInfo.token });
  };

  const callEditCommonInfo = async (info) => {
    const changedInfo = (userInfo.role === CLIENTE
      ? await editClienteInfo(info) : await editProveedorInfo(info));

    dispatch(replaceUserInfo(changedInfo));
  };

  const handleUploadProfilePhoto = (file) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });

    return client.uploadProfilePhoto(userInfo.id, file);
  };

  const requestChangeExists = (attributes) => {
    const client = HttpClientFactory.createAdminHttpClient({ token: userInfo.token });

    return client.requestChangeExists(userInfo.id, attributes);
  };

  const getAllPlanes = () => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });
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
      />
    </NavigationContextProvider>
  );
}

UserProfileContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(UserProfileContainer);
