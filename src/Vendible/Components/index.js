import {
  Fragment, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { routes, systemConstants, thirdPartyRoutes } from '../../Shared/Constants';
import { labels as clientLabels } from '../../StaticData/Cliente';
import { getUserInfoResponseShape, proveedorDTOShape, proveedorVendibleShape } from '../../Shared/PropTypes/Vendibles';
import VendiblesFilters from '../Filters';
import { Layout, StaticAlert } from '../../Shared/Components';
import { ARGENTINA_LOCALE } from '../../Shared/Constants/System';
import { getLocaleCurrencySymbol } from '../../Shared/Helpers/PricesHelper';
import GoBackLink from '../../Shared/Components/GoBackLink';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import { getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';

const vendiblesGridProps = {
  item: true,
  xs: 9,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignContent: 'center',
};

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, getVendibles, router, handleLogout,
}) {
  const [isLoadingVendibles, setIsLoadingVendibles] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState();

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [firstSearchDone, setFirstSearchDone] = useState(false);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const [buttonsEnabled, setButtonsEnabled] = useState({});

  const { setHandleGoBack, setParams } = useContext(NavigationContext);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const menuOptions = getUserMenuOptions([{ props: userInfo },
    { onClick: () => setIsExitAppModalOpen(true) }]);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  useEffect(() => {
    if (proveedoresInfo?.vendibles.length >= 2) {
      setFiltersEnabled(true);
    }

    setHandleGoBack(() => router.navigate);
    setParams([routes.ROLE_CLIENTE]);
  }, []);

  const { distancesForSlider, pricesForSlider, vendibleNombre } = useMemo(() => {
    let distances; let prices;

    // First render, slider is loaded with the min and max values
    if (!firstSearchDone) {
      distances = [proveedoresInfo.minDistance, proveedoresInfo.maxDistance];
      prices = [proveedoresInfo.minPrice, proveedoresInfo.maxPrice];
    } else if (!proveedoresInfo.vendibles.length) {
      distances = [];
      prices = [];
    } else {
      distances = [proveedoresInfo.vendibles[0].distance,
        proveedoresInfo.vendibles[proveedoresInfo.vendibles.length - 1].distance];

      prices = [proveedoresInfo.vendibles[0].precio,
        proveedoresInfo.vendibles[proveedoresInfo.vendibles.length - 1].precio];
    }
    const nombre = !proveedoresInfo.vendibles.length ? '' : proveedoresInfo.vendibles[0].vendibleNombre;

    return {
      distancesForSlider: distances,
      pricesForSlider: prices,
      vendibleNombre: nombre,
    };
  }, [proveedoresInfo]);

  const getPriceLabel = useCallback((price) => {
    if (price === 0) {
      return sharedLabels.priceToBeAgreed;
    }
    if (vendibleType === systemConstants.PRODUCTS) {
      return `${sharedLabels.price}: ${getLocaleCurrencySymbol(ARGENTINA_LOCALE)}${price}`;
    }

    return `${sharedLabels.minimalPrice}${price}`;
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

  const firstColumnBreakpoint = filtersEnabled ? 3 : 'auto';

  const distanceFiltersEnabled = proveedoresInfo.minDistance !== proveedoresInfo.maxDistance;

  const filtersSection = filtersEnabled ? (
    <Grid item xs={firstColumnBreakpoint}>
      <Typography variant="h3" sx={{ ml: '5%' }}>
        { vendibleNombre }
      </Typography>
      <VendiblesFilters
        enabledFilters={{ category: false, distance: distanceFiltersEnabled, price: true }}
        distances={distancesForSlider}
        prices={pricesForSlider}
        onFiltersApplied={handleOnFiltersApplied}
        distanceSliderAdditionalProps={{
          step: 0.5,
          min: proveedoresInfo.minDistance,
          max: proveedoresInfo.maxDistance,
        }}
        priceSliderAdditionalProps={{
          step: 10,
          min: proveedoresInfo.minPrice,
          max: proveedoresInfo.maxPrice,
        }}
      />
    </Grid>
  ) : null;

  return (
    <>
      { ExitAppDialog }
      <Header
        withMenuComponent
        menuOptions={menuOptions}
        userInfo={userInfo}
        renderNavigationLinks
      />
      <GoBackLink />
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
      >
        { filtersSection }
        <Layout gridProps={vendiblesGridProps} isLoading={isLoadingVendibles}>
          <List sx={{ width: '80%', alignSelf: 'flex-end' }}>
            {
                proveedoresInfo.vendibles.map((info) => {
                  const {
                    precio, proveedorId, imagenUrl, distance,
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
                      <ListItem
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={fullName}
                            src={fotoPerfilUrl}
                            sx={{
                              height: 100,
                              width: 100,
                            }}
                          />
                          <ListItemText primary={fullName} />
                          {!!distance && (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {sharedLabels.to}
                              {' '}
                              {distance}
                              {' '}
                              {sharedLabels.kilometersAway}
                              <PlaceIcon fontSize="medium" />
                            </Typography>
                            <Link href="#">
                              {vendiblesLabels.seeInMap}
                            </Link>
                          </>
                          )}
                        </ListItemAvatar>
                        <ImageListItem
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          {!!imagenUrl && (
                          <img
                            src={imagenUrl}
                            srcSet={imagenUrl}
                            alt={vendibleNombre}
                            loading="lazy"
                          />
                          )}
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                          }}
                          >
                            <Typography
                              paragraph
                              sx={{
                                wordBreak: 'break-word',
                              }}
                            >
                              {info.descripcion}
                            </Typography>
                          </Box>
                        </ImageListItem>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h5">
                            {getPriceLabel(precio)}
                          </Typography>
                          <Typography variant="h5" sx={{ mt: '50px' }}>
                            {clientLabels.contactProvider.replace('{nombreProveedor}', name)}
                          </Typography>
                          <TextareaAutosize
                            id={textAreaId}
                            minRows={15}
                            style={{ width: '100%' }}
                            onChange={handleEnableButton}
                          />
                          <Button
                            onClick={() => handleSendMessageClick(textAreaId, phone, name)}
                            target="_blank"
                            variant="contained"
                            sx={{ mt: '5px', alignSelf: 'flex-start' }}
                            disabled={!isSendMessageButtonEnabled}
                          >
                            { sharedLabels.sendMessage }
                          </Button>
                        </ListItem>
                      </ListItem>
                      <Divider variant="outlined" sx={{ borderColor: 'black' }} />

                    </Fragment>
                  );
                })
              }
          </List>
          {
            !isLoadingVendibles && noResultsFound && (
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
            )
          }
        </Layout>
      </Grid>
    </>
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
};

export default VendiblePage;
