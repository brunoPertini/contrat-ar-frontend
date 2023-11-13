/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Groups2Icon from '@mui/icons-material/Groups2';
import Alert from '@mui/material/Alert';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { getVendiblesResponseShape } from '../../Shared/PropTypes/Vendibles';
import { sharedLabels } from '../../StaticData/Shared';
import { routes, systemConstants } from '../../Shared/Constants';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';

/**
 * Vendibles list of Provider page.
 */
export default function VendiblesList({ vendibles }) {
  const redirectLink = () => {};

  const cardStyles = { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' };

  const linkSection = (
    <Link
      onClick={() => {}}
      variant="h5"
      sx={{
        ml: '10px',
        cursor: 'pointer',
      }}
    >
      {sharedLabels.seeDetail}
    </Link>
  );

  return (
    <>
      <List>
        {vendibles.map((vendible) => (
          <VendibleCard
            vendibleTitle={vendible.vendibleNombre}
            images={vendible.imagenUrl ? [vendible.imagenUrl] : []}
            key={`vendibleCard_${vendible.vendibleNombre}`}
            cardStyles={cardStyles}
            linkSection={linkSection}
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
          <Alert
            severity="info"
            variant="filled"
            sx={{
              mt: '2%',
              fontSize: 'h4.fontSize',
              '.MuiAlert-icon': {
                fontSize: '50px;',
              },
              width: '50%',
            }}
          >
            {vendiblesLabels.noResultsFound}
          </Alert>
        )
      }
    </>
  );
}
