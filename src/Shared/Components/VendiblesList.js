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

// {
//   proveedor: {
//     name: 'Bruno ',
//     surname: 'Pertini',
//     location: {
//       coordinates: [
//         34.9474625, -57.9733943,
//       ],
//       distanceFrom: 20,
//     },
//   },
//   services: [
//     {
//       title: 'Veterinario',
//       text: 'jkdfjkdjfkdjfkdjflkjlkjlkjlkjlkjlkjkljlkjkljkljkljlkjkljlkjlkjlkjlkj',
//       image: {
//         src: 'https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&dpr=1&auto=format&fit=crop&q=60&w=400&h=400',
//       },
//     },
//     {
//       title: 'Relojero',
//       text: 'gfdlkjgdflkgjdflkgjdflkgjdfgfgfdgggdgd',
//       image: {
//         src: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60&h=400',
//       },
//     },
//   ],
// },

const proveedorShape = PropTypes.shape({
  name: PropTypes.string,
  surname: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
    distanceFrom: PropTypes.number,
  }),
});

const servicioShape = PropTypes.shape({
  proveedor: PropTypes.shape(proveedorShape).isRequired,
  services: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    image: PropTypes.shape({
      src: PropTypes.string,
    }).isRequired,
  })),
});

const productoShape = PropTypes.shape({
  proveedor: PropTypes.shape(proveedorShape).isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    image: PropTypes.shape({
      src: PropTypes.string,
    }).isRequired,
  })),
});

VendiblesList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType([servicioShape, productoShape])).isRequired,
};
