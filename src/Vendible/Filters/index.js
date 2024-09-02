import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks/usePreviousPropValue';
import { labels } from '../../StaticData/Cliente';
import RangeSlider from '../../Shared/Components/RangeSlider';
import { getTextForDistanceSliderInput, getTextForPricesSliderInput, locationSliderInputHelperTexts } from '../../Shared/Helpers/ClienteHelper';
import SelectedFilters from '../../Shared/Components/SelectedFilters';
import { handleSliderValuesChanged } from '../../Shared/Helpers/PricesHelper';
import { EMPTY_FUNCTION } from '../../Shared/Constants/System';

function VendiblesFilters({
  categories, filtersApplied, setFiltersApplied, vendibleType,
  onFiltersApplied, containerStyles,
  showAccordionTitle, enabledFilters, priceSliderAdditionalProps,
  alternativeAccordionTitle, distanceSliderAdditionalProps,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const handleOnCategorySelected = (categoryId, categoryName) => {
    let newAppliedFilters = {};
    setFiltersApplied((previous) => {
      newAppliedFilters = { ...previous, category: categoryId, categoryName };
      return newAppliedFilters;
    });
    onFiltersApplied(newAppliedFilters);
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
    let newAppliedFilters = {};
    setFiltersApplied((previous) => {
      newAppliedFilters = { ...previous };
    });

    filtersKeys.forEach((key) => {
      newAppliedFilters[key] = null;
    });

    setFiltersApplied(newAppliedFilters);
    onFiltersApplied(newAppliedFilters);
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

  const filtersLabels = useMemo(() => {
    const filtersOfInterest = pick(filtersApplied, ['categoryName']);
    return Object.values(filtersOfInterest).filter((label) => label);
  }, [filtersApplied]);

  useEffect(() => {
    if (previousVendibleType && previousVendibleType !== vendibleType) {
      setFiltersApplied({});
    }
  }, [vendibleType]);

  const categoriesSection = (
    <>
      {(isEmpty(filtersLabels)) && (
      <Grid item xs={4}>
        {!showAccordionTitle && alternativeAccordionTitle}
        <CategoryAccordion
          categories={categories}
          vendibleType={vendibleType}
          onCategorySelected={handleOnCategorySelected}
          showTitle={showAccordionTitle}
        />
      </Grid>
      )}
      {
      !(isEmpty(filtersLabels)) && (
        <SelectedFilters
          labels={filtersLabels}
          onDelete={() => handleFilterDeleted(['category', 'categoryName'])}
          showTitle
        />
      )
    }
    </>
  );

  const locationsDistanceSection = (
    <Grid
      item
      sx={{ mt: '5%', ml: '5%' }}
    >
      <Typography variant="h4">
        { labels.filterByDistanceTitle }
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ mt: '5%', ml: '5%' }}
      >
        <Typography id="input-slider" gutterBottom>
          { labels.filterByDistanceExplanation }
        </Typography>
        <RangeSlider
          shouldShowBottomInputs
          values={filtersApplied.toFilterDistances}
          handleOnChange={handleOnDistancesChanged}
          inputTextsHelpers={locationSliderInputHelperTexts}
          getInputTextFunction={getTextForDistanceSliderInput}
          {...distanceSliderAdditionalProps}
        />
      </Box>
    </Grid>

  );

  const priceSection = (
    <Grid
      item
      sx={{ mt: '5%', ml: '5%' }}
    >
      <Typography variant="h4">
        { labels.filterByPriceTitle }
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ mt: '5%', ml: '5%' }}
      >
        <Typography gutterBottom>
          { labels.filterByPriceExplanation }
        </Typography>
        <RangeSlider
          showInputsIcon
          shouldShowBottomInputs
          values={filtersApplied.prices}
          inputTextsHelpers={locationSliderInputHelperTexts}
          handleOnChange={onChangePricesWrapper}
          getInputTextFunction={getTextForPricesSliderInput}
          getAriaValueText={getTextForPricesSliderInput}
          valueLabelFormat={getTextForPricesSliderInput}
          bottomInputsProps={{
            readOnly: false,
          }}
          {...priceSliderAdditionalProps}
        />
      </Box>
    </Grid>
  );

  return (
    <Grid container flexDirection="column" sx={{ ...containerStyles }}>
      {enabledFilters.category && categoriesSection}
      {enabledFilters.distance && locationsDistanceSection}
      {enabledFilters.price && priceSection }
    </Grid>
  );
}

VendiblesFilters.defaultProps = {
  prices: [],
  distances: [],
  containerStyles: {},
  showAccordionTitle: true,
  alternativeAccordionTitle: null,
  enabledFilters: { category: true, distance: false, price: false },
  vendibleType: undefined,
  categories: {},
  distanceSliderAdditionalProps: {},
  priceSliderAdditionalProps: {},
  filtersApplied: {
    category: null,
    categoryName: '',
    toFilterDistances: [],
    prices: [],
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
  }),
};

export default VendiblesFilters;
