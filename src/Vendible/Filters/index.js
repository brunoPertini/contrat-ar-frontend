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
import { getTextForDistanceSliderInput, locationSliderInputHelperTexts } from '../../Shared/Helpers/ClienteHelper';

/**
 * @typedef ProveedoresVendiblesFiltersType
 * @property {Number} category
 * @property {String} categoryName
 * @property {Array<Number>} toFilterDistances
 */

/** @type {ProveedoresVendiblesFiltersType } */
const proveedoresVendiblesFiltersModel = {
  category: null,
  categoryName: '',
  toFilterDistances: [],
};

function VendiblesFilters({
  categories, distances, vendibleType,
  onFiltersApplied, containerStyles,
  showAccordionTitle, enabledFilters,
  alternativeAccordionTitle,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const [filtersApplied, setFiltersApplied] = useState({
    ...proveedoresVendiblesFiltersModel,
    toFilterDistances: distances,
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
          step={0.5}
        />
      </Box>
    </Grid>

  );

  return (
    <Grid container flexDirection="column" sx={{ ...containerStyles }}>
      {enabledFilters.category && categoriesSection}
      {enabledFilters.distance && locationsDistanceSection}
    </Grid>
  );
}

VendiblesFilters.defaultProps = {
  distances: [],
  containerStyles: {},
  showAccordionTitle: true,
  alternativeAccordionTitle: null,
  enabledFilters: { category: true, distance: false },
  vendibleType: undefined,
  categories: {},
};
VendiblesFilters.propTypes = {
  distances: PropTypes.arrayOf(PropTypes.number),
  categories: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)),
  vendibleType: PropTypes.oneOf(['servicios', 'productos']),
  onFiltersApplied: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.string),
  showAccordionTitle: PropTypes.bool,
  alternativeAccordionTitle: PropTypes.node,
  enabledFilters: PropTypes.objectOf(PropTypes.bool),
};

export default VendiblesFilters;
