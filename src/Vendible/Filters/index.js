import PropTypes from 'prop-types';
import { CheckBoxGroup } from '../../Shared/Components';
import { vendiblesLabels } from '../../StaticData/Vendibles';

function VendiblesFilters({ categories, vendibleType }) {
  let categoriesSection = null;
  if (categories.length) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);
    categoriesSection = (
      <CheckBoxGroup
        elements={categories}
        title={categoriesTitle}
        bottomLabel={vendiblesLabels.categoriesBottomLabel}
      />
    );
  }
  return categoriesSection;
}

VendiblesFilters.defaultProps = {
  categories: [],
};
VendiblesFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  vendibleType: PropTypes.string.isRequired,
};

export default VendiblesFilters;
