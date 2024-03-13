import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import { useCallback, useState } from 'react';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { sharedLabels } from '../../StaticData/Shared';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import StaticAlert from '../../Shared/Components/StaticAlert';
import OptionsMenu from '../../Shared/Components/OptionsMenu';
import VendibleInfo from '../../Shared/Components/VendibleInfo';
import { PRICE_TYPES, SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED } from '../../Shared/Constants/System';

const vendibleOptions = [sharedLabels.seeDetail, sharedLabels.modify, sharedLabels.delete];

const optionsMenuHandlers = ({
  vendibleInfo,
  option, vendibleType, userToken,
}) => {
  const locationTypes = [];

  if (vendibleInfo.offersDelivery) {
    locationTypes.push(SERVICE_LOCATION_AT_HOME);
  }

  if (vendibleInfo.offersInCustomAddress) {
    locationTypes.push(SERVICE_LOCATION_FIXED);
  }

  const parsedVendibleInfo = {
    ...vendibleInfo,
    priceInfo: {
      type: PRICE_TYPES[vendibleInfo.tipoPrecio],
      amount: vendibleInfo.precio,
    },
    vendibleLocation: vendibleInfo.location,
    categories: vendibleInfo.categoryNames,
    locationTypes,
    nombre: vendibleInfo.vendibleNombre,
  };

  const handlers = {
    [sharedLabels.seeDetail]: () => (
      <VendibleInfo
        vendibleType={vendibleType}
        vendibleInfo={parsedVendibleInfo}
        cardStyles={{
          display: 'flex',
          flexDirection: 'column',
          width: '60%',
          overflow: 'scroll',
        }}
        userToken={userToken}
      />
    ),
    [sharedLabels.modify]: () => {},
    [sharedLabels.delete]: () => {},
  };

  return handlers[option]();
};

/**
 * Vendibles list of Proveedor page.
 */
export default function VendiblesList({ vendibles, vendibleType, userToken }) {
  const [isOperationsModalOpen, setIsOperationsModalOpen] = useState(false);
  const [vendibleOperationsComponent, setVendibleOperationsComponent] = useState(<div />);

  const cardStyles = {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
  };

  const handleOnOptionClicked = (option, vendibleInfo) => {
    if (option) {
      setIsOperationsModalOpen(true);
      const ModalComponent = optionsMenuHandlers({
        vendibleInfo,
        option,
        vendibleType,
        userToken,
      });
      setVendibleOperationsComponent(ModalComponent);
    }
  };

  const linkSection = useCallback((vendible) => (
    <OptionsMenu
      title={sharedLabels.actions}
      options={vendibleOptions}
      onOptionClicked={(option) => handleOnOptionClicked(option, vendible)}
      vendibleName={vendible.vendibleNombre}
    />
  ), [handleOnOptionClicked]);

  return (
    <>
      <Modal
        disableEnforceFocus
        open={isOperationsModalOpen}
        onClose={() => setIsOperationsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        { vendibleOperationsComponent }
      </Modal>
      <List>
        {vendibles.map((vendible) => (
          <VendibleCard
            vendibleTitle={vendible.vendibleNombre}
            images={vendible.imagenUrl ? [vendible.imagenUrl] : []}
            key={`vendibleCard_${vendible.vendibleNombre}`}
            cardStyles={cardStyles}
            LinkSection={linkSection(vendible)}
            imageListProps={{
              cols: 1,
              sx: { width: '40%' },
            }}
            ChildrenComponent={ProveedorVendibleCard}
          />
        ))}
      </List>
      {
        !vendibles.length && (
          <StaticAlert
            label={vendiblesLabels.noResultsFound}
            styles={{
              mt: '2%',
              fontSize: 'h4.fontSize',
              '.MuiAlert-icon': {
                fontSize: '50px;',
              },
              width: '50%',
            }}
          />
        )
      }
    </>
  );
}

VendiblesList.defaultProps = {
  vendibles: [],
};

VendiblesList.propTypes = {
  vendibles: proveedoresVendiblesShape,
  vendibleType: PropTypes.string.isRequired,
  userToken: PropTypes.string.isRequired,
};
