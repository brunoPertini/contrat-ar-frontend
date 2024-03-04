import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { useEffect, useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks/usePreviousPropValue';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { labels } from '../../StaticData/Cliente';
import RangeSlider from '../../Shared/Components/RangeSlider';
import { getTextForDistanceSliderInput, getTextForPricesSliderInput, locationSliderInputHelperTexts } from '../../Shared/Helpers/ClienteHelper';
import { getLocaleCurrencySymbol } from '../../Shared/Helpers/PricesHelper';
import { ARGENTINA_LOCALE } from '../../Shared/Constants/System';

/**
 * @typedef ProveedoresVendiblesFiltersType
 * @property {Number} category
 * @property {String} categoryName
 * @property {Array<Number>} toFilterDistances
 * @property{Array<number>} prices
 */

/** @type {ProveedoresVendiblesFiltersType } */
const proveedoresVendiblesFiltersModel = {
  category: null,
  categoryName: '',
  toFilterDistances: [],
  prices: [],
};

function replaceArgentinianCurrencySymbol(toCheckValue) {
  const argentinaCurrencySymbol = getLocaleCurrencySymbol(ARGENTINA_LOCALE);
  if (typeof toCheckValue === 'string' && toCheckValue.indexOf(argentinaCurrencySymbol) !== -1) {
    toCheckValue = toCheckValue.replace(argentinaCurrencySymbol, '');
    return true;
  }

  return false;
}

function VendiblesFilters({
  categories, distances, prices, vendibleType,
  onFiltersApplied, containerStyles,
  showAccordionTitle, enabledFilters, priceSliderAdditionalProps,
  alternativeAccordionTitle, distanceSliderAdditionalProps,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const [filtersApplied, setFiltersApplied] = useState({
    ...proveedoresVendiblesFiltersModel,
    toFilterDistances: enabledFilters.distance ? distances : [],
    prices,
  });

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

  /**
   *
   * @param {Array<String | Number>} newValue
   */
  const handleOnPricesChanged = (newValue, comesFromInput, iconPressed = false) => {
    // Handling the case where it may be changed from input
    let shouldParse = false;

    shouldParse = shouldParse || replaceArgentinianCurrencySymbol(newValue[0]);
    shouldParse = shouldParse || replaceArgentinianCurrencySymbol(newValue[1]);

    // eslint-disable-next-line no-new-wrappers
    const parsedValues = shouldParse ? newValue.map((value) => new Number(value)) : newValue;

    let newAppliedFilters = {};
    setFiltersApplied((previous) => {
      newAppliedFilters = ({ ...previous, prices: parsedValues });
      return newAppliedFilters;
    });

    if (!comesFromInput || (comesFromInput && iconPressed)) {
      onFiltersApplied(newAppliedFilters);
    }
    return parsedValues;
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
        <Grid item>
          <Typography variant="h4">
            {showAccordionTitle
              ? vendiblesLabels.appliedFilters
              : vendiblesLabels.appliedCategories}

          </Typography>
          {
            filtersLabels.map((label) => (
              <Chip
                key={`selected_filter_${label}`}
                label={label}
                variant="outlined"
                onDelete={() => handleFilterDeleted(['category', 'categoryName'])}
              />
            ))
          }
        </Grid>
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
          handleOnChange={handleOnPricesChanged}
          getInputTextFunction={getTextForPricesSliderInput}
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
};

export default VendiblesFilters;
