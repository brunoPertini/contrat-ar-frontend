import { Fragment, useCallback, useState } from 'react';
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
import { getUserInfoResponseShape, proveedorDTOShape } from '../../Shared/PropTypes/Vendibles';

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, filtersEnabled,
}) {
  const [contactText, setContactText] = useState();

  const getPriceLabel = useCallback((price) => {
    if (price === 0) {
      return sharedLabels.priceToBeAgreed;
    }
    if (vendibleType === systemConstants.PRODUCTS) {
      return `${sharedLabels.price}: ${price}`;
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

  // TODO: modularizar en el componente Header
  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const { vendibleNombre } = proveedoresInfo.vendibles[0];

  const messageText = clientLabels.sendWhatsappLink.replace('{vendible}', vendibleNombre)
    .replace('{contractArLink}', 'www.contractar.com')
    .replace('{additionalText}', contactText || ''); // TODO: reemplazar por dominio via deploy

  const firstColumnBreakpoint = filtersEnabled ? 2 : 'auto';

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} renderNavigationLinks />
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid item xs={firstColumnBreakpoint}>
          <Typography variant="h3">
            { vendibleNombre }
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <List sx={{ width: '100%' }}>
            {
              proveedoresInfo.vendibles.map((info) => {
                const { precio, proveedorId, imagenUrl } = info;

                const proveedorInfo = proveedoresInfo.proveedores
                  .find((proveedor) => proveedor.id === proveedorId);

                const {
                  name, surname, fotoPerfilUrl, distanceFrom, phone,
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
                        {!!distanceFrom && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {sharedLabels.to}
                            {' '}
                            {distanceFrom}
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
        </Grid>
      </Grid>
    </>
  );
}

VendiblePage.propTypes = {
  proveedoresInfo: PropTypes.arrayOf(PropTypes.shape(proveedorDTOShape)).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  filtersEnabled: PropTypes.bool.isRequired,
};

export default VendiblePage;
