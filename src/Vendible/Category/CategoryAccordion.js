import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import RootRenderer from './RootRenderer';
import EmptyTreeRenderer from './EmptyTreeRenderer';
import LeafRenderer from './LeafRenderer';

/**
 * @param {AccordionElement} categoryTree
 * @param {String} categoryName
 * @returns { AccordionElement} */
function searchCategoryInTree(categoryTree, categoryName) {
  let found = null;
  const queue = [categoryTree];

  while (queue.length && !found) {
    const current = queue.at(0);
    queue.shift();
    if (current.rootName === categoryName) {
      found = current;
    }

    current.children.forEach((child) => queue.unshift(child));
  }

  return found;
}

function CategoryAccordion({ categories, vendibleType, onCategorySelected }) {
  const [categoriesSubSection, setCategoriesSubSection] = useState([]);

  const handleCategorySelected = (categoryName) => {
    onCategorySelected(categoryName);
  };

  const handleAccordionClick = ({ root, children }) => (
    _,
    expanded,
  ) => {
    setCategoriesSubSection((
      currentCategories,
    ) => {
      const updatedCategories = [...currentCategories];
      let toUpdateElement = null;

      for (let i = 0; !toUpdateElement; i++) {
        toUpdateElement = searchCategoryInTree(updatedCategories[i], root);
      }

      if (expanded) {
        children.forEach(({ root: childRoot, children: newChildren }) => {
          const onChangeChildren = () => handleAccordionClick({
            root: childRoot,
            children: newChildren,
          });

          const isSuperCategory = !!(newChildren.length);

          const toInsertElement = isSuperCategory ? new RootRenderer({
            rootName: childRoot,
            onChange: onChangeChildren,
            isExpanded: false,
            children: [],
          }) : new LeafRenderer({
            rootName: childRoot,
            onChange: onChangeChildren,
            isExpanded: false,
            handleCategorySelected,
          });

          toUpdateElement.children.push(toInsertElement);

          toUpdateElement.isExpanded = true;
        });
      } else {
        toUpdateElement.isExpanded = false;
        toUpdateElement.children = [];
      }
      return updatedCategories;
    });
  };

  useEffect(() => {
    const firstCategoriesSections = [];
    if (!isEmpty(categories)) {
      Object.keys(categories).forEach((rootCategoryName) => {
        const { root, children } = categories[rootCategoryName];

        const isSuperCategory = !!(children.length);

        const childrenJsx = [];

        const onChange = () => handleAccordionClick({ root, children });

        const accordionElement = isSuperCategory ? new RootRenderer({
          rootName: root, onChange, isExpanded: false, children: childrenJsx,
        })
          : new EmptyTreeRenderer({
            rootName: root,
            isExpanded: true,
            handleCategorySelected,
          });

        firstCategoriesSections.push(accordionElement);
      });
    }
    setCategoriesSubSection(firstCategoriesSections);
  }, [categories]);

  if (!isEmpty(categoriesSubSection)) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);
    return (
      <div>
        <Typography variant="h4">
          { categoriesTitle }
        </Typography>
        {
          categoriesSubSection.map((accordionElement) => accordionElement.render())
        }
      </div>
    );
  }
  return null;
}

CategoryAccordion.propTypes = {
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
  categories: PropTypes.objectOf(PropTypes.shape(vendibleCategoryShape)).isRequired,
  onCategorySelected: PropTypes.func.isRequired,
};

export default CategoryAccordion;
