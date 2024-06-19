import PropTypes from 'prop-types';

export const proveedorVendibleShape = {
  vendibleNombre: PropTypes.string,
  descripcion: PropTypes.string,
  precio: PropTypes.number,
  imagenUrl: PropTypes.string,
  stock: PropTypes.number,
  proveedorId: PropTypes.number,
  vendibleCategoryId: PropTypes.number,
  vendibleId: PropTypes.number,
  distance: PropTypes.number,
};

export const proveedorDTOShape = {
  id: PropTypes.number,
  name: PropTypes.string,
  surname: PropTypes.string,
  email: PropTypes.string,
  birthDate: PropTypes.string,
  role: PropTypes.object,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  dni: PropTypes.string,
  fotoPerfilUrl: PropTypes.string,
  active: PropTypes.bool,
  phone: PropTypes.string,
};

export const vendibleCategoryShape = PropTypes.shape({
  root: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.shape({
    root: PropTypes.string,
    children: PropTypes.array,
  })),
});

export const getUserInfoResponseShape = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  surname: PropTypes.string,
  email: PropTypes.string,
  birthDate: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  role: PropTypes.oneOf(['PROVEEDOR_SERVICIOS', 'PROVEEDOR_PRODUCTOS', 'CLIENTE', 'ADMIN']),
  token: PropTypes.string,
  indexPage: PropTypes.string,
  phone: PropTypes.string,
  password: PropTypes.string,
  plan: PropTypes.oneOf(['FREE', 'PAID', '']),
  dni: PropTypes.string,
};

export const getVendiblesResponseShape = {
  vendibles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape(proveedorVendibleShape))),
  proveedores: PropTypes.arrayOf(PropTypes.shape(proveedorDTOShape)),
  categorias: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)),
};
