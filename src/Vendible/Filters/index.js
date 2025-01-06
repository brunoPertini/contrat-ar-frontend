import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { useCallback, useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import pickBy from 'lodash/pickBy';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks/usePreviousPropValue';
import { labels } from '../../StaticData/Cliente';
import RangeSlider from '../../Shared/Components/RangeSlider';
import { getTextForDistanceSliderInput, getTextForPricesSliderInput, locationSliderInputHelperTexts } from '../../Shared/Helpers/ClienteHelper';
import SelectedFilters from '../../Shared/Components/SelectedFilters';
import { handleSliderValuesChanged } from '../../Shared/Helpers/PricesHelper';
import { EMPTY_FUNCTION } from '../../Shared/Constants/System';
import Select from '../../Shared/Components/Select';
import { sharedLabels } from '../../StaticData/Shared';
import { postStateLabelResolver } from '../../Shared/Helpers/ProveedorHelper';
import { flexColumn } from '../../Shared/Constants/Styles';

const statesValues = ['-', ...Object.values(postStateLabelResolver)];

function VendiblesFilters({
  categories, filtersApplied, setFiltersApplied, vendibleType,
  onFiltersApplied, containerStyles, sliderContainerStyles, stateContainerStyles,
  showAccordionTitle, enabledFilters, priceSliderAdditionalProps,
  alternativeAccordionTitle, distanceSliderAdditionalProps,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const handleOnCategorySelected = async (categoryId, categoryName) => {
    await setFiltersApplied((previous) => ({ ...previous, category: categoryId, categoryName }));
    onFiltersApplied();
  };

  const handleOnStateSelected = async (stateValue) => {
    const stateKey = Object.keys(postStateLabelResolver)
      .find((s) => postStateLabelResolver[s] === stateValue);
    await setFiltersApplied((previous) => ({ ...previous, state: stateValue === '-' ? '' : stateKey }));
    onFiltersApplied();
  };

  const handleOnDistancesChanged = (newValue) => {
    let newAppliedFilters = {};
    setFiltersApplied((previous) => {
      newAppliedFilters = ({ ...previous, toFilterDistances: newValue });
      return newAppliedFilters;
    });
    onFiltersApplied(newAppliedFilters);
  };

  const handleFilterDeleted = (filtersKeys = []) => {
    setFiltersApplied((previous) => {
      const newAppliedFilters = { ...previous };
      filtersKeys.forEach((key) => {
        newAppliedFilters[key] = null;
      });
      return newAppliedFilters;
    });
    onFiltersApplied();
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
    setFiltersApplied,
    onFiltersApplied,
  );

  const filtersLabelsObject = useMemo(() => {
    const filtersOfInterest = pick(filtersApplied, ['categoryName', 'vendibleNombre']);
    return pickBy(filtersOfInterest, (value) => !!value);
  }, [filtersApplied]);

  const defaultStateSelected = useMemo(() => {
    if (filtersApplied.state) {
      const stateLabel = postStateLabelResolver[filtersApplied.state];
      return statesValues.findIndex((state) => state === stateLabel);
    }
    return 0;
  }, [filtersApplied]);

  useEffect(() => {
    if (previousVendibleType && previousVendibleType !== vendibleType) {
      setFiltersApplied({});
    }
  }, [vendibleType]);

  const categoriesSection = !filtersApplied.category && (
  <Box
    sx={{
      mt: 3,
      p: 2,
      borderRadius: 1,
      bgcolor: 'background.paper',
    }}
  >
    <Typography variant="h6" color="primary">
      {!enabledFilters.category ? sharedLabels.category : alternativeAccordionTitle}
    </Typography>
    <CategoryAccordion
      categories={categories}
      vendibleType={vendibleType}
      onCategorySelected={handleOnCategorySelected}
      showTitle={showAccordionTitle}
    />
  </Box>
  );

  const locationsDistanceSection = (
    <Box
      {...flexColumn}
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 1,
        boxShadow: 2,
        bgcolor: 'background.paper',

      }}
    >
      <Typography variant="h6" color="primary">
        {labels.filterByDistanceTitle}
      </Typography>
      <Typography
        color="textSecondary"
        sx={{
          mb: 2,
        }}
        paragraph
      >
        {labels.filterByDistanceExplanation}
      </Typography>
      <RangeSlider
        shouldShowBottomInputs
        values={filtersApplied.toFilterDistances?.length ? filtersApplied.toFilterDistances
          : [distanceSliderAdditionalProps.min, distanceSliderAdditionalProps.max]}
        handleOnChange={handleOnDistancesChanged}
        inputTextsHelpers={locationSliderInputHelperTexts}
        getInputTextFunction={getTextForDistanceSliderInput}
        {...distanceSliderAdditionalProps}
      />
    </Box>
  );

  const priceSection = (
    <Box sx={{
      mt: 3, p: 2, borderRadius: 1, boxShadow: 2, bgcolor: 'background.paper',
    }}
    >
      <Typography variant="h6" color="primary">
        {labels.filterByPriceTitle}
      </Typography>
      <Typography paragraph color="textSecondary" sx={{ mb: 2 }}>
        {labels.filterByPriceExplanation}
      </Typography>
      <RangeSlider
        shouldShowBottomInputs
        values={filtersApplied.prices?.length ? filtersApplied.prices
          : [priceSliderAdditionalProps.min, priceSliderAdditionalProps.max]}
        inputTextsHelpers={locationSliderInputHelperTexts}
        handleOnChange={onChangePricesWrapper}
        getInputTextFunction={getTextForPricesSliderInput}
        getAriaValueText={getTextForPricesSliderInput}
        valueLabelFormat={getTextForPricesSliderInput}
        bottomInputsProps={{ readOnly: false }}
        {...priceSliderAdditionalProps}
      />
    </Box>
  );

  const stateSection = (
    <Select
      containerStyles={{ mt: '5%', ...stateContainerStyles }}
      defaultSelected={defaultStateSelected}
      label={sharedLabels.postState}
      values={statesValues}
      handleOnChange={(value) => handleOnStateSelected(value)}
    />
  );

  const handleDeleteFilter = useCallback((key) => {
    const categoriesKeys = ['category', 'categoryName'];
    return categoriesKeys.includes(key)
      ? handleFilterDeleted(categoriesKeys)
      : handleFilterDeleted([key]);
  }, [handleFilterDeleted]);

  return (
    <Box
      {...flexColumn}
      maxWidth="100%"
      sx={{
        ...containerStyles,
        mt: 2,
      }}
    >
      {
      !(isEmpty(filtersLabelsObject)) && (
        <SelectedFilters
          labels={filtersLabelsObject}
          onDelete={handleDeleteFilter}
          showTitle
        />
      )
    }
      {enabledFilters.category && categoriesSection}
      {
       (enabledFilters.distance || enabledFilters.price) && (
       <Box
         sx={{
           borderRadius: 2,
           border: '1px solid',
           borderColor: 'rgb(36, 134, 164)',
           backgroundColor: 'background.paper',
           boxShadow: 2,
           ...sliderContainerStyles,
         }}
       >
         {enabledFilters.distance && locationsDistanceSection}
         {enabledFilters.price && priceSection }
       </Box>
       )
      }

      {enabledFilters.state && stateSection }
    </Box>
  );
}

