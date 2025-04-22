import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useCallback, useState } from 'react';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { sharedLabels } from '../../StaticData/Shared';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import StaticAlert from '../../Shared/Components/StaticAlert';
import OptionsMenu from '../../Shared/Components/OptionsMenu';
import DialogModal from '../../Shared/Components/DialogModal';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { postStateLabelResolver } from '../../Shared/Helpers/ProveedorHelper';
import { POST_STATES, PROVEEDOR } from '../../Shared/Constants/System';

const MODIFIABLE_STATES = [POST_STATES.ACTIVE, POST_STATES.REJECTED, POST_STATES.PAUSED];

const DELEATABLE_STATES = [POST_STATES.ACTIVE, POST_STATES.REJECTED, POST_STATES.PAUSED];

const shouldAddOption = {
  [sharedLabels.seeDetail]: () => true,
  [sharedLabels.modify]: (postState) => MODIFIABLE_STATES.includes(postState),
  [sharedLabels.delete]: (postState) => DELEATABLE_STATES.includes(postState),
};

const getVendibleOptions = (postState) => [sharedLabels.seeDetail,
  sharedLabels.modify, sharedLabels.delete]
  .filter((key) => shouldAddOption[key](postState));

/**
 * Vendibles list of Proveedor page.
 */
export default function VendiblesList({
  vendibles, proveedorId, handleOnOptionClicked, handlePutVendible, resetFiltersApplied,
}) {
  const [modifyStateData, setModifyStateData] = useState({ state: '', vendibleId: '' });

  const [modalContent, setModalContent] = useState({
    title: '',
    text: '',
  });

  const cleanModalContent = () => {
    setModifyStateData({ state: '', vendibleId: '' });
    setModalContent({ title: '', text: '' });
  };

  const acceptStateChange = () => handlePutVendible({
    proveedorId,
    vendibleId: modifyStateData.vendibleId,
    body: { state: modifyStateData.state },
  })
    .finally(() => {
      cleanModalContent();
      resetFiltersApplied();
    });

  const cardStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
  };

  const linkSection = useCallback((vendible) => (
    <OptionsMenu
      title={sharedLabels.actions}
      options={getVendibleOptions(vendible.state)}
      onOptionClicked={(option) => handleOnOptionClicked(option, vendible)}
      vendibleName={vendible.vendibleNombre}
    />
  ), [handleOnOptionClicked]);

  const manageStateChange = (newState, vendibleId) => {
    setModifyStateData({ state: newState, vendibleId });
    setModalContent({
      title: sharedLabels.pleaseConfirmAction,
      text: proveedorLabels['vendible.update.state'].replace('{newState}', postStateLabelResolver[newState]),
    });
  };

  return (
    <>
      <DialogModal
        title={modalContent.title}
        contextText={modalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={!!(modalContent?.title && modalContent.text)}
        handleAccept={acceptStateChange}
        handleDeny={cleanModalContent}
      />
      <List>
        {vendibles.map((vendible) => (
          <VendibleCard
            userRole={PROVEEDOR}
            vendibleTitle={vendible.vendibleNombre}
            images={vendible.imagenUrl ? [vendible.imagenUrl] : []}
            key={`vendibleCard_${vendible.vendibleNombre}`}
            cardStyles={cardStyles}
            LinkSection={linkSection(vendible)}
            imageListProps={{
              cols: 1,
              rowHeight: 164,
              sx: {
                cols: 1,
                gap: 8,
                sx: {
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  margin: '0 auto',
                },
              },
            }}
            ChildrenComponent={ProveedorVendibleCard}
            state={vendible.state}
            manageStateChange={(state) => manageStateChange(state, vendible.vendibleId)}
            linkCardStyles={{ display: 'flex', alignItems: 'center', gap: 1 }}
          />
        ))}
      </List>
      {
        !vendibles.length && (
          <StaticAlert
            label={vendiblesLabels.noResultsFound}
            styles={{
              backgroundColor: 'rgb(36, 134, 164)',
              mt: '2%',
              fontSize: 'h4.fontSize',
              '.MuiAlert-icon': {
                fontSize: '50px;',
              },
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
  proveedorId: PropTypes.number.isRequired,
  vendibles: proveedoresVendiblesShape,
  handleOnOptionClicked: PropTypes.func.isRequired,
  handlePutVendible: PropTypes.func.isRequired,
  resetFiltersApplied: PropTypes.func.isRequired,
};
