/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import CategoryAccordion from '../Vendible/Category/CategoryAccordion';
import SelectedFilters from '../Shared/Components/SelectedFilters';
import { SearcherInput } from '../Shared/Components';

function VendiblesAdminFilters({
  categories, getMenuOption, vendibleType, onCategorySelected, onFilterByName,
}) {
  const [filtersApplied, setFiltersApplied] = useState({ categoryId: null, categoryName: '', name: '' });

  const onNameFilterSet = (value) => setFiltersApplied((previous) => (
    { ...previous, name: value }
  ));

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

  const memoizedMenuOptions = useMemo(() => {
    const options = [getMenuOption({
      component: SearcherInput,
      onClick: undefined,
      props: {
        title: sharedLabels.searchByVendibleName,
        titleConfig: {
          variant: 'h6',
        },
        onSearchClick: () => onFilterByName(filtersApplied.name),
        keyEvents: {
          onKeyUp: onNameFilterSet,
          onEnterPressed: () => onFilterByName(filtersApplied.name),
          onDeletePressed: (value) => {
            onNameFilterSet(value);
            if (!value) {
              onFilterByName();
            }
          },
        },
        inputValue: filtersApplied.name,
      },
    })];

    if (!filtersApplied.name) {
      options.push(getMenuOption({
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
      }));
    }

    return options;
  }, [filtersApplied.name, categories]);

  const deleteCategoryFilter = () => {
    setFiltersApplied((previous) => ({ ...previous, categoryId: null, categoryName: '' }));
    onCategorySelected();
  };

  return someFilterApplied ? (
    <SelectedFilters labels={filtersLabels} showTitle onDelete={deleteCategoryFilter} />
  ) : (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      itemsStyles={{
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
      buttonLabel={sharedLabels.filters}
      options={memoizedMenuOptions}
    />
  );
}

export default VendiblesAdminFilters;
