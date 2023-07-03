/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import VendibleCard from './VendibleCard';

/**
 * List that shows each service or product info, including its provider
 * @param {Array<T>} items
 */
export default function VendiblesList({ items }) {
  return (
    <List sx={{
      width: '100%', flexDirection: 'column', alignItems: 'center', display: 'flex',
    }}
    >
      { items.map((item) => {
        const vendibleType = 'services' in item ? 'services' : 'products';
        return item[vendibleType].map(
          (vendible) => (
            <VendibleCard
              image={vendible.image}
              title={vendible.title}
              text={vendible.text}
              proveedor={item.proveedor}
            />
          ),
        );
      })}
    </List>
  );
}

VendiblesList.propTypes = {
  items: PropTypes.array.isRequired,
};
