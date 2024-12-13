import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import Header from '../../Header';
import { DialogModal, SearcherInput, Tooltip } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendiblesList from '../VendiblesList';
import VendiblesFilters from '../../Vendible/Filters';
import {
  PRODUCT,
  PRODUCTS,
  ROLE_PROVEEDOR_PRODUCTOS,
  SERVICE,
  SERVICES,
  dialogModalTexts,
} from '../../Shared/Constants/System';
import { sharedLabels } from '../../StaticData/Shared';
import { menuOptionsShape } from '../../Shared/PropTypes/Header';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import { buildVendibleInfo } from '../../Shared/Helpers/ProveedorHelper';
import VendibleCreateForm from '../CreateVendible';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { routerShape } from '../../Shared/PropTypes/Shared';
import InformativeAlert from '../../Shared/Components/Alert';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';
import GoBackLink from '../../Shared/Components/GoBackLink';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import VendibleInfo from '../../Shared/Components/VendibleInfo';
import ModifyVendibleForm from '../ModifyVendible';
import { parseVendibleUnit, waitAndCleanUserTokenCookie } from '../../Shared/Helpers/UtilsHelper';
import ScrollUpIcon from '../../Shared/Components/ScrollUpIcon';
import Footer from '../../Shared/Components/Footer';
import { indexLabels } from '../../StaticData/Index';
import BasicMenu from '../../Shared/Components/Menu';

const localStorageService = new LocalStorageService();

const optionsMenuHandlers = ({
  vendibleInfo, onCloseInnerComponent, userId, handlePutVendible,
  option, vendibleType, userToken, onChangeCurrentInnerScreen, handleDeleteVendible,
  setModifyVendibleProps, handleUploadImage, showSaveChangesAlertModal,
}) => {
  const handlers = {
    [sharedLabels.seeDetail]: () => (
      <Modal
        disableEnforceFocus
        open
        onClose={onCloseInnerComponent}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        <VendibleInfo
          vendibleType={vendibleType}
          vendibleInfo={buildVendibleInfo(vendibleInfo, vendibleType)}
          cardStyles={{
            display: 'flex',
            flexDirection: 'column',
            width: '85%',
            overflow: 'scroll',
          }}
          userToken={userToken}
        />
      </Modal>
    ),
    [sharedLabels.modify]: () => {
      onChangeCurrentInnerScreen({ newScreen: 'modifyVendible' });
      setModifyVendibleProps({
        proveedorId: userId,
        userToken,
        vendibleInfo,
        vendibleType,
        handleUploadImage,
        showSaveChangesAlertModal,
        handlePutVendible,
      });

      return null;
    },
    [sharedLabels.delete]: () => {
      handleDeleteVendible({
        proveedorId: userId,
        vendibleId: vendibleInfo.vendibleId,
        vendibleNombre: vendibleInfo.vendibleNombre,
      });
      return null;
    },
  };

  return handlers[option]();
};

const operationsMessages = {
  modify: {
    ok: (vendibleType) => proveedorLabels['modifyVendible.alert.success'].replace('{vendible}', vendibleType),
    error: (vendibleType) => proveedorLabels['modifyVendible.alert.error'].replace('{vendible}', vendibleType),
  },
  add: {
    ok: (vendibleType) => proveedorLabels['addVendible.alert.success'].replace('{vendible}', vendibleType),
    error: (vendibleType) => proveedorLabels['addVendible.alert.error'].replace('{vendible}', vendibleType),
  },
  delete: {
    ok: (vendibleType) => proveedorLabels['deleteVendible.alert.success'].replace('{vendible}', vendibleType),
    error: (vendibleType) => proveedorLabels['deleteVendible.alert.error'].replace('{vendible}', vendibleType),
  },
};

const filtersDefaultValues = {
  category: null,
  categoryName: '',
  vendibleNombre: '',
  state: '',
};

