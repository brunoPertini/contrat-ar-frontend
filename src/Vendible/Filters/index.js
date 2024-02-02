import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks/usePreviousPropValue';
import { vendiblesLabels } from '../../StaticData/Vendibles';

function VendiblesFilters({
  categories, vendibleType,
  onFiltersApplied, containerStyles,
  showAccordionTitle,
  alternativeAccordionTitle,
}) {
  const previousVendibleType = usePreviousPropValue(vendibleType);

  const [filtersApplied, setFiltersApplied] = useState({
    category: '',
  });

  const handleOnCategorySelected = (categoryName) => {
    let newAppliedFilters = {};
    setFiltersApplied((previous) => {
      newAppliedFilters = { ...previous, category: categoryName };
      return newAppliedFilters;
    });
    onFiltersApplied(newAppliedFilters);
  };

  const handleFilterDeleted = (filterValue) => {
    let newAppliedFilters = {};
    const filterToDelete = Object.keys(filtersApplied)
      .find((key) => filtersApplied[key] === filterValue);
    setFiltersApplied((previous) => {
      newAppliedFilters = { ...previous, [filterToDelete]: '' };
      return newAppliedFilters;
    });
    onFiltersApplied(newAppliedFilters);
  };

  const filtersLabels = useMemo(() => Object.values(
    filtersApplied,
  ).filter((label) => label), [filtersApplied]);

  useEffect(() => {
    if (previousVendibleType && previousVendibleType !== vendibleType) {
      setFiltersApplied({});
    }
  }, [vendibleType]);

  return (
    <Grid container flexDirection="column" sx={{ ...containerStyles }}>
      { (isEmpty(filtersLabels)) && (
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
                  onDelete={() => handleFilterDeleted(label)}
                />
              ))
            }
          </Grid>
        )
      }
    </Grid>
  );
}

VendiblesFilters.defaultProps = {
  containerStyles: {},
  showAccordionTitle: true,
  alternativeAccordionTitle: null,
};
VendiblesFilters.propTypes = {
  categories: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  onFiltersApplied: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.string),
  showAccordionTitle: PropTypes.bool,
  alternativeAccordionTitle: PropTypes.node,
};

export default VendiblesFilters;
