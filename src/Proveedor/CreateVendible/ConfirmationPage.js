import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

import {
  PRODUCT, SERVICE,
} from '../../Shared/Constants/System';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendibleInfo from '../../Shared/Components/VendibleInfo';

function ConfirmationPage({ vendibleType, vendibleInfo }) {
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
        vendibleInfo={vendibleInfo}
        vendibleType={vendibleType}
        title={proveedorLabels['addVendible.confirmation.title'].replace('{vendible}', vendibleType)}
      />
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
    imagenUrl: PropTypes.string,
    descripcion: PropTypes.string,
    vendibleLocation: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCT.toLowerCase(), SERVICE.toLowerCase()]).isRequired,
};

export default ConfirmationPage;