VendiblesFilters.defaultProps = {
  prices: [],
  distances: [],
  containerStyles: {},
  showAccordionTitle: true,
  alternativeAccordionTitle: null,
  enabledFilters: {
    category: true, state: true, distance: false, price: false,
  },
  vendibleType: undefined,
  categories: {},
  distanceSliderAdditionalProps: {},
  priceSliderAdditionalProps: {},
  sliderContainerStyles: {},
  stateContainerStyles: {},
  filtersApplied: {
    category: null,
    categoryName: '',
    toFilterDistances: [],
    prices: [],
    state: '',
  },
  setFiltersApplied: EMPTY_FUNCTION,
};

VendiblesFilters.propTypes = {
  prices: PropTypes.arrayOf(PropTypes.number),
  distances: PropTypes.arrayOf(PropTypes.number),
  categories: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)),
  vendibleType: PropTypes.oneOf(['servicios', 'productos']),
  onFiltersApplied: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.string),
  stateContainerStyles: PropTypes.object,
  sliderContainerStyles: PropTypes.object,
  showAccordionTitle: PropTypes.bool,
  alternativeAccordionTitle: PropTypes.node,
  enabledFilters: PropTypes.objectOf(PropTypes.bool),
  distanceSliderAdditionalProps: PropTypes.object,
  priceSliderAdditionalProps: PropTypes.object,
  setFiltersApplied: PropTypes.func,
  filtersApplied: PropTypes.shape({
    category: PropTypes.number,
    categoryName: PropTypes.string,
    toFilterDistances: PropTypes.array,
    prices: PropTypes.array,
    state: PropTypes.string,
  }),
};

export default VendiblesFilters;
