/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import CategoryAccordion from '../Vendible/Category/CategoryAccordion';
import SelectedFilters from '../Shared/Components/SelectedFilters';

function VendiblesAdminFilters({
  categories, getMenuOption, vendibleType, onCategorySelected,
}) {
  const [filtersApplied, setFiltersApplied] = useState({ categoryId: null, categoryName: '' });

  const filtersLabels = useMemo(() => Object.keys(filtersApplied)
    .filter((key) => ['categoryName'].includes(key)
  && !!(filtersApplied[key]))
    .map((filteredKey) => filtersApplied[filteredKey]), [filtersApplied]);

  const someFilterApplied = useMemo(() => filtersLabels.some(
    (value) => (!!value),
  ), [filtersLabels]);

  useEffect(() => {
    if (vendibleType) {
      setFiltersApplied((previous) => ({ ...previous, categoryId: null, categoryName: '' }));
    }
  }, [vendibleType]);

  const memoizedMenuOptions = [
    getMenuOption({
      component: CategoryAccordion,
      onClick: undefined,
      props: {
        categories,
        onCategorySelected: (categoryId, categoryName) => {
          setFiltersApplied((previous) => ({ ...previous, categoryId, categoryName }));
          onCategorySelected(categoryId);
        },
        vendibleType,
      },
    }),
  ];

  const deleteCategoryFilter = () => {
    setFiltersApplied((previous) => ({ ...previous, categoryId: null, categoryName: '' }));
    onCategorySelected();
  };

  return someFilterApplied ? (
    <SelectedFilters labels={filtersLabels} showTitle onDelete={deleteCategoryFilter} />
  ) : (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={memoizedMenuOptions}
    />
  );
}

export default VendiblesAdminFilters;
