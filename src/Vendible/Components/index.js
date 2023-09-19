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
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { systemConstants } from '../../Shared/Constants';
import { labels as clientLabels } from '../../StaticData/Cliente';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';

function VendiblePage({ proveedoresInfo, vendibleType, userInfo }) {
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

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} />
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid item xs={2}>
          <Typography variant="h3">
            { proveedoresInfo[0].vendibleNombre}
          </Typography>
        </Grid>
        {/* TODO: pasar por props cuando los filtros no estén activos.
         Si no lo están, darle mas espacio a la segunda columna del grid */}
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
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                        key={info.imagenUrl}
                      >
                        <img
                          src={info.imagenUrl}
                          srcSet={info.imagenUrl}
                          alt={info.proveedorInfo.name}
                          loading="lazy"
                        />
                        <ListItemText
                          primary={info.descripcion}
                        />
                      </ImageListItem>
                      <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5">
                          {getPriceLabel(precio)}
                        </Typography>
                        <Typography variant="h5" sx={{ mt: '50px' }}>
                          {clientLabels.contactProvider.replace('{nombreProveedor}', name)}
                        </Typography>
                        <TextareaAutosize minRows={5} cols={50} />
                        <Button variant="contained" sx={{ mt: '5px' }}>
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
