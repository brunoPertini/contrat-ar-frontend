/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { useEffect, useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Box, Input, Slider, TextField,
} from '@mui/material';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks/usePreviousPropValue';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { labels } from '../../StaticData/Cliente';

function VendiblesFilters({
  categories, distances, vendibleType,
  onFiltersApplied, containerStyles,
  showAccordionTitle, enabledFilters,
  alternativeAccordionTitle,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const [filtersApplied, setFiltersApplied] = useState({
    category: null,
    categoryName: '',
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

  const handleOnDistancesChanged = (event, newValue) => {
    setFiltersApplied((previous) => ({ ...previous, toFilterDistances: newValue }));
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

  const { minValueSlider, maxValueSlider } = useMemo(() => ({
    minValueSlider: distances[0],
    maxValueSlider: distances[distances.length - 1],
  }), [distances]);

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
    <Grid item sx={{ mt: '5%', ml: '5%' }}>
      <Typography variant="h4">
        { labels.filterByDistanceTitle }
      </Typography>
      <Box sx={{ mt: '5%', ml: '5%' }}>
        <Typography id="input-slider" gutterBottom>
          { labels.filterByDistanceExplanation }
        </Typography>
        <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          value={filtersApplied.toFilterDistances}
          onChange={handleOnDistancesChanged}
          step={0.5}
          shiftStep={0.5}
          min={minValueSlider}
          max={maxValueSlider}
        />
        <TextField
          value={`${minValueSlider} Km`}
          helperText="Mínimo"
          size="small"
          readOnly
          inputProps={{
            'aria-labelledby': 'input-slider',
          }}
        />
        <TextField
          value={`${maxValueSlider} Km`}
          helperText="Máximo"
          size="small"
          readOnly
          inputProps={{
            'aria-labelledby': 'input-slider',
          }}
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
};
VendiblesFilters.propTypes = {
  distances: PropTypes.arrayOf(PropTypes.number),
  categories: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  onFiltersApplied: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.string),
  showAccordionTitle: PropTypes.bool,
  alternativeAccordionTitle: PropTypes.node,
  enabledFilters: PropTypes.objectOf(PropTypes.bool),
};

export default VendiblesFilters;
