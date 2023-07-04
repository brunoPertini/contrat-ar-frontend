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

// TODO: extraerlo cuando se integre el backend
// const proveedorShape = PropTypes.shape({
//   name: PropTypes.string,
//   surname: PropTypes.string,
//   location: PropTypes.shape({
//     coordinates: PropTypes.arrayOf(PropTypes.number),
//     distanceFrom: PropTypes.number,
//   }),
// });

// const servicioShape = PropTypes.shape({
//   proveedor: PropTypes.shape(proveedorShape).isRequired,
//   services: PropTypes.arrayOf(PropTypes.shape({
//     title: PropTypes.string,
//     text: PropTypes.string,
//     image: PropTypes.shape({
//       src: PropTypes.string,
//     }).isRequired,
//   })),
// });

// const productoShape = PropTypes.shape({
//   proveedor: PropTypes.shape(proveedorShape).isRequired,
//   products: PropTypes.arrayOf(PropTypes.shape({
//     title: PropTypes.string,
//     text: PropTypes.string,
//     image: PropTypes.shape({
//       src: PropTypes.string,
//     }).isRequired,
//   })),
// });

VendiblesList.propTypes = {
  items: PropTypes.array.isRequired,
};
