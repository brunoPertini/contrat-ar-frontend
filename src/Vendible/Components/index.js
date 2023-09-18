/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Grid from '@mui/material/Grid';
import {
  Avatar,
  ImageListItem,
  List, ListItem, ListItemAvatar, ListItemText, Typography,
} from '@mui/material';
import Header from '../../Header';

function VendiblePage({ proveedoresInfo }) {
  console.log(proveedoresInfo);
  return (
    <>
      <Header withMenuComponent />
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid item xs={6}>
          <Typography variant="h3">
            { proveedoresInfo[0].vendibleNombre}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <List sx={{ width: '100%' }}>
            {
              proveedoresInfo.map((info) => {
                const {
                  name, surname, fotoPerfilUrl, location,
                } = info.proveedorInfo;

                const fullName = `${name} ${surname}`;

                return (
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={fullName} src={fotoPerfilUrl} />
                      <ListItemText primary={fullName} />
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
                  </ListItem>
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
