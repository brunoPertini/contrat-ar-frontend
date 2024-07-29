import PropTypes from 'prop-types';
import UsuariosAdminFilters from './UsuariosAdminFilters';
import VendiblesAdminFilters from './VendbilesAdminFilters';
import PostsFilters from './PostsFilters';

export default function AdminFilters({
  filtersType, isShowingVendiblePosts,
  usuariosFiltersProps, vendiblesFiltersProps,
  postsFiltersProps,
}) {
  const getMenuOption = ({
    component, props, onClick, label,
  }) => ({
    component,
    props,
    onClick,
    label,
  });

  if (!isShowingVendiblePosts) {
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

  return <PostsFilters getMenuOption={getMenuOption} {...postsFiltersProps} />;
}

AdminFilters.defaultProps = {
  usuariosFiltersProps: {},
  vendiblesFiltersProps: {},
  postsFiltersProps: {},
  isShowingVendiblePosts: false,
};

AdminFilters.propTypes = {
  filtersType: PropTypes.oneOf(['usuarios', 'productos', 'servicios']).isRequired,
  usuariosFiltersProps: PropTypes.object,
  vendiblesFiltersProps: PropTypes.object,
  postsFiltersProps: PropTypes.object,
  isShowingVendiblePosts: PropTypes.bool,
};
