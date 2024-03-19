import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import LocationMap from './LocationMap';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { sharedLabels } from '../../StaticData/Shared';
import {
  ARGENTINA_LOCALE, PRICE_TYPE_VARIABLE, PRODUCT,
  PRODUCTS,
  PRODUCT_LOCATION_FIXED,
  SERVICE,
  SERVICES,
  SERVICE_LOCATION_FIXED,
} from '../Constants/System';
import { getLocaleCurrencySymbol } from '../Helpers/PricesHelper';
import { vendibleInfoShape } from '../PropTypes/Proveedor';

export default function VendibleInfo({
  title, vendibleInfo, vendibleType,
  cardStyles, cardRowStyles, userToken, isEditionEnabled,
}) {
  const {
    categories, nombre,
    priceInfo: { type: priceInfoType, amount: priceInfoAmount },
    locationTypes, vendibleLocation, stock, imagenUrl, descripcion,
  } = vendibleInfo;

  const categoriesString = isEditionEnabled ? null : categories.join(',  ');
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
  const renderMap = locationTypes.includes(SERVICE_LOCATION_FIXED)
  || locationTypes.includes(PRODUCT_LOCATION_FIXED);

  const renderStock = vendibleType === PRODUCTS;

  const renderTitle = !!title;

  const vendibleUnit = (vendibleType === PRODUCTS ? PRODUCT : SERVICE).toLowerCase();

  const renderCategories = !isEditionEnabled;

  return (
    <Card sx={{ ...cardStyles }}>
      {
            renderTitle && (
            <Typography variant="h4">
              { title }
            </Typography>
            )
        }
      <CardContent sx={{ ...cardRowStyles }}>
        <Typography>
          { sharedLabels.name }
          :
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          { nombre }
        </Typography>
      </CardContent>
      {
        renderCategories && (
          <CardContent sx={{ ...cardRowStyles }}>
            <Typography>
              { sharedLabels.categories }
              :
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              { categoriesString }
            </Typography>
          </CardContent>
        )
      }
      <CardContent sx={{ ...cardRowStyles }}>
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
            <CardContent sx={{ ...cardRowStyles }}>
              <Typography>
                { sharedLabels.price }
                :
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                { getLocaleCurrencySymbol(ARGENTINA_LOCALE) }
                { priceInfoAmount }
              </Typography>
            </CardContent>
            )
        }
      {
            renderStock && (
            <CardContent sx={{ ...cardRowStyles }}>
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
      <CardContent sx={{ ...cardRowStyles }}>
        <Typography>
          { proveedorLabels['addVendible.description'].replace('{vendible}', vendibleUnit)}
          :
        </Typography>
        <Typography
          fontWeight="bold"
          sx={{ wordWrap: 'break-word' }}
        >
          { descripcion }
        </Typography>
      </CardContent>
      <CardContent>
        <ImageListItem
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
          }}
        >
          <Typography>
            { sharedLabels['image.main'] }
            {' '}
            :
          </Typography>
          {!!imagenUrl && (
          <img
            src={imagenUrl}
            srcSet={imagenUrl}
            alt=""
            loading="lazy"
          />
          )}
        </ImageListItem>
      </CardContent>
      <CardContent sx={{ width: '60%' }}>
        <Typography>
          { sharedLabels.locationType[vendibleUnit] }
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          { locationTypesString }
        </Typography>
        {
                renderMap && (
                <LocationMap
                  token={userToken}
                  containerStyles={{
                    height: '200px',
                    width: '100%',
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
    </Card>
  );
}

VendibleInfo.defaultProps = {
  title: '',
  cardRowStyles: {},
  cardStyles: {},
  isEditionEnabled: false,
};

VendibleInfo.propTypes = {
  title: PropTypes.string,
  vendibleInfo: PropTypes.shape(vendibleInfoShape).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCTS, SERVICES]).isRequired,
  cardStyles: PropTypes.object,
  cardRowStyles: PropTypes.object,
  userToken: PropTypes.string.isRequired,
  isEditionEnabled: PropTypes.bool,
};
