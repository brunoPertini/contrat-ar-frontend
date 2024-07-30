/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import pickBy from 'lodash/pickBy';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SearcherInput from '../Shared/Components/Searcher';
import RangeSlider from '../Shared/Components/RangeSlider';
import { handleSliderPricesChanged } from '../Shared/Helpers/PricesHelper';
import { getTextForPricesSliderInput, locationSliderInputHelperTexts } from '../Shared/Helpers/ClienteHelper';

const DEFAULT_VALUES = {
  proveedorName: '',
  proveedorSurname: '',
  categoryName: '',
  prices: [],
  minStock: null,
  maxStock: null,
  offersDelivery: null,
  offersInCustomAddress: null,
  priceType: null,
};

function PostsFilters({
  getMenuOption, vendibleType, onFilterSelected, page, priceSliderProps,
}) {
  const [filters, setFilters] = useState(DEFAULT_VALUES);

  const onFilterSet = (key, newValue, runApplyFiltersCallback = false) => {
    setFilters((previous) => ({ ...previous, [key]: newValue }));

    if (runApplyFiltersCallback) {
      onFilterSelected(pickBy(filters, (value) => !!value));
    }
  };

  const onChangePricesWrapper = (
    newValues,
    comesFromInput,
    iconPressed,
  ) => handleSliderPricesChanged(
    newValues,
    comesFromInput,
    iconPressed,
    setFilters,
    onFilterSelected,
  );

  const nameMenuOption = getMenuOption({
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
  });

  const surnameMenuOption = getMenuOption({
    component: SearcherInput,
    onClick: undefined,
    props: {
      title: sharedLabels.providerSurname,
      titleConfig: {
        variant: 'h6',
      },
      onSearchClick: () => onFilterSelected(pickBy(filters, (value) => !!value)),
      keyEvents: {
        onKeyUp: (value) => onFilterSet('proveedorSurname', value),
        onEnterPressed: () => onFilterSelected(pickBy(filters, (value) => !!value)),
        onDeletePressed: (newValue) => {
          onFilterSet('proveedorSurname', newValue);
          if (!newValue) {
            onFilterSelected(pickBy(filters, (value) => !!value));
          }
        },
      },
      inputValue: filters.proveedorSurname,
    },
  });

  const filterByPriceMenuOption = getMenuOption({
    component: RangeSlider,
    onClick: undefined,
    props: {
      values: filters.prices,
      handleOnChange: onChangePricesWrapper,
      getInputTextFunction: getTextForPricesSliderInput,
      inputTextsHelpers: locationSliderInputHelperTexts,
      shouldShowBottomInputs: true,
      bottomInputsProps: {
        readOnly: false,
      },
      step: 10,
      min: priceSliderProps.mim,
      max: priceSliderProps.max,
      showInputsIcon: true,
    },
  });

  const menuOptions = [nameMenuOption, surnameMenuOption, filterByPriceMenuOption];

  useEffect(() => setFilters(DEFAULT_VALUES), [page]);

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
