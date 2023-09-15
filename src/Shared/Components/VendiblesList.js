import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useMemo } from 'react';
import Divider from '@mui/material/Divider';
import VendibleCard from './VendibleCard';
import { labels } from '../../StaticData/Cliente';
import { getVendiblesResponseShape } from '../PropTypes/Vendibles';
import { routes, systemConstants } from '../Constants';

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

  return (
    <List sx={{
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      display: 'flex',
    }}
    >
      { vendiblesNames.map((vendibleName) => {
        const images = [];
        for (let i = 0;
          i < vendiblesObject.vendibles[vendibleName].length && images.length < 3;
          i++) {
          if (vendiblesObject.vendibles[vendibleName][i].imagenUrl) {
            images.push(vendiblesObject.vendibles[vendibleName][i].imagenUrl);
          }
        }
        return (
          <>
            <VendibleCard
              vendibleTitle={vendibleName}
              images={images}
              linkLabel={linkLabel}
              redirectLink={redirectLink}
            />
            <Divider light />

          </>
        );
      })}
    </List>
  );
}

VendiblesList.propTypes = {
  vendiblesObject: PropTypes.shape(getVendiblesResponseShape).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
};
