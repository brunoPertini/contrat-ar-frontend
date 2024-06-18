import PropTypes from 'prop-types';

const usuarioCommonShape = {
  id: PropTypes.number,
  name: PropTypes.string,
  surname: PropTypes.string,
  email: PropTypes.string,
  birthDate: PropTypes.string,
  phone: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  createdAt: PropTypes.string,
  active: PropTypes.bool,
};

export const proveedorAdminShape = {
  ...usuarioCommonShape,
  dni: PropTypes.string,
  plan: PropTypes.oneOf(['PAID', 'FREE']),
  fotoPerfilUrl: PropTypes.string,
};

export const clienteAdminShape = {
  ...usuarioCommonShape,
};

export const getUsuariosAdminResponse = {
  usuarios: {
    clientes: PropTypes.arrayOf(PropTypes.shape(clienteAdminShape)),
    proveedores: PropTypes.arrayOf(PropTypes.shape(proveedorAdminShape)),
  },
};
