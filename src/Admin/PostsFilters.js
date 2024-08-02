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
import {
  PRICE_TYPES, pricesTypeMock, PRODUCTS, STOCK_SLIDER_MAX, STOCK_SLIDER_MIN,
} from '../Shared/Constants/System';
import { Select } from '../Shared/Components';

const DEFAULT_BASE_VALUES = {
  proveedorName: '',
  proveedorSurname: '',
  categoryName: '',
  prices: [],
  offersDelivery: null,
  offersInCustomAddress: null,
  priceType: '',
};

const PRODUCT_BASE_VALUES = {
  ...DEFAULT_BASE_VALUES,
  stocks: [STOCK_SLIDER_MIN, STOCK_SLIDER_MAX],
};

function PostsFilters({
  getMenuOption, vendibleType, onFilterSelected, page, priceSliderProps,
}) {
  const baseState = useMemo(() => (vendibleType !== PRODUCTS
    ? DEFAULT_BASE_VALUES : PRODUCT_BASE_VALUES), [vendibleType]);

  const [filters, setFilters] = useState({
    ...baseState,
    prices: [priceSliderProps.min, priceSliderProps.max],
  });

  const [runApplyFiltersCallback, setRunApplyFiltersCallback] = useState(false);

  const onFilterSet = (key, newValue, shouldRunApplyFiltersCallback = false) => {
    let parsedValue = newValue;

    if (key === 'priceType') {
      if (newValue === '-') {
        parsedValue = '';
      } else {
        parsedValue = Object.keys(PRICE_TYPES).find((k) => PRICE_TYPES[k] === newValue);
      }
    }
    setFilters((previous) => ({ ...previous, [key]: parsedValue }));
    setRunApplyFiltersCallback(shouldRunApplyFiltersCallback);
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

  const defaultPriceTypeSelected = useMemo(() => {
    if (filters.priceType) {
      const priceLabel = PRICE_TYPES[filters.priceType];
      return ['-', ...pricesTypeMock].findIndex((priceType) => priceType === priceLabel);
    }

    return 0;
  }, [filters]);

  const filterByPriceTypeMenuOption = (
    <Select
      containerStyles={{ mt: '5%' }}
      defaultSelected={defaultPriceTypeSelected}
      label={sharedLabels.priceType}
      values={['-', ...pricesTypeMock]}
      handleOnChange={(value) => onFilterSet('priceType', value, true)}
    />
  );

  const menuOptions = useMemo(() => {
    const baseOptions = [nameMenuOption, surnameMenuOption,
      filterByPriceMenuOption, filterByPriceTypeMenuOption];
    return vendibleType !== 'productos' ? baseOptions : [...baseOptions, filterByStockMenuOption];
  }, [vendibleType, filters, pricesTypeMock]);

  useEffect(() => setFilters(baseState), [page]);

  useEffect(() => setFilters((previous) => ({
    ...previous,
    prices: [priceSliderProps.min, priceSliderProps.max],
  })), [priceSliderProps]);

  useEffect(() => {
    if (runApplyFiltersCallback) {
      setRunApplyFiltersCallback(false);
      onFilterSelected(pickBy(filters, (value) => !!value));
    }
  }, [runApplyFiltersCallback]);

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
