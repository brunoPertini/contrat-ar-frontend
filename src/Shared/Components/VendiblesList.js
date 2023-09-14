/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import { useMemo } from 'react';
import { Divider } from '@mui/material';
import VendibleCard from './VendibleCard';
import { getVendiblesResponseShape } from '../PropTypes/Vendibles';

/**
 * List that shows each service or product info, including its provider
 * @param {Object<String, Array>} vendiblesObject
 * @param {String} vendibleType
 */
export default function VendiblesList({ vendiblesObject, vendibleType }) {
  const vendiblesNames = useMemo(() => Object.keys(vendiblesObject.vendibles), [vendiblesObject]);
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
              vendibleType={vendibleType}
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
