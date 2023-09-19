import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import VendiblePage from '../Components';
import { withRouter } from '../../Shared/Components';

const stateSelector = (state) => state;

function VendibleContainer() {
  const location = useLocation();
  const { proveedoresInfo, vendibleType } = location.state;

  const userInfoSelector = createSelector(
    stateSelector,
    (state) => state.usuario,
  );

  const userInfo = useSelector(userInfoSelector);

  return (
    <VendiblePage
      proveedoresInfo={proveedoresInfo}
      vendibleType={vendibleType}
      userInfo={userInfo}
    />
  );
}

export default withRouter(VendibleContainer);
