import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { UserAccountOptions, withRouter } from '../../Shared/Components';
import ProveedorPage from '../Components';
import { systemConstants } from '../../Shared/Constants';
import { proveedorLabels } from '../../StaticData/Proveedor';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const addNewVendiblesLables = {
  [systemConstants.ROLE_PROVEEDOR_PRODUCTOS]: {
    label: proveedorLabels.addNewProductLabel,
    labelLink: proveedorLabels.addNewProductLinkLabel,
  },
  [systemConstants.ROLE_PROVEEDOR_PRODUCTOS]: {
    label: proveedorLabels.addNewProductLabel,
    labelLink: proveedorLabels.addNewProductLinkLabel,
  },
};

function ProveedorContainer() {
  const userInfo = useSelector(userInfoSelector);

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];
  return <ProveedorPage menuOptions={menuOptions} />;
}

export default withRouter(ProveedorContainer);
