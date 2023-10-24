/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import AccordionElement from './AccordionElement';

function CategoryAccordion({ categories, vendibleType }) {
  const [categoriesSubSection, setCategoriesSubSection] = useState({});

  const handleAccordionClick = ({ root, children }) => (_, isExpanded) => {
    if (isExpanded) {
      const isSuperCategory = !!(children.length);

      const rootJsx = (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{ root }</Typography>
        </AccordionSummary>
      );

      const childrenJsx = children.map(({ root: childRoot, children: newChildren }) => (

        <Accordion onChange={handleAccordionClick({
          root: childRoot,
          children: newChildren,
        })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{ childRoot }</Typography>
          </AccordionSummary>
        </Accordion>
      ));

      const onChange = () => handleAccordionClick({ root, children });

      categoriesSubSection[root]

      const accordionElement = new AccordionElement(rootJsx, childrenJsx, isSuperCategory, onChange);

      setCategoriesSubSection((previous) => ({ ...previous, [root]: accordionElement }));
    } else {
      setCategoriesSubSection((previous) => ({ ...previous, [root]: null }));
    }
  };

  useEffect(() => {
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

        const accordionElement = new AccordionElement(rootJsx, childrenJsx, isSuperCategory, onChange);

        setCategoriesSubSection((previous) => ({ ...previous, [root]: accordionElement }));
      });
    }
  }, [categories]);

  if (!isEmpty(categoriesSubSection)) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);
    return (
      <div>
        <Typography variant="h4">
          { categoriesTitle }
        </Typography>
        {
          Object.values(categoriesSubSection).map((accordionElement) => {
            console.log(accordionElement);
            return accordionElement.render();
          })
        }
      </div>
    );
  }
  return null;
}

export default CategoryAccordion;
