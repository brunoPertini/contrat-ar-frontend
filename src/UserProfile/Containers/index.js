/* eslint-disable react/prop-types */
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import UserProfile from '..';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { withRouter } from '../../Shared/Components';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function UserProfileContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  return (
    <NavigationContextProvider>
      <UserProfile handleLogout={handleLogout} userInfo={userInfo} />
    </NavigationContextProvider>
  );
}

export default withRouter(UserProfileContainer);
