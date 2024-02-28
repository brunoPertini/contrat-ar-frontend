import {
  Fragment, useCallback, useEffect, useMemo, useState,
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
import { systemConstants, thirdPartyRoutes } from '../../Shared/Constants';
import { labels as clientLabels } from '../../StaticData/Cliente';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import { getUserInfoResponseShape, proveedorDTOShape, proveedorVendibleShape } from '../../Shared/PropTypes/Vendibles';
import VendiblesFilters from '../Filters';
import { Layout, StaticAlert } from '../../Shared/Components';
import { ARGENTINA_LOCALE } from '../../Shared/Constants/System';
import { getLocaleCurrencySymbol } from '../../Shared/Helpers/PricesHelper';

const vendiblesGridProps = {
  item: true,
  xs: 9,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignContent: 'center',
};

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, getVendibles,
}) {
  const [contactText, setContactText] = useState();
  const [isLoadingVendibles, setIsLoadingVendibles] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState();

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [firstSearchDone, setFirstSearchDone] = useState(false);

  useEffect(() => {
    if (proveedoresInfo?.vendibles.length >= 2) {
      setFiltersEnabled(true);
    }
  }, []);

  const { distancesForSlider, vendibleNombre } = useMemo(() => {
    let distances;

    if (!firstSearchDone) {
      distances = [proveedoresInfo.minDistance, proveedoresInfo.maxDistance];
    } else if (!proveedoresInfo.vendibles.length) {
      distances = [];
    } else {
      distances = [proveedoresInfo.vendibles[0].distance,
        proveedoresInfo.vendibles[proveedoresInfo.vendibles.length - 1].distance];
    }
    const nombre = !proveedoresInfo.vendibles.length ? '' : proveedoresInfo.vendibles[0].vendibleNombre;

    return { distancesForSlider: distances, vendibleNombre: nombre };
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

  const handleSetContactText = useCallback(
    (event) => setContactText(event.target.value),
    [setContactText],
  );

  const handleSendMessageClick = () => {
    setTimeout(() => {
      setContactText('');
    }, 1000);
  };

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

  // TODO: modularizar en el componente Header
  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const messageText = clientLabels.sendWhatsappLink.replace('{vendible}', vendibleNombre)
    .replace('{contractArLink}', 'www.contractar.com')
    .replace('{additionalText}', contactText || ''); // TODO: reemplazar por dominio via deploy

  const firstColumnBreakpoint = filtersEnabled ? 3 : 'auto';

  const filtersSection = filtersEnabled ? (
    <Grid item xs={firstColumnBreakpoint}>
      <Typography variant="h3" sx={{ ml: '5%' }}>
        { vendibleNombre }
      </Typography>
      <VendiblesFilters
        enabledFilters={{ category: false, distance: true }}
        distances={distancesForSlider}
        onFiltersApplied={handleOnFiltersApplied}
        sliderAdditionalProps={{
          step: 0.5,
          min: proveedoresInfo.minDistance,
          max: proveedoresInfo.maxDistance,
        }}
      />
    </Grid>
  ) : null;

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} renderNavigationLinks />
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

                  const contactLink = `${thirdPartyRoutes.sendWhatsappMesageUrl}?phone=${phone}&text=${messageText.replace('{proveedor}', name)}`;

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
                            minRows={15}
                            style={{ width: '100%' }}
                            value={contactText}
                            onChange={handleSetContactText}
                          />
                          <Button
                            onClick={handleSendMessageClick}
                            href={contactLink}
                            target="_blank"
                            variant="contained"
                            sx={{ mt: '5px', alignSelf: 'flex-start' }}
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
  proveedoresInfo: PropTypes.shape({
    proveedores: PropTypes.arrayOf(PropTypes.shape(proveedorDTOShape)),
    vendibles: PropTypes.arrayOf(PropTypes.shape(proveedorVendibleShape)),
    minDistance: PropTypes.number,
    maxDistance: PropTypes.number,
  }).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
};

export default VendiblePage;
