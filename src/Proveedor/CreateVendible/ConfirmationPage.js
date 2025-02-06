import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

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
    <Box
      display="flex"
      flexDirection="row"
      sx={{ alignSelf: 'center' }}
      justifyContent="center"
    >
      <VendibleInfo
        userToken={userToken}
        isEditionEnabled={isEditionEnabled}
        vendibleInfo={vendibleInfo}
        vendibleType={vendibleType}
        title={proveedorLabels['addVendible.confirmation.title'].replace('{vendible}', vendibleUnit)}
        cardStyles={{
          display: 'flex',
          flexDirection: 'column',
          width: '85%',
          overflow: 'auto',
        }}
        cardRowStyles={{
          width: '40%',
        }}
      />
    </Box>
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
