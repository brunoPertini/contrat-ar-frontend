/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unreachable-loop */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import AccordionElement from './AccordionElement';

function CategoryAccordion({ categories, vendibleType }) {
  const [categoriesSubSection, setCategoriesSubSection] = useState();

  /**
   * @param {AccordionElement} categoryTree
   * @param {String} categoryName
   * @returns { AccordionElement} */
  function searchCategoryInTree(categoryTree, categoryName) {
    if (categoryTree.rootName === categoryName) {
      return categoryTree;
    }
    if (categoryTree.children?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of categoryTree.children) {
        const found = searchCategoryInTree(child, categoryName);
        return found || null;
      }
    }

    return null;
  }

  const handleAccordionClick = ({ root, children }) => (_, isExpanded) => setCategoriesSubSection((currentCategories) => {
    const updatedCategories = [...currentCategories];
    let toUpdateElement = null;
    for (const currentTree of updatedCategories) {
      const r = searchCategoryInTree(currentTree, root);
      if (r) {
        toUpdateElement = r;
      }
    }
    if (isExpanded) {
      children.forEach(({ root: childRoot, children: newChildren }) => {
        const childrenRootJsx = (
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{ childRoot }</Typography>
          </AccordionSummary>
        );
        const onChangeChildren = () => handleAccordionClick({ root: childRoot, children: newChildren });

        toUpdateElement.children.push(new AccordionElement(childRoot, childrenRootJsx, [], !!(newChildren.length), onChangeChildren));
      });
      return updatedCategories;
    }
    return [];
  });

  useEffect(() => {
    const firstCategoriesSections = [];
    if (!isEmpty(categories)) {
      Object.keys(categories).forEach((rootCategoryName) => {
        const { root, children } = categories[rootCategoryName];

        const isSuperCategory = !!(children.length);

        const rootJsx = (
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{ root }</Typography>
          </AccordionSummary>
        );

        const childrenJsx = [];

        const onChange = () => handleAccordionClick({ root, children });

        const accordionElement = new AccordionElement(root, rootJsx, childrenJsx, isSuperCategory, onChange);

        firstCategoriesSections.push(accordionElement);
      });

      setCategoriesSubSection(firstCategoriesSections);
    }
  }, [categories]);

  if (!isEmpty(categoriesSubSection)) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);
    console.log(categoriesSubSection);
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

export default CategoryAccordion;
