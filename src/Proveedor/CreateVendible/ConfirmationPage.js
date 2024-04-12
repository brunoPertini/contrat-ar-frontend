import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

import {
  PRODUCT, SERVICE,
} from '../../Shared/Constants/System';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendibleInfo from '../../Shared/Components/VendibleInfo';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';

function ConfirmationPage({ vendibleType, vendibleInfo, isEditionEnabled }) {
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
      amount: PropTypes.string,
    }),
    locationTypes: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.string,
    imagenUrl: PropTypes.string,
    descripcion: PropTypes.string,
    vendibleLocation: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCT.toLowerCase(), SERVICE.toLowerCase()]).isRequired,
  isEditionEnabled: PropTypes.bool,
};

export default ConfirmationPage;
