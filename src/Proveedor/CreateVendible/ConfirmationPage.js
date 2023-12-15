/* eslint-disable react/prop-types */
import {
  Card, CardContent, Grid, Typography,
} from '@mui/material';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_VARIABLE, PRODUCT, SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { LocationMap } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';

function ConfirmationPage({ vendibleType, vendibleInfo }) {
  const {
    categories,
    priceInfo: { type: priceInfoType, amount: priceInfoAmount },
    locationTypes, vendibleLocation, stock,
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
      flexDirection="column"
      xs={10}
      sx={{
        alignSelf: 'center',
      }}
    >
      <Typography variant="h4">
        { proveedorLabels['addVendible.confirmation.title'].replace('{vendible}', vendibleType)}
      </Typography>
      <Card>
        <CardContent>
          <Typography>
            { sharedLabels.name }
            :
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            { vendibleInfo.nombre }
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
        {
            renderLocationType && (
            <CardContent>
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
                    width: '50%',
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
      </Card>
    </Grid>
  );
}

export default ConfirmationPage;
