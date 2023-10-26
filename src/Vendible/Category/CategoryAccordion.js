/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import AccordionElement from './AccordionElement';

function CategoryAccordion({ categories, vendibleType }) {
  const [categoriesSubSection, setCategoriesSubSection] = useState([]);

  /**
   * @param {AccordionElement} categoryTree
   * @param {String} categoryName
   * @returns { AccordionElement} */
  function searchCategoryInTree(categoryTree, categoryName) {
    if (categoryTree.rootName === categoryName) {
      return categoryTree;
    }
    if (categoryTree.children.length) {
      return categoryTree.children.find((c) => !!(searchCategoryInTree(c, categoryName)));
    }

    return null;
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

export default CategoryAccordion;
