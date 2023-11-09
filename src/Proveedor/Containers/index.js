import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { UserAccountOptions, withRouter } from '../../Shared/Components';
import ProveedorPage from '../Components';
import { systemConstants } from '../../Shared/Constants';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const addNewVendiblesLabels = {
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

  const [vendibles, setVendibles] = useState();

  const { role, token, id } = userInfo;

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const addVendibleLabel = addNewVendiblesLabels[role].label;
  const addVendibleLink = addNewVendiblesLabels[role].labelLink;

  const handleGetVendibles = async () => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
    });
    const newVendibles = await client.getVendibles(id);
    setVendibles(newVendibles);
  };

  useEffect(() => {
    handleGetVendibles();
  }, []);

  return !isEmpty(vendibles) ? (
    <ProveedorPage
      menuOptions={menuOptions}
      addVendibleSectionProps={{ addVendibleLabel, addVendibleLink }}
    />
  ) : null;
}

export default withRouter(ProveedorContainer);
