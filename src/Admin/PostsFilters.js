import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import pickBy from 'lodash/pickBy';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
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
import { postStateLabelResolver } from '../Shared/Helpers/ProveedorHelper';

const DEFAULT_BASE_VALUES = {
  proveedorName: '',
  proveedorSurname: '',
  categoryName: '',
  prices: [],
  offersDelivery: null,
  offersInCustomAddress: null,
  priceType: '',
  state: '',
};

const PRODUCT_BASE_VALUES = {
  ...DEFAULT_BASE_VALUES,
  stocks: [STOCK_SLIDER_MIN, STOCK_SLIDER_MAX],
};

const statesValues = ['-', ...Object.values(postStateLabelResolver)];

function PostsFilters({
  getMenuOption, vendibleType, onFilterSelected, page, priceSliderProps,
}) {
  const baseState = useMemo(() => (vendibleType !== PRODUCTS
    ? DEFAULT_BASE_VALUES : PRODUCT_BASE_VALUES), [vendibleType]);

  const [filters, setFilters] = useState({
    ...baseState,
    prices: [priceSliderProps.min, priceSliderProps.max],
  });

  const defaultStateSelected = useMemo(() => {
    if (filters.state) {
      const stateLabel = postStateLabelResolver[filters.state];
      return statesValues.findIndex((state) => state === stateLabel);
    }
    return 0;
  }, [filters.state]);

  const [runApplyFiltersCallback, setRunApplyFiltersCallback] = useState(false);

  const onFilterSet = (key, newValue, shouldRunApplyFiltersCallback = false) => {
    const shouldParseValues = (key === 'priceType') || (key === 'state');

    let parsedValue = newValue;

    if (shouldParseValues) {
      if (newValue === '-') {
        parsedValue = '';
      } else {
        const sourceObject = key === 'priceType' ? PRICE_TYPES : postStateLabelResolver;
        parsedValue = Object.keys(sourceObject).find((k) => sourceObject[k] === newValue);
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
      searcherConfig: {
        sx: {
          width: '100%',
        },
      },
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
      searcherConfig: {
        sx: {
          width: '100%',
        },
      },
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

  const categoryMenuOption = getMenuOption({
    component: SearcherInput,
    onClick: undefined,
    props: {
      title: sharedLabels.mainCategory,
      searcherConfig: {
        sx: {
          width: '100%',
        },
      },
      titleConfig: {
        variant: 'h6',
      },
      onSearchClick: () => onFilterSelected(pickBy(filters, (value) => !!value)),
      keyEvents: {
        onKeyUp: (value) => onFilterSet('categoryName', value),
        onEnterPressed: () => onFilterSelected(pickBy(filters, (value) => !!value)),
        onDeletePressed: (newValue) => {
          onFilterSet('categoryName', newValue);
          if (!newValue) {
            onFilterSelected(pickBy(filters, (value) => !!value));
          }
        },
      },
      inputValue: filters.categoryName,
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
        getAriaValueText={getTextForPricesSliderInput}
        valueLabelFormat={getTextForPricesSliderInput}
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
        getInputTextFunction={(value) => value}
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

  const offersDeliveryMenuOption = (
    <FormControlLabel
      sx={{ mt: '5%' }}
      control={(
        <Switch
          checked={filters.offersDelivery}
          onChange={(event) => onFilterSet('offersDelivery', event.target.checked || null, true)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
)}
      label={sharedLabels.offersDelivery}
    />

  );

  const offersCustomAddressMenuOption = (
    <FormControlLabel
      sx={{ mt: '5%' }}
      control={(
        <Switch
          checked={filters.offersInCustomAddress}
          onChange={(event) => onFilterSet('offersInCustomAddress', event.target.checked || null, true)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
)}
      label={sharedLabels.offersInCustomAddress}
    />

  );

  const stateMenuOption = (
    <Select
      containerStyles={{ mt: '5%', width: '50%' }}
      defaultSelected={defaultStateSelected}
      label={sharedLabels.postState}
      values={statesValues}
      handleOnChange={(value) => onFilterSet('state', value, true)}
    />
  );

  const menuOptions = useMemo(() => {
    const baseOptions = [nameMenuOption, surnameMenuOption, categoryMenuOption,
      filterByPriceMenuOption, filterByPriceTypeMenuOption,
      offersDeliveryMenuOption, offersCustomAddressMenuOption, stateMenuOption];

    if (vendibleType === 'productos') {
      baseOptions.splice(3, 0, filterByStockMenuOption);
    }
    return baseOptions;
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

PostsFilters.propTypes = {
  getMenuOption: PropTypes.func.isRequired,
  vendibleType: PropTypes.oneOf(['productos', 'servicios']).isRequired,
  onFilterSelected: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  priceSliderProps: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
};

export default PostsFilters;
