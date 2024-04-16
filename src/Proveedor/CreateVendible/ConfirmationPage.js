import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

import {
  PRODUCTS, SERVICES,
} from '../../Shared/Constants/System';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendibleInfo from '../../Shared/Components/VendibleInfo';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';

function ConfirmationPage({
  vendibleType,
  vendibleInfo, isEditionEnabled,
  userToken,
}) {
  const vendibleUnit = parseVendibleUnit(vendibleType);
  return (
    <Grid
      item
      display="flex"
      flexDirection="row"
      xs={10}
      sx={{ alignSelf: 'center' }}
      justifyContent="center"
    >
      <VendibleInfo
        userToken={userToken}
        isEditionEnabled={isEditionEnabled}
        vendibleInfo={vendibleInfo}
        vendibleType={vendibleType}
        title={proveedorLabels['addVendible.confirmation.title'].replace('{vendible}', vendibleUnit)}
        cardRowStyles={{
          width: '40%',
        }}
      />
    </Grid>
  );
}

ConfirmationPage.defaultProps = {
  isEditionEnabled: false,
};

ConfirmationPage.propTypes = {
  vendibleInfo: PropTypes.shape({
    nombre: PropTypes.string,
    priceInfo: PropTypes.shape({
      type: PropTypes.string,
      amount: PropTypes.number,
    }),
    locationTypes: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]).isRequired,
    imagenUrl: PropTypes.string,
    descripcion: PropTypes.string,
    vendibleLocation: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCTS.toLowerCase(), SERVICES.toLowerCase()]).isRequired,
  isEditionEnabled: PropTypes.bool,
  userToken: PropTypes.string.isRequired,
};

export default ConfirmationPage;
