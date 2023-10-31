import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import { useEffect, useMemo, useState } from 'react';
import { Chip, Grid, Typography } from '@mui/material';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';

function VendiblesFilters({ categories, vendibleType, onFiltersApplied }) {
  const [filtersApplied, setFiltersApplied] = useState({
    category: '',
  });

  const handleOnCategorySelected = (categoryName) => setFiltersApplied((previous) => ({
    ...previous, category: categoryName,
  }));

  const handleFilterDeleted = (filterValue) => {
    const filterToDelete = Object.keys(filtersApplied)
      .find((key) => filtersApplied[key] === filterValue);
    return setFiltersApplied((previous) => ({
      ...previous,
      [filterToDelete]: '',
    }));
  };

  const filtersLabels = useMemo(() => Object.values(
    filtersApplied,
  ).filter((label) => label), [filtersApplied]);

  useEffect(() => {
    if (filtersLabels.length) {
      const nonEmptyFilters = pickBy(filtersApplied, (value) => filtersLabels.includes(value));
      onFiltersApplied(null, nonEmptyFilters);
    }
  }, [filtersLabels]);

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
