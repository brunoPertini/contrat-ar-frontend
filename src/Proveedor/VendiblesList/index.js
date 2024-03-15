import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useCallback } from 'react';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { sharedLabels } from '../../StaticData/Shared';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import StaticAlert from '../../Shared/Components/StaticAlert';
import OptionsMenu from '../../Shared/Components/OptionsMenu';

const vendibleOptions = [sharedLabels.seeDetail, sharedLabels.modify, sharedLabels.delete];

/**
 * Vendibles list of Proveedor page.
 */
export default function VendiblesList({ vendibles, handleOnOptionClicked }) {
  const cardStyles = {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
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
  handleOnOptionClicked: PropTypes.func.isRequired,
};
