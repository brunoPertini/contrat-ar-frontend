/* eslint-disable react/prop-types */
import Header from '../Header';

function AdminPage({ userInfo, menuOptions }) {
  return (
    <Header
      withMenuComponent
      renderNavigationLinks
      menuOptions={menuOptions}
      userInfo={userInfo}
    />
  );
}

export default AdminPage;
