/* eslint-disable react/prop-types */
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import CategoryAccordion from '../Vendible/Category/CategoryAccordion';

function VendiblesAdminFilters({ categories, getMenuOption, vendibleType }) {
  const memoizedMenuOptions = [
    getMenuOption({
      component: CategoryAccordion,
      onClick: undefined,
      props: {
        categories,
        onCategorySelected: () => {},
        vendibleType,
      },
    }),
  ];
  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={memoizedMenuOptions}
    />

  );
}

export default VendiblesAdminFilters;
