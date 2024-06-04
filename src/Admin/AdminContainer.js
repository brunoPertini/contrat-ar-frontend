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

function AdminContainer() {
  const userInfo = useSelector(userInfoSelector);

  const menuOptions = getUserMenuOptions([{ onClick: () => {} }], userInfo.role);

  return <AdminPage userInfo={userInfo} menuOptions={menuOptions} />;
}

export default withRouter(AdminContainer);
