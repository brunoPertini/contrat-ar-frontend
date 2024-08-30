import PropTypes from 'prop-types';
import { locationShape } from './Shared';

export const proveedoresVendiblesShape = PropTypes.arrayOf(PropTypes.shape({
  vendibleNombre: PropTypes.string,
  descripcion: PropTypes.string,
  precio: PropTypes.number,
  imagenUrl: PropTypes.string,
  stock: PropTypes.number,
  vendibleId: PropTypes.number,
  categoryNames: PropTypes.arrayOf(PropTypes.string),
}));

export const vendibleInfoShape = {
  categories: PropTypes.arrayOf(PropTypes.string),
  nombre: PropTypes.string,
  priceInfo: PropTypes.shape({ type: PropTypes.string, amount: PropTypes.number }),
  locationTypes: PropTypes.arrayOf(PropTypes.string),
  vendibleLocation: PropTypes.shape(locationShape),
  stock: PropTypes.number,
  imagenUrl: PropTypes.string,
  descripcion: PropTypes.string,
};

export const planShape = {
  id: PropTypes.number,
  descripcion: PropTypes.string,
  type: PropTypes.string,
  price: PropTypes.number,
};

export const suscriptionShape = {
  id: PropTypes.number,
  isActive: PropTypes.bool,
  createdDate: PropTypes.string,
  planId: PropTypes.number,
  usuarioId: PropTypes.number,
};
