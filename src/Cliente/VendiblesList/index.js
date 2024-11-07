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
      <Groups2Icon fontSize="large" color="primary" />
      <Link
        onClick={() => onClick(vendibleId)}
        variant="h5"
        sx={{
          ml: 2,
          color: 'primary.main',
          cursor: 'pointer',
          fontWeight: 'bold',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {linkLabel}
      </Link>
    </>
  );
}

export default function VendiblesList({ vendiblesObject, vendibleType }) {
  const vendiblesNames = useMemo(() => Object.keys(vendiblesObject.vendibles), [vendiblesObject]);
  const { linkLabel, redirectLink } = useMemo(() => (
    vendibleType === systemConstants.PRODUCTS ? {
      linkLabel: labels.linkVendibleCardProduct,
      redirectLink: routes.productoIndex,
    } : {
      linkLabel: labels.linkVendibleCardService,
      redirectLink: routes.servicioIndex,
    }
  ), [vendibleType]);

  const navigate = useNavigate();

  const handleGoToVendiblePage = useCallback((vendibleId) => {
    navigate(redirectLink, { state: { vendibleType, vendibleId } });
  }, [navigate]);

  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {vendiblesNames.map((vendibleName) => {
        const images = [];
        for (let i = 0; i < vendiblesObject.vendibles[vendibleName].length
          && images.length < MAX_CLIENT_VENDIBLES_GALLERY_IMAGES; i++) {
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
            cardStyles={{ mb: 4, boxShadow: 3, borderRadius: 2 }}
            LinkSection={(
              <LinkSection
                vendibleId={vendibleId}
                onClick={handleGoToVendiblePage}
                linkLabel={linkLabel}
              />
            )}
            linkCardStyles={{ display: 'flex', alignItems: 'center', gap: 1 }}
            imageListProps={{
              cols: 3,
              gap: 8,
              sx: { borderRadius: 2 },
            }}
            ChildrenComponent={ClienteVendibleCard}
          />
        );
      })}
    </List>
  );
}

LinkSection.propTypes = {
  linkLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  onClick: PropTypes.func.isRequired,
  vendibleId: PropTypes.number.isRequired,
};

VendiblesList.propTypes = {
  vendiblesObject: PropTypes.shape(getVendiblesResponseShape).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
};
