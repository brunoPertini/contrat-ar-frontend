import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';

import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_VARIABLE, PRODUCT, SERVICE, SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { LocationMap } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';

function ConfirmationPage({ vendibleType, vendibleInfo }) {
  const {
    categories, nombre,
    priceInfo: { type: priceInfoType, amount: priceInfoAmount },
    locationTypes, vendibleLocation, stock, imageUrl, description,
  } = vendibleInfo;

  const categoriesString = categories.join(',  ');
  let locationTypesString;

  if (locationTypes.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    locationTypesString = locationTypes[0];
  } else {
    const formattedLocationTypesArray = locationTypes
      .slice(1, locationTypes.length)
      .map((locationType) => locationType.toLowerCase());

    formattedLocationTypesArray.splice(0, 0, locationTypes[0]);
    locationTypesString = formattedLocationTypesArray.join(' y ');
  }

  const renderPriceAmount = priceInfoType !== PRICE_TYPE_VARIABLE;
  const renderLocationType = vendibleType !== PRODUCT.toLowerCase();
  const renderMap = renderLocationType && locationTypes.includes(SERVICE_LOCATION_FIXED);

  const renderStock = vendibleType === PRODUCT.toLowerCase();

  return (
    <Grid
      item
      display="flex"
      flexDirection="row"
      xs={10}
      sx={{ minWidth: '100vw' }}
      justifyContent="center"
    >
      <Card>
        <Typography variant="h4">
          { proveedorLabels['addVendible.confirmation.title'].replace('{vendible}', vendibleType)}
        </Typography>
        <CardContent>
          <Typography>
            { sharedLabels.name }
            :
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {nombre }
          </Typography>
        </CardContent>
        <CardContent>
          <Typography>
            { sharedLabels.categories }
            :
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            { categoriesString }
          </Typography>
        </CardContent>
        <CardContent>
          <Typography>
            { sharedLabels.priceType }
            :
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            { priceInfoType }
          </Typography>
        </CardContent>
        {
            renderPriceAmount && (
            <CardContent>
              <Typography>
                { sharedLabels.price }
                :
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                { priceInfoAmount }
              </Typography>
            </CardContent>
            )
        }
        {
            renderStock && (
            <CardContent>
              <Typography>
                { sharedLabels.stock }
                :
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                { stock }
                {' '}
                {sharedLabels.units}
              </Typography>
            </CardContent>
            )
        }
        <CardContent>
          <Typography>
            { proveedorLabels['addVendible.description.title'].replace('{vendible}', vendibleType)}
            :
          </Typography>
          <Typography fontWeight="bold">
            { description }
          </Typography>
        </CardContent>
        <CardContent>
          <ImageListItem
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '20%',
            }}
          >
            <Typography>
              { sharedLabels['image.main'] }
              {' '}
              :
            </Typography>
            {!!imageUrl && (
            <img
              src={imageUrl}
              srcSet={imageUrl}
              alt=""
              loading="lazy"
            />
            )}
          </ImageListItem>
        </CardContent>
        <CardContent>
          {
            renderLocationType && (
            <CardContent sx={{ width: '55%' }}>
              <Typography>
                { sharedLabels.serviceLocationType }
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                { locationTypesString }
              </Typography>
              {
                renderMap && (
                <LocationMap
                  containerStyles={{
                    height: '200px',
                  }}
                  enableDragEvents={false}
                  location={{
                    coords: {
                      latitude: vendibleLocation.coordinates[0],
                      longitude: vendibleLocation.coordinates[1],
                    },
                  }}
                />
                )
              }
            </CardContent>
            )
        }
        </CardContent>
      </Card>
    </Grid>
  );
}

ConfirmationPage.propTypes = {
  vendibleInfo: PropTypes.shape({
    nombre: PropTypes.string,
    priceInfo: PropTypes.shape({
      type: PropTypes.string,
      amount: PropTypes.string,
    }),
    locationTypes: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    vendibleLocation: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCT.toLowerCase(), SERVICE.toLowerCase()]).isRequired,
};

export default ConfirmationPage;
