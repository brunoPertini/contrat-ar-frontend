import PropTypes from 'prop-types';

export const proveedoresVendiblesShape = PropTypes.arrayOf(PropTypes.shape({
  vendibleNombre: PropTypes.string,
  descripcion: PropTypes.string,
  precio: PropTypes.number,
  imagenUrl: PropTypes.string,
  stock: PropTypes.number,
  vendibleId: PropTypes.number,
  categoryNames: PropTypes.arrayOf(PropTypes.string),
}));
