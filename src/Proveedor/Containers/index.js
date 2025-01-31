import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { withRouter } from '../../Shared/Components';
import ProveedorPage from '../Components';
import { systemConstants } from '../../Shared/Constants';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import {
  PRODUCTS, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS,
  SERVICES,
} from '../../Shared/Constants/System';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import InformativeAlert from '../../Shared/Components/Alert';

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
  [systemConstants.ROLE_PROVEEDOR_SERVICIOS]: {
    label: proveedorLabels.addNewServiceLabel,
    labelLink: proveedorLabels.addNewServiceLinkLabel,
  },
};

const localStorageService = new LocalStorageService();

function ProveedorContainer({ router, handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [response, setResponse] = useState({ vendibles: [], categorias: {} });

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const [operationResult, setOperationResult] = useState(null);

  const { role, token, id } = userInfo;

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const menuOptionsConfig = {
    myProfile: {
      props: userInfo,
    },
    logout: {
      onClick: () => setIsExitAppModalOpen(true),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const addVendibleLabel = addNewVendiblesLabels[role]?.label;
  const addVendibleLink = addNewVendiblesLabels[role]?.labelLink;

  const vendibleType = useMemo(() => (role === ROLE_PROVEEDOR_PRODUCTOS
    ? PRODUCTS : SERVICES), [role]);

  useEffect(() => {
    if (userInfo.role && userInfo.role !== ROLE_PROVEEDOR_PRODUCTOS
      && userInfo.role !== ROLE_PROVEEDOR_SERVICIOS) {
      throw new Response('', { status: 404 });
    }

    const backButtonPresed = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED,
    );
    if (!backButtonPresed && role.startsWith(systemConstants.PROVEEDOR)) {
      localStorageService.removeAllKeysOfPage(systemConstants.PROVEEDOR);
    }
  }, []);

  const handleUploadImage = (file) => {
    const client = HttpClientFactory.createVendibleHttpClient(vendibleType, {
      token,
      handleLogout,
    });

    return client.uploadImage(file, id);
  };

  const handleGetVendibles = async (filters) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
      handleLogout,
    });
    client.getVendibles(id, filters).then((newResponse) => setResponse(newResponse));
  };

  const handlePostVendible = async (vendibleData) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
      handleLogout,
    });

    return client.postVendible({
      role,
      proveedorId: id,
      body: vendibleData,
    }).then((postVendibleResponse) => {
      handleGetVendibles();
      return postVendibleResponse;
    }).catch((error) => Promise.reject(error));
  };

  const handlePutVendible = async ({ proveedorId, vendibleId, body }) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
      handleLogout,
    });

    const isUpdatingState = 'state' in body;

    return client.putVendible({
      proveedorId, vendibleId, body,
    }).then((postVendibleResponse) => {
      if (isUpdatingState) {
        setOperationResult(true);
      }

      handleGetVendibles();
      return postVendibleResponse;
    }).catch((error) => {
      if (isUpdatingState) {
        setOperationResult(false);
      }
      return Promise.reject(error);
    });
  };

  const handleDeleteVendible = async ({ proveedorId, vendibleId }) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
      handleLogout,
    });

    return client.deleteVendible({ proveedorId, vendibleId }).then((postVendibleResponse) => {
      handleGetVendibles();
      return postVendibleResponse;
    }).catch((error) => Promise.reject(error));
  };

  useEffect(() => {
    handleGetVendibles();
  }, []);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  return (
    <NavigationContextProvider>
      <InformativeAlert
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={operationResult !== null}
        label={operationResult ? proveedorLabels['vendible.state.update.ok'] : proveedorLabels['vendible.state.update.failed']}
        severity={operationResult ? 'success' : 'error'}
        onClose={() => setOperationResult(null)}
      />
      { ExitAppDialog }
      <ProveedorPage
        vendibles={response.vendibles}
        categorias={response.categorias}
        menuOptions={menuOptions}
        addVendibleSectionProps={{ addVendibleLabel, addVendibleLink }}
        userInfo={userInfo}
        handleLogout={handleLogout}
        handleUploadImage={handleUploadImage}
        handlePostVendible={handlePostVendible}
        handlePutVendible={handlePutVendible}
        handleDeleteVendible={handleDeleteVendible}
        handleGetVendibles={handleGetVendibles}
        router={router}
      />
    </NavigationContextProvider>

  );
}

ProveedorContainer.propTypes = {
  router: PropTypes.shape(routerShape).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(ProveedorContainer);