function ProveedorPage({
  menuOptions,
  addVendibleSectionProps: {
    addVendibleLabel,
    addVendibleLink,
  },
  vendibles,
  categorias,
  userInfo,
  handleLogout,
  handleUploadImage,
  handlePostVendible,
  handlePutVendible,
  handleDeleteVendible,
  handleGetVendibles,
  router,
}) {
  const { vendibleType, labelVendibleType } = useMemo(() => ({
    vendibleType: userInfo.role === ROLE_PROVEEDOR_PRODUCTOS ? PRODUCTS : SERVICES,
    labelVendibleType: (userInfo.role === ROLE_PROVEEDOR_PRODUCTOS
      ? PRODUCT
      : SERVICE).toLowerCase(),
  }), [userInfo.role]);

  const [filteredVendibles, setFilteredVendibles] = useState();

  const [filtersApplied, setFiltersApplied] = useState(filtersDefaultValues);

  const [currentInnerScreen, setCurrentInnerScreen] = useState();

  const [modalContent, setModalContent] = useState({ title: '', text: '', handleAccept: () => {} });

  const [crudOperationResult, setCrudOperationResult] = useState({
    add: null,
    modify: null,
    delete: null,
  });

  const [vendibleOperationsComponent, setVendibleOperationsComponent] = useState(null);

  const [modifyVendibleProps, setModifyVendibleProps] = useState({});

  const categoriesFiltersEnabled = useMemo(() => !isEmpty(categorias), [categorias]);

  const { setHandleGoBack } = useContext(NavigationContext);

  const isGoingBack = localStorageService.getItem(
    LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED,
  );

  const cleanOperationsComponents = () => {
    setVendibleOperationsComponent(null);
  };

  const onCleanModalContent = () => {
    setModalContent({ title: '', text: '', handleAccept: () => {} });
  };

  const onCancelLeavingPage = () => {
    onCleanModalContent();
    localStorageService.removeItem(LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED);
  };

  const onChangeCurrentScreen = ({ newScreen } = {}) => {
    setCurrentInnerScreen(newScreen);
  };

  const showExitAppAlertModal = useCallback(() => {
    setModalContent({
      title: dialogModalTexts.EXIT_APP.title,
      text: dialogModalTexts.EXIT_APP.text,
      handleAccept: handleLogout,
    });
  }, [setModalContent]);

  const showSaveChangesAlertModal = useCallback(() => {
    setModalContent({
      title: dialogModalTexts.SAVE_CHANGES.title,
      text: dialogModalTexts.SAVE_CHANGES.text,
      handleAccept: () => {
        onCleanModalContent();
        setCurrentInnerScreen();
      },
    });
  }, [setModalContent]);

  useEffect(() => {
    const storedScreen = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN,
    );
    if (storedScreen) {
      setCurrentInnerScreen(storedScreen);
    }

    setHandleGoBack(() => showExitAppAlertModal);
  }, []);

  useEffect(() => {
    if (isGoingBack && currentInnerScreen) {
      setModalContent({
        title: dialogModalTexts.SAVE_CHANGES.title,
        text: dialogModalTexts.SAVE_CHANGES.text,
      });
    }

    if (isGoingBack && !currentInnerScreen) {
      setModalContent({
        title: dialogModalTexts.EXIT_APP.title,
        text: dialogModalTexts.EXIT_APP.text,
        handleAccept: handleLogout,
      });
    }

    setFiltersApplied(filtersDefaultValues);
  }, [isGoingBack, currentInnerScreen]);

  useEffect(() => {
    setFilteredVendibles([...vendibles]);
  }, [vendibles]);

  useEffect(() => {
    if (currentInnerScreen) {
      localStorageService.setItem(
        LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN,
        currentInnerScreen,
      );

      setHandleGoBack(() => onChangeCurrentScreen);
    } else {
      setHandleGoBack(() => showExitAppAlertModal);
    }
  }, [currentInnerScreen]);

  const handleSetSearchValue = (value) => {
    setFiltersApplied((previous) => ({ ...previous, vendibleNombre: value }));
  };

  const { openSnackbar, alertSeverity, alertLabel } = useMemo(() => {
    let alertForLabel = null;
    let severityForAlert;

    const operationMade = crudOperationResult && Object.keys(crudOperationResult).find(
      (key) => crudOperationResult[key] === true
    || crudOperationResult[key] === false,
    );

    if (operationMade) {
      if (crudOperationResult[operationMade]) {
        alertForLabel = operationsMessages[operationMade].ok(labelVendibleType);
        severityForAlert = 'success';
      } else {
        alertForLabel = operationsMessages[operationMade].error(labelVendibleType);
        severityForAlert = 'error';
      }
    }

    return ({
      openSnackbar: operationMade !== undefined && !!(alertForLabel),
      alertSeverity: severityForAlert,
      alertLabel: alertForLabel,
    });
  }, [crudOperationResult]);

  const shouldChangeLayout = useMediaQuery('(max-width:1200px)');

  const handleStartSearch = () => {
    setFiltersApplied((current) => {
      handleGetVendibles(current);
      return current;
    });
  };

  const handlePostServiceCall = () => {
    localStorageService.removeItem(LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN);
    setCurrentInnerScreen(undefined);
  };

  const managePostVendibleResults = useCallback((body) => handlePostVendible(body)
    .then((response) => {
      setCrudOperationResult({ add: true });
      return response;
    })
    .catch((error) => {
      setCrudOperationResult({ add: false });
      return error;
    })
    .finally(() => {
      handlePostServiceCall();
    }), [setCrudOperationResult]);

  const managePutVendibleResults = useCallback(({
    proveedorId,
    vendibleId,
    body,
  }) => handlePutVendible({
    proveedorId,
    vendibleId,
    body,
  }).then((response) => {
    setCrudOperationResult({ modify: true });
    return response;
  })
    .catch((error) => {
      setCrudOperationResult({ modify: false });
      return error;
    })
    .finally(() => {
      handlePostServiceCall();
      setFiltersApplied((previous) => ({ ...previous, ...filtersDefaultValues }));
    }), [setCrudOperationResult]);

  const handleDeleteVendibleResults = useCallback(({
    proveedorId,
    vendibleId,
  }) => handleDeleteVendible({
    proveedorId,
    vendibleId,
  })
    .then((response) => {
      setCrudOperationResult({ delete: true });
      return response;
    })
    .catch((error) => {
      setCrudOperationResult({ delete: false });
      return error;
    })
    .finally(() => {
      handlePostServiceCall();
      onCleanModalContent();
    }), [setCrudOperationResult]);

  const showDeleteConfirmationModal = useCallback(({ proveedorId, vendibleId, vendibleNombre }) => {
    const onAccept = () => handleDeleteVendibleResults({ proveedorId, vendibleId });
    const vendibleUnit = parseVendibleUnit(vendibleType);
    setModalContent({
      title: dialogModalTexts.DELETE_VENDIBLE.title.replace('{vendible}', vendibleUnit).replace(
        '{vendibleNombre}',
        vendibleNombre,
      ),
      text: dialogModalTexts.DELETE_VENDIBLE.text,
      handleAccept: onAccept,
    });
  }, [setModalContent]);

  const isNearMobileLittleSize = useMediaQuery('(max-width:450px)');

  let filtersResolvedWidth;

  if (isNearMobileLittleSize) {
    filtersResolvedWidth = '80%';
  } else if (shouldChangeLayout) {
    filtersResolvedWidth = '60%';
  } else {
    filtersResolvedWidth = '45%';
  }

  const filtersProps = {
    categories: categorias,
    vendibleType,
    filtersApplied,
    setFiltersApplied,
    showAccordionTitle: true,
    onFiltersApplied: handleStartSearch,
    containerStyles: {
      mt: '5%',
    },
    enabledFilters: {
      category: categoriesFiltersEnabled,
      state: true,
    },
  };

  const searcherProps = {
    titleConfig: {
      variant: 'h3',
    },
    searcherConfig: {
      sx: {
        mt: '5%',
        paddingLeft: '10px',
      },
    },
    onSearchClick: handleStartSearch,
    keyEvents: {
      onKeyUp: handleSetSearchValue,
      onEnterPressed: handleStartSearch,
    },
    placeholder: proveedorLabels.filterByName,
    inputValue: filtersApplied.vendibleNombre,
    inputStyles: {
      '& .MuiInputBase-input::placeholder': {
        color: 'rgb(36, 134, 164)',
        opacity: 1,
      },
    },
  };

  const innerScreens = {
    addNewVendible: {
      component: VendibleCreateForm,
      props: {
        userInfo,
        vendibleType,
        handleUploadImage,
        handlePostVendible: managePostVendibleResults,
        router,
      },
    },
    modifyVendible: {
      component: ModifyVendibleForm,
      props: modifyVendibleProps,
    },
  };

  let mainContent;

  // eslint-disable-next-line no-unused-vars
  const handleOnOptionClicked = (option, vendibleInfo) => {
    if (option) {
      const OperationsComponent = optionsMenuHandlers({
        handlePutVendible: managePutVendibleResults,
        handleUploadImage,
        vendibleInfo: vendibles[0],
        option,
        vendibleType: 'servicios',
        userToken: userInfo.token,
        userId: userInfo.id,
        onCloseInnerComponent: cleanOperationsComponents,
        onChangeCurrentInnerScreen: onChangeCurrentScreen,
        setModifyVendibleProps,
        showSaveChangesAlertModal,
        handleDeleteVendible: showDeleteConfirmationModal,

      });
      setVendibleOperationsComponent(OperationsComponent);
    }
  };

  const resetFiltersApplied = () => setFiltersApplied(filtersDefaultValues);

  if (currentInnerScreen) {
    const InnerComponent = innerScreens[currentInnerScreen].component;
    const innerProps = innerScreens[currentInnerScreen].props;

    // TODO: mainContent esta de mas
    mainContent = <InnerComponent {...innerProps} />;
  }

  useOnLeavingTabHandler(waitAndCleanUserTokenCookie);

  const footerOptions = [
    { label: indexLabels.helpAndQuestions, onClick: () => {} },
    { label: indexLabels.termsAndConditions, onClick: () => {} },
    { label: indexLabels.contactUs, onClick: () => {} },
  ];

  const addVendibleLinkLayout = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignSelf: shouldChangeLayout ? 'flex-start' : 'flex-end',
    }}
    >
      <Typography variant="h6">
        {addVendibleLabel}
      </Typography>
      <Link
        sx={{ mt: '10px', cursor: 'pointer' }}
        onClick={() => onChangeCurrentScreen({ newScreen: 'addNewVendible' })}
      >
        {addVendibleLink}
      </Link>
    </Box>
  );

  const ResolvedFiltersSection = useCallback(() => (!shouldChangeLayout ? (
    <Box sx={{
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'rgb(36, 134, 164)',
    }}
    >
      <SearcherInput {...searcherProps} />
      <VendiblesFilters stateContainerStyles={{ paddingBottom: '10px', paddingLeft: '10px' }} {...filtersProps} />
    </Box>

  ) : (
    <BasicMenu
      showButtonIcon
      options={[
        {
          component: SearcherInput,
          props: searcherProps,
        },
        {
          component: VendiblesFilters,
          props: filtersProps,
        }]}
      slotProps={{
        paper: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: filtersResolvedWidth,
            maxHeight: 500,
          },
        },
      }}
    />
  )), [shouldChangeLayout]);

  const FirstColumn = useCallback(() => (!shouldChangeLayout ? (
    <>
      <GoBackLink />
      <ResolvedFiltersSection />
    </>
  ) : (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      gap={10}
    >
      <Box display="flex" flexDirection="column">
        <GoBackLink />
        <ResolvedFiltersSection />
      </Box>
      { addVendibleLinkLayout }
    </Box>
  )), [shouldChangeLayout]);

  const secondColumn = (
    <>
      {
        !shouldChangeLayout ? addVendibleLinkLayout : null
      }
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Typography variant="h4">
            {proveedorLabels.yourPosts}
          </Typography>
          <Tooltip
            placement="right-start"
            title={(
              <Typography variant="h6">
                {proveedorLabels.tooltipLabel}
              </Typography>
          )}
          >
            <HelpOutline />
          </Tooltip>
        </Box>
        <VendiblesList
          proveedorId={userInfo.id}
          vendibles={filteredVendibles}
          vendibleType={vendibleType}
          userToken={userInfo.token}
          handleOnOptionClicked={handleOnOptionClicked}
          handlePutVendible={handlePutVendible}
          resetFiltersApplied={resetFiltersApplied}
        />
      </Box>

    </>
  );
  const ResponsiveLayout = useCallback(() => {
    if (!shouldChangeLayout) {
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', lg: 'row' }}
          flex={1}
          gap={5}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="30%"
            sx={{ paddingLeft: '1%' }}
          >
            <FirstColumn />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            width={!shouldChangeLayout ? '60%' : '100%'}
            sx={{ paddingRight: '1%' }}
            flex={1}
          >
            { secondColumn }
          </Box>
        </Box>
      );
    }

    return (

      <Box
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <FirstColumn />
        {secondColumn}
      </Box>
    );
  }, [shouldChangeLayout, secondColumn]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      minHeight="100vh"
    >
      <Header
        withMenuComponent
        renderNavigationLinks
        menuOptions={menuOptions}
        userInfo={userInfo}
      />
      {!mainContent ? <ResponsiveLayout /> : mainContent}
      { vendibleOperationsComponent }
      <InformativeAlert
        open={openSnackbar}
        onClose={() => setCrudOperationResult(undefined)}
        label={alertLabel}
        severity={alertSeverity}
      />
      <DialogModal
        title={modalContent.title}
        contextText={modalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={!!(modalContent?.title && modalContent.text)}
        handleAccept={modalContent.handleAccept}
        handleDeny={onCancelLeavingPage}
      />
      {!mainContent && <ScrollUpIcon />}
      <Footer options={footerOptions} />
    </Box>
  );
}

ProveedorPage.propTypes = {
  menuOptions: PropTypes.arrayOf(PropTypes.shape(menuOptionsShape)).isRequired,
  addVendibleSectionProps: PropTypes.shape({
    addVendibleLabel: PropTypes.string,
    addVendibleLink: PropTypes.string,
  }).isRequired,
  vendibles: proveedoresVendiblesShape.isRequired,
  categorias: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)).isRequired,
  userInfo: PropTypes.any.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleUploadImage: PropTypes.func.isRequired,
  handlePostVendible: PropTypes.func.isRequired,
  handlePutVendible: PropTypes.func.isRequired,
  handleDeleteVendible: PropTypes.func.isRequired,
  handleGetVendibles: PropTypes.func.isRequired,
  router: PropTypes.shape(routerShape).isRequired,
};

export default ProveedorPage;
