import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Groups2Icon from '@mui/icons-material/Groups2';
import VendibleCard from '../../Shared/Components/VendibleCard';
import { labels } from '../../StaticData/Cliente';
import { getVendiblesResponseShape } from '../../Shared/PropTypes/Vendibles';
import { routes, systemConstants } from '../../Shared/Constants';
import ClienteVendibleCard from '../../Shared/Components/VendibleCard/ClienteVendibleCard';

/**
 * List that shows each service or product info, including its provider
 * @param {Object<String, Array>} vendiblesObject
 * @param {String} vendibleType
 */
export default function VendiblesList({ vendiblesObject, vendibleType }) {
  const vendiblesNames = useMemo(() => Object.keys(vendiblesObject.vendibles), [vendiblesObject]);

  const { linkLabel, redirectLink } = useMemo(() => (vendibleType === systemConstants.PRODUCTS ? {
    linkLabel: labels.linkVendibleCardProduct,
    redirectLink: routes.productoIndex,
  } : {
    linkLabel: labels.linkVendibleCardService,
    redirectLink: routes.servicioIndex,
  }), [vendibleType]);

  const navigate = useNavigate();

  const handleGoToVendiblePage = useCallback((vendibleName) => {
    const parsedChosenVendible = vendiblesObject.vendibles[vendibleName].map((
      proveedorVendible,
    ) => {
      proveedorVendible.proveedorInfo = vendiblesObject.proveedores.find(
        (proveedor) => proveedor.id === proveedorVendible.proveedorId,
      );
      // TODO: desharcodearlo cuando se integre el cálculo de distancia en el backend
      proveedorVendible.proveedorInfo.distanceFrom = 0.5;
      return proveedorVendible;
    });
    navigate(redirectLink, { state: { proveedoresInfo: parsedChosenVendible, vendibleType } });
  }, [navigate]);

  return (
    <List>
      { vendiblesNames.map((vendibleName) => {
        const images = [];
        for (let i = 0;
          i < vendiblesObject.vendibles[vendibleName].length && images.length < 3;
          i++) {
          if (vendiblesObject.vendibles[vendibleName][i].imagenUrl) {
            images.push(vendiblesObject.vendibles[vendibleName][i].imagenUrl);
          }
        }

        const linkSection = (
          <>
            <Groups2Icon fontSize="large" />
            <Link
              onClick={() => handleGoToVendiblePage(vendibleName)}
              variant="h5"
              sx={{
                ml: '10px',
                cursor: 'pointer',
              }}
            >
              {linkLabel}
            </Link>
          </>
        );

        return (
          <VendibleCard
            vendibleTitle={vendibleName}
            images={images}
            key={`vendibleCard_${vendibleName}`}
            cardStyles={{ mb: '2%', display: 'flex', flexDirection: 'column' }}
            linkSection={linkSection}
            linkCardStyles={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            imageListProps={{
              cols: 3,
              gap: 10,
            }}
            ChildrenComponent={ClienteVendibleCard}
          />
        );
      })}
    </List>
  );
}

VendiblesList.propTypes = {
  vendiblesObject: PropTypes.shape(getVendiblesResponseShape).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
};
