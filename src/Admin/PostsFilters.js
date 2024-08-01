/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import pickBy from 'lodash/pickBy';
import { Box, Typography } from '@mui/material';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SearcherInput from '../Shared/Components/Searcher';
import RangeSlider from '../Shared/Components/RangeSlider';
import { handleSliderValuesChanged } from '../Shared/Helpers/PricesHelper';
import { getTextForPricesSliderInput, locationSliderInputHelperTexts } from '../Shared/Helpers/ClienteHelper';
import { labels } from '../StaticData/Cliente';
import { STOCK_SLIDER_MAX, STOCK_SLIDER_MIN } from '../Shared/Constants/System';

const DEFAULT_VALUES = {
  proveedorName: '',
  proveedorSurname: '',
  categoryName: '',
  prices: [],
  stocks: [STOCK_SLIDER_MIN, STOCK_SLIDER_MAX],
  offersDelivery: null,
  offersInCustomAddress: null,
  priceType: null,
};

function PostsFilters({
  getMenuOption, vendibleType, onFilterSelected, page, priceSliderProps,
}) {
  const [filters, setFilters] = useState(
    { ...DEFAULT_VALUES, prices: [priceSliderProps.min, priceSliderProps.max] },
  );

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
  ) => handleSliderValuesChanged(
    'prices',
    newValues,
    comesFromInput,
    iconPressed,
    setFilters,
    onFilterSelected,
  );

  const onChangeStocksWrapper = (
    newValues,
    comesFromInput,
    iconPressed,
  ) => handleSliderValuesChanged(
    'stocks',
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

  const filterByPriceMenuOption = (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ width: '80%', ml: '5%', mt: '5%' }}
    >
      <Typography gutterBottom>
        { labels.filterByPriceTitle }
      </Typography>
      <RangeSlider
        values={filters.prices}
        handleOnChange={onChangePricesWrapper}
        getInputTextFunction={getTextForPricesSliderInput}
        inputTextsHelpers={locationSliderInputHelperTexts}
        shouldShowBottomInputs
        bottomInputsProps={{
          readOnly: false,
        }}
        step={1}
        min={priceSliderProps.min}
        max={priceSliderProps.max}
        showInputsIcon
      />
    </Box>
  );

  const filterByStockMenuOption = (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ width: '80%', ml: '5%', mt: '5%' }}
    >
      <Typography gutterBottom>
        { labels.filterByStockTitle }
      </Typography>
      <RangeSlider
        values={filters.stocks}
        handleOnChange={onChangeStocksWrapper}
        getInputTextFunction={(text) => `${text} ${sharedLabels.units}`}
        inputTextsHelpers={locationSliderInputHelperTexts}
        shouldShowBottomInputs
        bottomInputsProps={{
          readOnly: false,
        }}
        step={1}
        min={STOCK_SLIDER_MIN}
        max={STOCK_SLIDER_MAX}
        showInputsIcon
      />
    </Box>
  );

  const menuOptions = useMemo(() => {
    const baseOptions = [nameMenuOption, surnameMenuOption, filterByPriceMenuOption];
    return vendibleType !== 'productos' ? baseOptions : [...baseOptions, filterByStockMenuOption];
  }, [vendibleType, filters]);

  useEffect(() => setFilters(DEFAULT_VALUES), [page]);

  useEffect(() => setFilters((previous) => ({
    ...previous,
    prices: [priceSliderProps.min, priceSliderProps.max],
  })), [priceSliderProps]);

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
