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
} from '../../Shared/Constants/System';
import { formatNumberWithLocale, getLocaleCurrencySymbol } from '../../Shared/Helpers/PricesHelper';
import GoBackLink from '../../Shared/Components/GoBackLink';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import { getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import Footer from '../../Shared/Components/Footer';
import { indexLabels } from '../../StaticData/Index';
import BasicMenu from '../../Shared/Components/Menu';
import ScrollUpIcon from '../../Shared/Components/ScrollUpIcon';

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

const footerOptions = [
  { label: indexLabels.helpAndQuestions, onClick: () => {} },
  { label: indexLabels.termsAndConditions, onClick: () => {} },
];

function splitVendibleDescription(description) {
  const canSplitByDot = description.includes('.');

  return `${(canSplitByDot ? description.split('.')
    : description.split(' '))[0]}...`;
}

const DESCRIPTION_MAX_LENGTH = 200;

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, getVendibles, router,
  handleLogout, paginationInfo,
}) {
  const [firstSearchDone, setFirstSearchDone] = useState(false);

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
    setFiltersApplied({ ...proveedoresVendiblesFiltersModel });
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
  }, []);

  useEffect(() => {
    document.title = vendibleNombre;
  }, [vendibleNombre]);

  const getPriceLabel = useCallback((price, tipoPrecio) => {
    const localeFormattedPrice = formatNumberWithLocale(price);

    const fullAmountLabel = `${getLocaleCurrencySymbol(ARGENTINA_LOCALE)}${localeFormattedPrice}`;

    const renderers = {
      [PRICE_TYPE_VARIABLE]: () => sharedLabels.priceToBeAgreed,
      [PRICE_TYPE_FIXED]: () => `${sharedLabels.price}: ${fullAmountLabel}`,
      [PRICE_TYPE_VARIABLE_WITH_AMOUNT]: () => `${sharedLabels.minimalPrice}: ${fullAmountLabel}`,
    };

    return renderers[tipoPrecio]();
  }, [vendibleType]);

  const handleEnableButton = useCallback(
    (event) => {
      setButtonsEnabled((previous) => ({ ...previous, [event.target.id]: !!(event.target.value) }));
    },
    [setButtonsEnabled],
  );

  const handleSendMessageClick = useCallback((textAreaId, phone, proveedorName) => {
    const message = document.querySelector(`#${textAreaId}`).value;
    const messageTemplate = clientLabels.sendWhatsappLink.replace('{vendible}', vendibleNombre)
      .replace('{contractArLink}', 'www.contractar.com')
      .replace('{additionalText}', message); // TODO: reemplazar por dominio via deploy

    const contactLink = `${thirdPartyRoutes.sendWhatsappMesageUrl}?phone=${phone}
        &text=${messageTemplate.replace('{proveedor}', proveedorName)}`;

    document.querySelector(`#${textAreaId}`).value = '';
    setButtonsEnabled((previous) => ({ ...previous, [textAreaId]: false }));
    window.open(contactLink, '_blank');
  }, [setButtonsEnabled]);

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

  const isNearMobileSize = useMediaQuery('(max-width:565px)');

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
  }, [shouldChangeLayout, filtersEnabled]);

  return (
    <Box
      flex={{ xs: 1, md: 9, lg: 10 }}
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
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
        <Box
          display="flex"
          flexDirection="column"
        >
          <GoBackLink />
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
                precio, proveedorId, imagenUrl, distance = 0.1, tipoPrecio, descripcion,
              } = info;

              const proveedorInfo = proveedoresInfo.proveedores
                .find((proveedor) => proveedor.id === proveedorId);

              const {
                name, surname, fotoPerfilUrl, phone,
              } = proveedorInfo;

              const fullName = `${name} ${surname}`;
              const textAreaId = `contact_proveedor_${proveedorId}`;
              const isSendMessageButtonEnabled = buttonsEnabled[textAreaId];

              const descriptionExceedsLimit = descripcion.length > DESCRIPTION_MAX_LENGTH;

              const parsedDescripcion = descriptionExceedsLimit
                ? splitVendibleDescription(descripcion)
                : descripcion;

              return (
                <Fragment key={`${vendibleNombre}_${fullName}`}>
                  <Box
                    display="flex"
                    alignItems={{ xs: 'center', md: '"flex-start"' }}
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
                      flexDirection="column"
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
                      <Box>
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
                        <Link href="#" sx={{ fontSize: '0.875rem' }}>
                          {vendiblesLabels.seeInMap}
                        </Link>
                        )}
                      </Box>
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
                          wordBreak: 'break-word',
                          fontSize: '1rem',
                          color: 'text.primary',
                        }}
                      >
                        {parsedDescripcion}
                      </Typography>
                      {!!descriptionExceedsLimit && (
                        <Link href="#" sx={{ fontSize: '0.875rem' }}>
                          {sharedLabels.seeMore}
                        </Link>
                      )}
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
                        onClick={() => handleSendMessageClick(textAreaId, phone, name)}
                        target="_blank"
                        variant="contained"
                        color="secondary"
                        disabled={!isSendMessageButtonEnabled}
                        sx={{
                          mt: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          backgroundColor: 'rgb(36, 134, 164)',
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
              '& .Mui-selected': {
                fontWeight: 900,
                bgcolor: 'primary.light',
              },
            }}
          />
          )}

          {!isLoadingVendibles && noResultsFound && (
          <StaticAlert
            label={vendiblesLabels.noResultsFound}
            styles={{
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
