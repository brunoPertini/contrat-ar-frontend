import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import UserProfile from '..';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function UserProfileContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const callEditCommonInfo = ({ info }) => {
    const client = HttpClientFactory.createUserHttpClient(null, { token: userInfo.token });

    return client.updateUserCommonInfo(userInfo.id, info, userInfo.role);
  };

  const handleUploadProfilePhoto = (file) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: userInfo.token });

    return client.uploadProfilePhoto(userInfo.id, file);
  };

  return (
    <NavigationContextProvider>
      <UserProfile
        handleLogout={handleLogout}
        userInfo={userInfo}
        editCommonInfo={callEditCommonInfo}
        uploadProfilePhoto={handleUploadProfilePhoto}
      />
    </NavigationContextProvider>
  );
}

UserProfileContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(UserProfileContainer);
