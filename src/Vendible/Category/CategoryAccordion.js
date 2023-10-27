import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import AccordionElement from './AccordionElement';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { vendiblesLabels } from '../../StaticData/Vendibles';

function CategoryAccordion({ categories, vendibleType }) {
  const [categoriesSubSection, setCategoriesSubSection] = useState([]);

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

          toUpdateElement.children.push(new AccordionElement(
            childRoot,
            [],

            !!(newChildren.length),

            onChangeChildren,

            false,
          ));

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

        const accordionElement = new AccordionElement(
          root,
          childrenJsx,

          isSuperCategory,

          onChange,

          false,
        );

        firstCategoriesSections.push(accordionElement);
      });
    }
    setCategoriesSubSection(firstCategoriesSections);
  }, [categories]);

  if (!isEmpty(categoriesSubSection)) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);
    return (
      <div style={{ width: '40%' }}>
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
  vendibleType: PropTypes.string.isRequired,
  categories: PropTypes.objectOf(PropTypes.shape(vendibleCategoryShape)).isRequired,
};

export default CategoryAccordion;
