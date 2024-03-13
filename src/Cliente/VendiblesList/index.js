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
import { MAX_CLIENT_VENDIBLES_GALLERY_IMAGES } from '../../Shared/Constants/System';

function LinkSection({ linkLabel, onClick, vendibleId }) {
  return (
    <>
      <Groups2Icon fontSize="large" />
      <Link
        onClick={() => onClick(vendibleId)}
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
}

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

  const handleGoToVendiblePage = useCallback((vendibleId) => {
    navigate(redirectLink, { state: { vendibleType, vendibleId } });
  }, [navigate]);

  return (
    <List>
      { vendiblesNames.map((vendibleName) => {
        const images = [];
        for (let i = 0;
          i < vendiblesObject.vendibles[vendibleName].length
          && images.length < MAX_CLIENT_VENDIBLES_GALLERY_IMAGES;
          i++) {
          if (vendiblesObject.vendibles[vendibleName][i].imagenUrl) {
            images.push(vendiblesObject.vendibles[vendibleName][i].imagenUrl);
          }
        }

        const { vendibleId } = vendiblesObject.vendibles[vendibleName][0];

        return (
          <VendibleCard
            vendibleTitle={vendibleName}
            images={images}
            key={`vendibleCard_${vendibleName}`}
            cardStyles={{ mb: '2%', display: 'flex', flexDirection: 'column' }}
            LinkSection={(
              <LinkSection
                vendibleId={vendibleId}
                onClick={handleGoToVendiblePage}
                linkLabel={linkLabel}
              />
)}
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

LinkSection.propTypes = {
  linkLabel: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  vendibleId: PropTypes.number.isRequired,
};

VendiblesList.propTypes = {
  vendiblesObject: PropTypes.shape(getVendiblesResponseShape).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
};
