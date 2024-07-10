import PropTypes from 'prop-types';
import UsuariosAdminFilters from './UsuariosAdminFilters';

export default function AdminFilters({ filtersType, usuariosFiltersProps }) {
  if (filtersType === 'usuarios') {
    return <UsuariosAdminFilters {...usuariosFiltersProps} />;
  }

  return null;
}

AdminFilters.defaultProps = {
  usuariosFiltersProps: {},
};

AdminFilters.propTypes = {
  filtersType: PropTypes.oneOf(['usuarios', 'productos', 'servicios']).isRequired,
  usuariosFiltersProps: PropTypes.object,
};
