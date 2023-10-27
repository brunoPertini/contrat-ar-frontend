import PropTypes from 'prop-types';
import CategoryAccordion from '../Category/CategoryAccordion';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';

function VendiblesFilters({ categories, vendibleType }) {
  return <CategoryAccordion categories={categories} vendibleType={vendibleType} />;
}

VendiblesFilters.defaultProps = {
  categories: {},
};
VendiblesFilters.propTypes = {
  categories: PropTypes.objectOf(PropTypes.shape(vendibleCategoryShape)),
  vendibleType: PropTypes.string.isRequired,
};

export default VendiblesFilters;
