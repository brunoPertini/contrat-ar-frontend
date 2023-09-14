import PropTypes from 'prop-types';

export const proveedorVendibleShape = {
  vendibleNombre: PropTypes.string,
  descripcion: PropTypes.string,
  precio: PropTypes.number,
  imagenUrl: PropTypes.string,
  stock: PropTypes.number,
  proveedorId: PropTypes.number,
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
};

export const getVendiblesResponseShape = {
  vendibles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape(proveedorVendibleShape))),
  proveedores: PropTypes.arrayOf(PropTypes.shape(proveedorDTOShape)),
};
