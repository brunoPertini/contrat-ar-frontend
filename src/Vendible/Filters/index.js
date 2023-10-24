/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import CategoryAccordion from '../Category/CategoryAccordion';

function VendiblesFilters({ categories, vendibleType }) {
  return <CategoryAccordion categories={categories} vendibleType={vendibleType} />;
}

VendiblesFilters.defaultProps = {
  categories: [],
};
VendiblesFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  vendibleType: PropTypes.string.isRequired,
};

export default VendiblesFilters;
