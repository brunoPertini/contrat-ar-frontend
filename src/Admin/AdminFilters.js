import PropTypes from 'prop-types';
import UsuariosAdminFilters from './UsuariosAdminFilters';
import VendiblesAdminFilters from './VendbilesAdminFilters';

export default function AdminFilters({ filtersType, usuariosFiltersProps, vendiblesFiltersProps }) {
  const getMenuOption = ({
    component, props, onClick, label,
  }) => ({
    component,
    props,
    onClick,
    label,
  });

  if (filtersType === 'usuarios') {
    return <UsuariosAdminFilters getMenuOption={getMenuOption} {...usuariosFiltersProps} />;
  }

  return (
    <VendiblesAdminFilters
      vendibleType={filtersType}
      getMenuOption={getMenuOption}
      {...vendiblesFiltersProps}
    />
  );
}

AdminFilters.defaultProps = {
  usuariosFiltersProps: {},
  vendiblesFiltersProps: {},
};

AdminFilters.propTypes = {
  filtersType: PropTypes.oneOf(['usuarios', 'productos', 'servicios']).isRequired,
  usuariosFiltersProps: PropTypes.object,
  vendiblesFiltersProps: PropTypes.object,
};
