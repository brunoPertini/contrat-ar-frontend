import {
  Fragment, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import Pagination from '@mui/material/Pagination';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { routes, thirdPartyRoutes } from '../../Shared/Constants';
import { labels as clientLabels } from '../../StaticData/Cliente';
import { getUserInfoResponseShape, proveedorDTOShape, proveedorVendibleShape } from '../../Shared/PropTypes/Vendibles';
import VendiblesFilters from '../Filters';
import Layout from '../../Shared/Components/Layout';
import StaticAlert from '../../Shared/Components/StaticAlert';
import {
  ARGENTINA_LOCALE, PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT,
  SERVICES,
} from '../../Shared/Constants/System';
import { formatNumberWithLocale, getLocaleCurrencySymbol } from '../../Shared/Helpers/PricesHelper';
import GoBackLink from '../../Shared/Components/GoBackLink';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import { buildFooterOptions, getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import Footer from '../../Shared/Components/Footer';
import BasicMenu from '../../Shared/Components/Menu';
import ScrollUpIcon from '../../Shared/Components/ScrollUpIcon';
import { flexColumn } from '../../Shared/Constants/Styles';
import MapModal from '../../Shared/Components/MapModal';
import InformativeAlert from '../../Shared/Components/Alert';

/**
 * @typedef ProveedoresVendiblesFiltersType
 * @property {Number} category
 * @property {String} categoryName
 * @property {Array<Number>} toFilterDistances
 * @property{Array<number>} prices
 */

/** @type {ProveedoresVendiblesFiltersType } */
const proveedoresVendiblesFiltersModel = {
  category: null,
  categoryName: '',
  toFilterDistances: [],
  prices: [],
};

const footerOptions = buildFooterOptions(routes.servicioIndex);

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, getVendibles, router,
  handleLogout, paginationInfo, sendMessageToProveedor,
}) {
  const [firstSearchDone, setFirstSearchDone] = useState(false);
  const [mapModalProps, setMapModalProps] = useState({
    open: false,
    title: '',
    location: null,
    handleClose: () => setMapModalProps((previous) => ({
      ...previous,
      open: false,
      location: null,
      title: '',
    })),
  });

  const [contactResult, setContactResult] = useState(null);

  const { distancesForSlider, pricesForSlider, vendibleNombre } = useMemo(() => {
    let distances; let prices;

    // First render, slider is loaded with the min and max values
    if (!firstSearchDone) {
      distances = [proveedoresInfo.minDistance, proveedoresInfo.maxDistance];
      prices = [proveedoresInfo.minPrice, proveedoresInfo.maxPrice];
    } else if (!proveedoresInfo.vendibles.content.length) {
      distances = [];
      prices = [];
    } else {
      distances = [proveedoresInfo.vendibles.content[0].distance,
        proveedoresInfo.vendibles.content[proveedoresInfo.vendibles.content.length - 1].distance];

      prices = [proveedoresInfo.vendibles.content[0].precio,
        proveedoresInfo.vendibles.content[proveedoresInfo.vendibles.content.length - 1].precio];
    }
    const nombre = !proveedoresInfo.vendibles.content.length ? '' : proveedoresInfo.vendibles.content[0].vendibleNombre;

    return {
      distancesForSlider: distances,
      pricesForSlider: prices,
      vendibleNombre: nombre,
    };
  }, [proveedoresInfo]);

  const {
    paginationEnabled, pagesCount, canGoForward, canGoBack,
  } = useMemo(() => {
    if (!paginationInfo) {
      return {
        paginationEnabled: false,
        pagesCount: 0,
        canGoForward: false,
        canGoBack: false,
      };
    }
    return {
      paginationEnabled: paginationInfo.totalPages > 1,
      pagesCount: paginationInfo.totalPages,
      canGoForward: !paginationInfo.last,
      canGoBack: !paginationInfo.first,
    };
  }, [paginationInfo]);

  const { isPricesSliderEnabled, isDistancesSliderEnabled } = useMemo(() => ({
    isPricesSliderEnabled: proveedoresInfo.minPrice !== null && proveedoresInfo.maxPrice !== null,
    isDistancesSliderEnabled: proveedoresInfo.minDistance !== null
    && proveedoresInfo.maxDistance !== null,
  }), [proveedoresInfo]);

  const closeContactAlert = () => setContactResult(null);

  const alertConfig = useMemo(() => {
    if (contactResult === true) {
      return {
        open: true,
        onClose: closeContactAlert,
        severity: 'success',
        label: clientLabels['proveedorContact.success'],
      };
    }

    if (contactResult === false) {
      return {
        open: true,
        onClose: closeContactAlert,
        severity: 'error',
        label: clientLabels['proveedorContact.error'],
      };
    }
    return {
      open: false,
    };
  }, [contactResult]);

  const [isLoadingVendibles, setIsLoadingVendibles] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState();

  const [filtersEnabled, setFiltersEnabled] = useState(false);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const [buttonsEnabled, setButtonsEnabled] = useState({});

  const [filtersApplied, setFiltersApplied] = useState({
    ...proveedoresVendiblesFiltersModel,
    toFilterDistances: isDistancesSliderEnabled ? distancesForSlider : [],
    prices: pricesForSlider,
  });

  const { setHandleGoBack, setParams } = useContext(NavigationContext);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const onPageChange = (_, newPage) => {
    setFiltersApplied({
      ...proveedoresVendiblesFiltersModel,
      toFilterDistances: [],
      prices: [],
    });
    getVendibles(null, newPage - 1).then(() => setNoResultsFound(false));
  };

  const menuOptionsConfig = {
    myProfile: {
      props: userInfo,
    },
    logout: {
      onClick: () => setIsExitAppModalOpen(true),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  useEffect(() => {
    if (proveedoresInfo?.vendibles?.content.length >= 2) {
      setFiltersEnabled(true);
    }

    setHandleGoBack(() => router.navigate);
    setParams([routes.ROLE_CLIENTE]);
    setNoResultsFound(!(proveedoresInfo?.proveedores.length));
  }, []);

  useEffect(() => {
    document.title = vendibleNombre;
  }, [vendibleNombre]);

  const getPriceLabel = useCallback((price, tipoPrecio) => {
    const localeFormattedPrice = formatNumberWithLocale(price);

    const fullAmountLabel = `${getLocaleCurrencySymbol(ARGENTINA_LOCALE)}${localeFormattedPrice}`;

    const priceTypeVariableWithAmountRenderer = vendibleType === SERVICES.toLowerCase() ? sharedLabels.minimalPrice
      : sharedLabels.minimalPriceProducts;

    const renderers = {
      [PRICE_TYPE_VARIABLE]: () => sharedLabels.priceToBeAgreed,
      [PRICE_TYPE_FIXED]: () => `${sharedLabels.price}: ${fullAmountLabel}`,
      [PRICE_TYPE_VARIABLE_WITH_AMOUNT]: () => `${priceTypeVariableWithAmountRenderer}: ${fullAmountLabel}`,
    };

    return renderers[tipoPrecio]();
  }, [vendibleType]);

  const handleEnableButton = useCallback(
    (event) => {
      setButtonsEnabled((previous) => ({ ...previous, [event.target.id]: !!(event.target.value) }));
    },
    [setButtonsEnabled],
  );

  const handleSendMessageClick = useCallback((
    textAreaId,
    phone,
    proveedorName,
    proveedorEmail,
    proveedorHasWhatsapp,
  ) => {
    const message = document.querySelector(`#${textAreaId}`).value;
    setIsLoadingVendibles(true);

    setTimeout(() => {
      if (proveedorHasWhatsapp) {
        const messageTemplate = clientLabels.sendWhatsappLink.replace('{vendible}', vendibleNombre)
          .replace('{contractArLink}', process.env.REACT_APP_SITE_URL)
          .replace('{additionalText}', message);

        const contactLink = `${thirdPartyRoutes.sendWhatsappMesageUrl}?phone=${phone}
          &text=${messageTemplate.replace('{proveedor}', proveedorName)}`;

        window.open(contactLink, '_blank');
      }

      sendMessageToProveedor(proveedorEmail, vendibleNombre, message)
        .then(() => setContactResult(true))
        .catch(() => setContactResult(false))
        .finally(async () => {
          setIsLoadingVendibles(false);
        });

      setButtonsEnabled((previous) => ({ ...previous, [textAreaId]: false }));
    }, [2000]);
  }, [setButtonsEnabled]);

  const handleOpenMap = useCallback((proveedor) => {
    setMapModalProps((previous) => ({
      ...previous,
      open: true,
      title: `Ubicación de ${proveedor.name} ${proveedor.surname}`,
      location: proveedor.location,
    }));
  }, [setMapModalProps]);

  const handleOnFiltersApplied = (filters) => {
    setFirstSearchDone(true);
    setIsLoadingVendibles(true);
    setTimeout(() => {
      getVendibles(filters).then((thereAreResults) => {
        setNoResultsFound(!thereAreResults);
      })
        .catch(() => setNoResultsFound(true))
        .finally(() => setIsLoadingVendibles(false));
    }, 1000);
  };

  const shouldChangeLayout = useMediaQuery('(max-width:1024px)');

  const isNearMobileSize = useMediaQuery('(max-width:800px)');

  const showImagesAsRow = useMediaQuery('(min-width:500px) and (max-width:1024px)');

  const filtersResolvedWidth = { xs: '100%', lg: '60%' };

  const filtersProps = {
    filtersApplied,
    setFiltersApplied,
    enabledFilters: {
      category: false,
      distance: isDistancesSliderEnabled,
      price: isPricesSliderEnabled,
    },
    distances: distancesForSlider,
    prices: pricesForSlider,
    onFiltersApplied: handleOnFiltersApplied,
    distanceSliderAdditionalProps: {
      step: 0.01,
      min: proveedoresInfo.minDistance,
      max: proveedoresInfo.maxDistance,
    },
    priceSliderAdditionalProps: {
      step: 10,
      min: proveedoresInfo.minPrice,
      max: proveedoresInfo.maxPrice,
    },
    containerStyles: {
      width: filtersResolvedWidth,
    },
    sliderContainerStyles: shouldChangeLayout ? {
      position: 'sticky',
      top: '175px',
      'z-index': 1100,
    } : undefined,
  };

  const ResolvedFiltersSection = useCallback(() => {
    if (!filtersEnabled) {
      return null;
    }
    return !shouldChangeLayout ? (
      <VendiblesFilters {...filtersProps} />
    ) : (
      <BasicMenu
        showButtonIcon
        options={[{
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
    );
  }, [shouldChangeLayout, filtersProps, filtersEnabled]);

  return (
    <Box
      flex={{ xs: 1, md: 9, lg: 10 }}
      {...flexColumn}
      width="100%"
      height="100vh"
      minHeight="100vh"
    >
      {ExitAppDialog}
      <Header
        withMenuComponent
        menuOptions={menuOptions}
        userInfo={userInfo}
        renderNavigationLinks
      />
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        flex={1}
        gap="5%"
      >
        <InformativeAlert
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          {...alertConfig}
        />
        <MapModal {...mapModalProps} />
        <Box
          display="flex"
          flexDirection="column"
        >
          <GoBackLink styles={{ pl: '2%' }} />
          <ResolvedFiltersSection />
        </Box>

        <Layout
          isLoading={isLoadingVendibles}
          gridProps={{
            sx: {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            },
          }}
        >
          <List>
            {proveedoresInfo.vendibles.content.map((info) => {
              const {
                precio, proveedorId, imagenUrl, distance, tipoPrecio, descripcion,
              } = info;

              const proveedorInfo = proveedoresInfo.proveedores
                .find((proveedor) => proveedor.id === proveedorId);

              const {
                name, surname, fotoPerfilUrl, phone,
              } = proveedorInfo;

              const fullName = `${name} ${surname}`;
              const textAreaId = `contact_proveedor_${proveedorId}`;
              const isSendMessageButtonEnabled = buttonsEnabled[textAreaId];

              return (
                <Fragment key={`${vendibleNombre}_${fullName}`}>
                  <Box
                    display="flex"
                    flexDirection={shouldChangeLayout ? 'column' : 'row'}
                    gap={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      mb: 3,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection={showImagesAsRow ? 'row' : 'column'}
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Avatar
                        alt={fullName}
                        src={fotoPerfilUrl}
                        sx={{
                          height: 80,
                          width: 80,
                          border: '2px solid',
                          borderColor: 'primary.main',
                        }}
                      />
                      <Box {...flexColumn}>
                        <Typography variant="h6" fontWeight="bold">
                          {fullName}
                        </Typography>
                        {!!distance && (
                        <Typography variant="body2" color="text.secondary">
                          {`${sharedLabels.to} ${distance} ${sharedLabels.kilometersAway}`}
                          <PlaceIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                        </Typography>
                        )}
                        {!!distance && (
                        <Link
                          onClick={() => handleOpenMap(proveedorInfo)}
                          sx={{
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                          }}
                        >
                          {vendiblesLabels.seeInMap}
                        </Link>
                        )}
                      </Box>
                      <Box>
                        {!!imagenUrl && (
                        <Box
                          component="img"
                          src={imagenUrl}
                          alt={vendibleNombre}
                          loading="lazy"
                          sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: 1,
                            maxHeight: '300px',
                            objectFit: 'cover',
                          }}
                        />
                        )}
                        <Typography
                          paragraph
                          sx={{
                            maxWidth: '500px',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {descripcion}
                        </Typography>
                      </Box>

                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="stretch"
                      width={!isNearMobileSize ? '50%' : '100%'}
                      gap={2}
                    >
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {getPriceLabel(precio, tipoPrecio)}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {clientLabels.contactProvider.replace('{nombreProveedor}', name)}
                      </Typography>
                      <TextareaAutosize
                        id={textAreaId}
                        minRows={15}
                        placeholder={sharedLabels.sendMessage}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          resize: 'none',
                        }}
                        onChange={handleEnableButton}
                      />
                      <Button
                        onClick={() => handleSendMessageClick(
                          textAreaId,
                          phone,
                          name,
                          proveedorInfo.email,
                          proveedorInfo.hasWhatsapp,
                        )}
                        target="_blank"
                        variant="contained"
                        color="secondary"
                        disabled={!isSendMessageButtonEnabled}
                        sx={{
                          mt: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          backgroundColor: 'rgb(36, 134, 164)',
                          '&:hover': {
                            backgroundColor: 'rgb(36, 134, 164)',
                          },
                        }}
                      >
                        {sharedLabels.sendMessage}
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'grey.300', my: 2 }} />
                </Fragment>
              );
            })}
          </List>

          {paginationEnabled && (
          <Pagination
            variant="outlined"
            page={paginationInfo.pageable.pageNumber + 1}
            count={pagesCount}
            hideNextButton={!canGoForward}
            hidePrevButton={!canGoBack}
            onChange={onPageChange}
            sx={{
              mt: 2,
              justifyItems: 'center',
              '& .Mui-selected': {
                fontWeight: 900,
                backgroundColor: 'rgb(36, 134, 164)!important',
              },
            }}
          />
          )}

          {!isLoadingVendibles && noResultsFound && (
          <StaticAlert
            label={vendiblesLabels.noResultsFound}
            styles={{
              backgroundColor: 'rgb(36, 134, 164)',
              mt: '2%',
              fontSize: 'h4.fontSize',
              '.MuiAlert-icon': {
                fontSize: '50px;',
              },
            }}
          />
          )}
        </Layout>
      </Box>
      <ScrollUpIcon />
      <Footer options={footerOptions} />
    </Box>
  );
}

VendiblePage.propTypes = {
  sendMessageToProveedor: PropTypes.func.isRequired,
  getVendibles: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  proveedoresInfo: PropTypes.shape({
    proveedores: PropTypes.arrayOf(PropTypes.shape(proveedorDTOShape)),
    vendibles: PropTypes.arrayOf(PropTypes.shape(proveedorVendibleShape)),
    minDistance: PropTypes.number,
    maxDistance: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
  }).isRequired,
  router: PropTypes.shape(routerShape).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  paginationInfo: PropTypes.any.isRequired,
};

export default VendiblePage;
