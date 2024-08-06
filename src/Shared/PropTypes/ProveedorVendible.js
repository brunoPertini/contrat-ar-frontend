import PropTypes from 'prop-types';

export const PostShape = {
  proveedorId: PropTypes.number,
  proveedorName: PropTypes.string,
  vendibleNombre: PropTypes.string,
  descripcion: PropTypes.string,
  precio: PropTypes.number,
  tipoPrecio: PropTypes.oneOf(['FIXED', 'VARIABLE', 'VARIABLE_WITH_AMOUNT']),
  offersDelivery: PropTypes.bool,
  offersInCustomAddress: PropTypes.bool,
  imagenUrl: PropTypes.string,
  stock: PropTypes.number,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    parent: PropTypes.object,
  }),
};
