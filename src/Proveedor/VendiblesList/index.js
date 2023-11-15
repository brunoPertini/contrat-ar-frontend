import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { sharedLabels } from '../../StaticData/Shared';
import ProveedorVendibleCard from '../../Shared/Components/VendibleCard/ProveedorVendibleCard';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';

/**
 * Vendibles list of Provider page.
 */
export default function VendiblesList({ vendibles }) {
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

VendiblesList.propTypes = {
  vendibles: proveedoresVendiblesShape.isRequired,
};
