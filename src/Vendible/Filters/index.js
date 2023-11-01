import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';
import { Chip, Grid, Typography } from '@mui/material';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { usePreviousPropValue } from '../../Shared/Hooks';

function VendiblesFilters({ categories, vendibleType, onFiltersApplied }) {
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
    onFiltersApplied(null, newAppliedFilters);
  };

  const handleFilterDeleted = (filterValue) => {
    let newAppliedFilters = {};
    const filterToDelete = Object.keys(filtersApplied)
      .find((key) => filtersApplied[key] === filterValue);
    setFiltersApplied((previous) => {
      newAppliedFilters = { ...previous, [filterToDelete]: '' };
      return newAppliedFilters;
    });
    onFiltersApplied(null, newAppliedFilters);
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
    <Grid container flexDirection="column">
      { (isEmpty(filtersLabels)) && (
      <Grid item xs={4}>
        <CategoryAccordion
          categories={categories}
          vendibleType={vendibleType}
          onCategorySelected={handleOnCategorySelected}
        />
      </Grid>
      )}
      {
        !(isEmpty(filtersLabels)) && (
          <Grid item>
            <Typography variant="h4">Filtros aplicados</Typography>
            {
              filtersLabels.map((label) => <Chip label={label} variant="outlined" onDelete={() => handleFilterDeleted(label)} />)
            }
          </Grid>
        )
      }
    </Grid>
  );
}

VendiblesFilters.defaultProps = {
  categories: {},
};
VendiblesFilters.propTypes = {
  categories: PropTypes.objectOf(PropTypes.shape(vendibleCategoryShape)),
  vendibleType: PropTypes.string.isRequired,
  onFiltersApplied: PropTypes.func.isRequired,
};

export default VendiblesFilters;
