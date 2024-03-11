/* eslint-disable react/no-unstable-nested-components */
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { sharedLabels } from '../../StaticData/Shared';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import StaticAlert from '../../Shared/Components/StaticAlert';
import OptionsMenu from '../../Shared/Components/OptionsMenu';
import VendibleInfo from '../../Shared/Components/VendibleInfo';

const vendibleOptions = [sharedLabels.seeDetail, sharedLabels.modify, sharedLabels.delete];

/**
 * Vendibles list of Proveedor page.
 */
export default function VendiblesList({ vendibles, vendibleType }) {
  const [isOperationsModalOpen, setIsOperationsModalOpen] = useState(false);
  const [vendibleOperationsComponent, setVendibleOperationsComponent] = useState(null);

  const cardStyles = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' };

  const optionsMenuHandlers = ({ vendibleInfo, option }) => {
    const handlers = {
      [sharedLabels.seeDetail]: () => (
        <VendibleInfo
          vendibleType={vendibleType}
          vendibleInfo={vendibleInfo}
        />
      ),
      [sharedLabels.modify]: () => {},
      [sharedLabels.delete]: () => {},
    };

    return handlers[option]();
  };

  // eslint-disable-next-line no-unused-vars
  const handleOnOptionClicked = (option, vendibleInfo) => {
    setIsOperationsModalOpen(true);
    optionsMenuHandlers[option]();
  };

  const linkSection = (vendible) => (
    <OptionsMenu
      title={sharedLabels.actions}
      options={vendibleOptions}
      onOptionClicked={(option) => handleOnOptionClicked(option, vendible)}
      vendibleName={vendible.vendibleNombre}
    />
  );

  return (
    <>
      <Modal
        open={isOperationsModalOpen}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          rreeeeeeeeeeeee
        </div>
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
};
