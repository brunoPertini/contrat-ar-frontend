/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import pickBy from 'lodash/pickBy';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SearcherInput from '../Shared/Components/Searcher';

function PostsFilters({ getMenuOption, vendibleType, onFilterSelected }) {
  const [filters, setFilters] = useState({
    proveedorName: '',
    proveedorSurname: '',
    categoryName: '',
    minPrice: null,
    maxPrice: null,
    minStock: null,
    maxStock: null,
    offersDelivery: null,
    offersInCustomAddress: null,
    priceType: null,
  });

  const onFilterSet = (key, newValue, runApplyFiltersCallback = false) => {
    setFilters((previous) => ({ ...previous, [key]: newValue }));

    if (runApplyFiltersCallback) {
      onFilterSelected(pickBy(filters, (value) => !!value));
    }
  };

  const menuOptions = [getMenuOption({
    component: SearcherInput,
    onClick: undefined,
    props: {
      title: sharedLabels.providerName,
      titleConfig: {
        variant: 'h6',
      },
      onSearchClick: () => onFilterSelected(pickBy(filters, (value) => !!value)),
      keyEvents: {
        onKeyUp: (value) => onFilterSet('proveedorName', value),
        onEnterPressed: () => onFilterSelected(pickBy(filters, (value) => !!value)),
        onDeletePressed: (newValue) => {
          onFilterSet('proveedorName', newValue);
          if (!newValue) {
            onFilterSelected(pickBy(filters, (value) => !!value));
          }
        },
      },
      inputValue: filters.proveedorName,
    },
  })];

  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      itemsStyles={{
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
      buttonLabel={sharedLabels.filters}
      options={menuOptions}
    />
  );
}

export default PostsFilters;
