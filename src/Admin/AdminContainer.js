import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AdminPage from '.';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import { withRouter } from '../Shared/Components';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function AdminContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const menuOptionsConfig = {
    logout: {
      onClick: () => handleLogout(),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  return <AdminPage userInfo={userInfo} menuOptions={menuOptions} />;
}

export default withRouter(AdminContainer);

AdminContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
