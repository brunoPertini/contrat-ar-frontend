/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
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
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { Box } from '@mui/material';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { systemConstants } from '../../Shared/Constants';
import { labels as clientLabels } from '../../StaticData/Cliente';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';

function VendiblePage({
  proveedoresInfo, vendibleType, userInfo, filtersEnabled,
}) {
  const getPriceLabel = useCallback((price) => {
    if (vendibleType === systemConstants.PRODUCTS) {
      return price === 0 ? sharedLabels.priceToBeAgreed : `${sharedLabels.price}${price}`;
    }

    return price === 0 ? sharedLabels.priceToBeAgreed : `${sharedLabels.minimalPrice}${price}`;
  }, [vendibleType]);

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

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
            { proveedoresInfo[0].vendibleNombre}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <List sx={{ width: '100%' }}>
            {
              proveedoresInfo.map((info) => {
                const {
                  name, surname, fotoPerfilUrl, distanceFrom,
                } = info.proveedorInfo;

                const { precio } = info;

                const fullName = `${name} ${surname}`;

                return (
                  <>
                    <ListItem alignItems="flex-start">
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
                        key={info.imagenUrl}
                      >
                        {!!info.imagenUrl && (
                        <img
                          src={info.imagenUrl}
                          srcSet={info.imagenUrl}
                          alt={info.proveedorInfo.name}
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
                        <TextareaAutosize minRows={15} style={{ width: '100%' }} />
                        <Button variant="contained" sx={{ mt: '5px', alignSelf: 'flex-start' }}>
                          Enviar mensaje
                        </Button>
                      </ListItem>
                    </ListItem>
                    <Divider variant="outlined" sx={{ borderColor: 'black' }} />

                  </>
                );
              })
            }
          </List>
        </Grid>
      </Grid>
    </>
  );
}
export default VendiblePage;
